import os
import re
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for cross-origin requests from React
CORS(app)

# MongoDB Connection String from .env
MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/hrms_db")
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Check if connected
    client.server_info()
    db = client.get_default_database()
    if db.name is None:
        db = client['hrms_db']
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
    # Fallback to local
    client = MongoClient("mongodb://127.0.0.1:27017/")
    db = client['hrms_db']

# Collections
employees_collection = db["employees"]
attendance_collection = db["attendance"]

# Create unique index on employee_id for validation
employees_collection.create_index("employee_id", unique=True)
employees_collection.create_index("email", unique=True)

# Helper function to validate email
def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

# Basic Health Route
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "HRMS API is running!"}), 200

# ==========================================
# EMPLOYEE MANAGEMENT ENDPOINTS
# ==========================================

@app.route('/api/employees', methods=['POST'])
def add_employee():
    """Adds a new employee to the system."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    employee_id = data.get("employee_id", "").strip()
    full_name = data.get("full_name", "").strip()
    email = data.get("email", "").strip()
    department = data.get("department", "").strip()

    # Basic validations
    if not employee_id or not full_name or not email or not department:
        return jsonify({"error": "employee_id, full_name, email, and department are required"}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Invalid email format"}), 400

    new_employee = {
        "employee_id": employee_id,
        "full_name": full_name,
        "email": email,
        "department": department,
        "created_at": datetime.utcnow()
    }

    try:
        employees_collection.insert_one(new_employee)
        return jsonify({"message": "Employee added successfully!", "employee_id": employee_id}), 201
    except DuplicateKeyError as e:
        if "employee_id" in str(e):
            return jsonify({"error": f"Employee ID '{employee_id}' already exists"}), 409
        if "email" in str(e):
            return jsonify({"error": f"Email '{email}' is already registered to another employee"}), 409
        return jsonify({"error": "Duplicate key error"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees', methods=['GET'])
def get_employees():
    """Retrieve all employees from the system."""
    try:
        employees = list(employees_collection.find({}, {"_id": 0})) # Exclude MongoDB ObjectId
        return jsonify({"employees": employees}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees/<string:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    """Delete an employee and their associated attendance records."""
    try:
        # Delete employee profile
        result = employees_collection.delete_one({"employee_id": employee_id})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Employee not found"}), 404
        
        # Cascading delete: Remove attendance records for the deleted employee
        attendance_collection.delete_many({"employee_id": employee_id})

        return jsonify({"message": f"Employee {employee_id} and associated attendance deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==========================================
# ATTENDANCE MANAGEMENT ENDPOINTS
# ==========================================

@app.route('/api/attendance', methods=['POST'])
def mark_attendance():
    """Mark attendance for an employee for a specific date."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    employee_id = data.get("employee_id", "").strip()
    date_str = data.get("date", "").strip() # Format: YYYY-MM-DD
    status = data.get("status", "").strip().capitalize() # "Present" or "Absent"

    if not employee_id or not date_str or not status:
        return jsonify({"error": "employee_id, date, and status are required"}), 400

    if status not in ["Present", "Absent"]:
        return jsonify({"error": "Status must be either 'Present' or 'Absent'"}), 400

    # Ensure employee exists
    employee = employees_collection.find_one({"employee_id": employee_id})
    if not employee:
        return jsonify({"error": "Employee does not exist"}), 404

    try:
        # Validate date format essentially (if fails, it raises ValueError)
        datetime.strptime(date_str, "%Y-%m-%d")

        # Upsert logic: if an entry for this employee on this date exists, update it, else insert.
        query = {"employee_id": employee_id, "date": date_str}
        update = {"$set": {"status": status, "updated_at": datetime.utcnow()}}
        
        attendance_collection.update_one(query, update, upsert=True)

        return jsonify({"message": f"Attendance marked as {status} for {date_str}"}), 200
    except ValueError:
        return jsonify({"error": "Invalid date format. Please use YYYY-MM-DD"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/attendance/<string:employee_id>', methods=['GET'])
def get_attendance(employee_id):
    """Retrieve all attendance records for a specific employee."""
    try:
        # Ensure employee exists
        employee = employees_collection.find_one({"employee_id": employee_id})
        if not employee:
            return jsonify({"error": "Employee does not exist"}), 404

        records = list(attendance_collection.find({"employee_id": employee_id}, {"_id": 0}).sort("date", -1))
        
        # Calculate bonus: total present days
        total_present = sum(1 for record in records if record.get("status") == "Present")
        total_absent = sum(1 for record in records if record.get("status") == "Absent")

        return jsonify({
            "employee_id": employee_id,
            "full_name": employee["full_name"],
            "records": records,
            "summary": {
                "total_present": total_present,
                "total_absent": total_absent,
                "total_days_recorded": len(records)
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Run the server on localhost port 5000
    app.run(debug=True, host='0.0.0.0', port=5000)
