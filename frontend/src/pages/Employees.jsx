import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Loader2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://127.0.0.1:5000/api/employees');
            setEmployees(res.data.employees);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee? This action cannot be undone and will delete their attendance records.")) {
            try {
                await axios.delete(`http://127.0.0.1:5000/api/employees/${id}`);
                setEmployees(employees.filter(emp => emp.employee_id !== id));
            } catch (err) {
                alert(err.response?.data?.error || 'Failed to delete employee');
            }
        }
    };

    if (loading) {
        return (
            <div className="loader-container">
                <Loader2 className="spinner" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h1 className="flex items-center gap-3" style={{ margin: 0 }}>
                    <Users size={32} style={{ color: "var(--primary)" }} />
                    Employees
                </h1>
                <Link to="/add" className="btn btn-primary">
                    <Users size={18} />
                    Add Employee
                </Link>
            </div>
            <p className="page-description">Manage your team members, view departments, and adjust organizational distribution.</p>

            {error ? (
                <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <div className="card-body">
                        <p className="form-error">{error}</p>
                    </div>
                </div>
            ) : employees.length === 0 ? (
                <div className="card empty-state">
                    <Users size={48} />
                    <h3>No Employees Found</h3>
                    <p>Get started by adding your first employee to the system.</p>
                    <Link to="/add" className="btn btn-primary mt-4">Add Employee</Link>
                </div>
            ) : (
                <div className="card table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Full Name</th>
                                <th>Email Address</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.employee_id}>
                                    <td className="font-medium text-text-main">{emp.employee_id}</td>
                                    <td>{emp.full_name}</td>
                                    <td className="text-muted">{emp.email}</td>
                                    <td>
                                        <span className="badge badge-neutral">
                                            {emp.department}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(emp.employee_id)}
                                            className="btn btn-outline text-danger hover:bg-red-50"
                                            title="Delete Employee"
                                            style={{ padding: '6px 10px' }}
                                        >
                                            <Trash2 size={16} color="var(--danger)" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Employees;
