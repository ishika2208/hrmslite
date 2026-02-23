import os
from pymongo import MongoClient
from datetime import datetime, timedelta
import random

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/hrms_db")
client = MongoClient(MONGO_URI)
db = client['hrms_db']

employees_collection = db["employees"]
attendance_collection = db["attendance"]

# Clear existing data
employees_collection.delete_many({})
attendance_collection.delete_many({})

print("Existing data cleared.")

# Sample Professional Data
employees = [
    {"employee_id": "EMP-9001", "full_name": "Arjun Sharma", "email": "arjun.s@company.com", "department": "Engineering"},
    {"employee_id": "EMP-9002", "full_name": "Priya Patel", "email": "priya.p@company.com", "department": "Product"},
    {"employee_id": "EMP-9003", "full_name": "Rahul Verma", "email": "rahul.verma@company.com", "department": "Design"},
    {"employee_id": "EMP-9004", "full_name": "Neha Gupta", "email": "neha.gupta@company.com", "department": "Engineering"},
    {"employee_id": "EMP-9005", "full_name": "Vikram Singh", "email": "vikram.s@company.com", "department": "Human Resources"},
    {"employee_id": "EMP-9006", "full_name": "Ananya Desai", "email": "ananya.d@company.com", "department": "Sales"},
    {"employee_id": "EMP-9007", "full_name": "Rohan Iyer", "email": "rohan.iyer@company.com", "department": "Marketing"},
    {"employee_id": "EMP-9008", "full_name": "Kavya Menon", "email": "k.menon@company.com", "department": "Finance"}
]

# Insert Employees
for emp in employees:
    emp["created_at"] = datetime.utcnow()
    try:
        employees_collection.insert_one(emp)
    except Exception as e:
        print(f"Error inserting {emp['employee_id']}: {e}")

print(f"Seeded {len(employees)} employees.")

# Insert Attendance for the past 5 days
today = datetime.utcnow()
attendance_records = []

for emp in employees:
    for i in range(5):
        date_obj = today - timedelta(days=i)
        date_str = date_obj.strftime("%Y-%m-%d")
        
        # 85% chance of being Present
        status = "Present" if random.random() < 0.85 else "Absent"
        
        attendance_records.append({
            "employee_id": emp["employee_id"],
            "date": date_str,
            "status": status,
            "updated_at": datetime.utcnow()
        })

if attendance_records:
    attendance_collection.insert_many(attendance_records)
    print(f"Seeded {len(attendance_records)} attendance records.")

print("Database seeding completed securely!")
