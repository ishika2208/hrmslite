import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Loader2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://hrms-lite-1-1re9.onrender.com/api/employees');
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
                await axios.delete(`https://hrms-lite-1-1re9.onrender.com/api/employees/${id}`);
                setEmployees(employees.filter(emp => emp.employee_id !== id));
                toast.success('Employee deleted successfully.');
            } catch (err) {
                toast.error(err.response?.data?.error || 'Failed to delete employee');
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', animation: 'slideUpFade 0.4s ease-out' }}>
            <div className="flex justify-between items-end mb-8" style={{ paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid rgba(79, 70, 229, 0.15)' }}>
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '32px', margin: 0, lineHeight: '1.2', color: '#111827', letterSpacing: '-0.02em', fontWeight: '700' }}>
                            Team Directory
                        </h1>
                        <p className="text-muted" style={{ fontSize: '15px', marginTop: '6px', marginBottom: 0 }}>
                            Manage your internal workforce, view department structures, and track total employees.
                        </p>
                    </div>
                </div>
                <Link to="/add" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '15px', fontWeight: '600', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)', boxShadow: '0 8px 20px rgba(79, 70, 229, 0.25)', border: 'none' }}>
                    <Users size={18} />
                    Add New Employee
                </Link>
            </div>

            {/* Metric Cards */}
            {!error && employees.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                    <div className="card" style={{ padding: '24px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(0,0,0,0.04)' }}>
                        <div>
                            <p style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '8px' }}>Total Employees</p>
                            <h3 style={{ fontSize: '36px', color: '#111827', margin: 0, fontWeight: '700', lineHeight: 1 }}>{employees.length}</h3>
                        </div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="card" style={{ padding: '24px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(0,0,0,0.04)' }}>
                        <div>
                            <p style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '8px' }}>Active Departments</p>
                            <h3 style={{ fontSize: '36px', color: '#111827', margin: 0, fontWeight: '700', lineHeight: 1 }}>
                                {new Set(employees.map(e => e.department)).size}
                            </h3>
                        </div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d946ef' }}>
                            <Users size={24} />
                        </div>
                    </div>
                </div>
            )}

            {error ? (
                <div className="card" style={{ borderLeft: '4px solid var(--danger)', background: '#fff1f2' }}>
                    <div className="card-body" style={{ padding: '24px' }}>
                        <p className="form-error" style={{ margin: 0, fontWeight: '500' }}>Error connecting to directory: {error}</p>
                    </div>
                </div>
            ) : employees.length === 0 ? (
                <div className="card empty-state" style={{ padding: '80px 20px', border: '1px dashed #cbd5e1', background: '#f8fafc' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', margin: '0 auto 20px auto', boxShadow: 'var(--shadow-sm)' }}>
                        <Users size={40} />
                    </div>
                    <h3 style={{ fontSize: '20px', color: '#1e293b', marginBottom: '8px' }}>No Team Members Yet</h3>
                    <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '400px', margin: '0 auto 24px auto' }}>Your directory is currently empty. Get started by onboarding your first employee to the internal HR system.</p>
                    <Link to="/add" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }}>
                        <Users size={18} /> Add Your First Employee
                    </Link>
                </div>
            ) : (
                <div className="card table-wrapper" style={{ overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                    <table className="table" style={{ margin: 0 }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: '600' }}>Employee Details</th>
                                <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: '600' }}>Contact</th>
                                <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: '600' }}>Department</th>
                                <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: '600', textAlign: 'right' }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.employee_id} style={{ transition: 'background-color 0.2s ease', borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontWeight: '600', fontSize: '14px', border: '1px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                {emp.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: '600', color: '#1e293b', fontSize: '15px' }}>{emp.full_name}</p>
                                                <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px', fontFamily: 'monospace', letterSpacing: '0.02em', marginTop: '2px' }}>{emp.employee_id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px', color: '#475569', fontSize: '14px' }}>{emp.email}</td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <span className={`badge badge-neutral`} style={{ padding: '6px 12px', fontSize: '13px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                                            {emp.department}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleDelete(emp.employee_id)}
                                            style={{
                                                padding: '8px', borderRadius: '8px', border: '1px solid transparent', backgroundColor: 'transparent',
                                                color: '#ef4444', cursor: 'pointer', transition: 'all 0.2s ease'
                                            }}
                                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.borderColor = '#fca5a5'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                            title="Revoke Access & Delete"
                                        >
                                            <Trash2 size={18} />
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
