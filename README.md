# HRMS Lite 🚀

A lightweight, modern Human Resource Management System built for a streamlined administrative experience. 

Currently, this application allows an admin to easily manage employee records and track daily attendance. It focuses on delivering a clean, stable, and professional interface with a robust backend architecture.

## 🔗 Live Deployments

- **Frontend (Live URL):** [Pending Deployment]
- **Backend API:** [Pending Deployment]
- **GitHub Repository:** [https://github.com/ishika2208/HRMS-Lite](https://github.com/ishika2208/HRMS-Lite)

---

## 🛠 Tech Stack

**Frontend:**
- **React.js** (Bootstrapped with Vite for high performance)
- **Vite** (Build tool)
- **React Router** (Client-side routing)
- **Axios** (HTTP client for API requests)
- **Lucide React** (Beautiful, consistent iconography)
- **Vanilla CSS** (Custom, responsive, and modern styling with CSS variables)

**Backend:**
- **Python 3.x**
- **Flask** (Lightweight WSGI web application framework)
- **Flask-CORS** (Cross-Origin Resource Sharing handling)
- **PyMongo** (MongoDB driver for Python)
- **Dotenv** (Environment variable management)

**Database:**
- **MongoDB Atlas** (Cloud-hosted NoSQL database)

---

## ⚙️ How to Run Locally

Follow these instructions to get the application up and running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Python](https://www.python.org/downloads/) (v3.8+)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/ishika2208/HRMS-Lite.git
cd HRMS-Lite
```

### 2. Backend Setup
Open a new terminal window inside the root directory:

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install Flask Flask-CORS pymongo python-dotenv

# Create a .env file and add your MongoDB connection string
echo MONGO_URI="your_mongodb_connection_string" > .env

# Run the Flask API server
python app.py
```
*The backend should now be running on `http://127.0.0.1:5000` (or the port specified in your code).*

### 3. Frontend Setup
Open a second terminal window inside the root directory:

```bash
# Navigate to the frontend directory
cd frontend

# Install the necessary NPM packages
npm install

# Start the Vite development server
npm run dev
```
*The React app should now be running. Usually on `http://localhost:5173`.*

---

## 📌 Assumptions & Limitations

- **Authentication:** For the scope of this "Lite" version, it is assumed there is a single admin user operating the application. There is no active authentication/authorization or RBAC (Role-Based Access Control) layered over the endpoints.
- **Environment Context:** The timezone for attendance is based on the local system/browser time of the administrator executing the application.
- **Attendance Model:** Instead of complex shift or hour-tracking, attendance is simplified to a binary "Present" or "Absent" state per day.
- **Data Deletion:** Deleting an employee cascading deletes their attendance records (to be strictly implemented in backend logic), ensuring database integrity.

---

## ✨ Features Implemented (Scope)

1. **Employee Management:** Add, view, and reliably delete employee profiles (ID, Name, Email, Department). Validations check for duplicate ID constraints and email formats.
2. **Attendance Management:** Smooth "daily" view to mark an employee Present or Absent.
3. **Responsive UI:** Clean layouts mimicking an enterprise dashboard style, optimized for desktop and accessible on smaller screens. 

*Designed and developed by Ishika for Interview Evaluation.*
