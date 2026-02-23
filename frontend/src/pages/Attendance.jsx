import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, CalendarCheck, CalendarSearch, CheckCircle2, XCircle, User, CalendarDays, History } from 'lucide-react';
import toast from 'react-hot-toast';

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [attendanceData, setAttendanceData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    // Today's date initialized
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('Present');
    const [isConfirmed, setIsConfirmed] = useState(false);

    // Filter for attendance history
    const [filterDate, setFilterDate] = useState('');

    // Fetch employees list to populate dropdown
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const res = await axios.get('https://hrms-lite-1-1re9.onrender.com/api/employees');
                setEmployees(res.data.employees);
                if (res.data.employees.length > 0) {
                    setSelectedEmployee(res.data.employees[0].employee_id);
                }
            } catch (err) {
                setError('Failed to load employees for dropdown');
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    // Fetch individual attendance when selecting an employee
    useEffect(() => {
        if (!selectedEmployee) return;

        const fetchAttendance = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`https://hrms-lite-1-1re9.onrender.com/api/attendance/${selectedEmployee}`);
                setAttendanceData(res.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setAttendanceData(null);
                } else {
                    setError('Failed to fetch attendance history');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, [selectedEmployee]);

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) return;

        try {
            setActionLoading(true);
            await axios.post('https://hrms-lite-1-1re9.onrender.com/api/attendance', {
                employee_id: selectedEmployee,
                date: date,
                status: status
            });

            // Refetch attendance to update view
            const res = await axios.get(`https://hrms-lite-1-1re9.onrender.com/api/attendance/${selectedEmployee}`);
            setAttendanceData(res.data);

            // Trigger confirmed animation state
            setIsConfirmed(true);
            toast.success(`Marked as ${status} for ${date}`);
            setTimeout(() => setIsConfirmed(false), 2000);

        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to mark attendance');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading && employees.length === 0) {
        return (
            <div className="loader-container">
                <Loader2 className="spinner" />
            </div>
        );
    }

    const selectedEmpDetails = employees.find(emp => emp.employee_id === selectedEmployee);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="flex justify-between items-center mb-2 responsive-header">
                <div>
                    <h1 className="flex items-center gap-3" style={{ margin: 0 }}>
                        <CalendarCheck size={36} style={{ color: "var(--primary)" }} />
                        Attendance Tracker
                    </h1>
                    <p className="page-description mt-2" style={{ marginBottom: '32px' }}>
                        Manage and review daily attendance records in a streamlined interface.
                    </p>
                </div>
            </div>

            {employees.length === 0 ? (
                <div className="card empty-state">
                    <CalendarSearch size={48} />
                    <h3>No Employees to Track</h3>
                    <p>Add employees before tracking their attendance.</p>
                </div>
            ) : (
                <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px', alignItems: 'start' }}>

                    {/* Left Column: Form & History */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                        {/* Action Panel */}
                        <div className="card">
                            <div className="card-header" style={{ backgroundColor: 'white', padding: '24px 32px' }}>
                                <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <CalendarDays size={22} className="text-primary" /> Log Daily Attendance
                                </h2>
                            </div>
                            <div className="card-body" style={{ background: '#f8fafc', borderTop: '1px solid var(--border-light)' }}>
                                <form onSubmit={handleMarkAttendance} style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>

                                    <div className="form-group" style={{ flex: '2', minWidth: '200px', marginBottom: 0 }}>
                                        <label className="form-label text-sm text-muted">Select Target Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            style={{ height: '48px', backgroundColor: 'white' }}
                                        />
                                    </div>

                                    <div className="form-group" style={{ flex: '1.5', minWidth: '150px', marginBottom: 0 }}>
                                        <label className="form-label text-sm text-muted">Select Status</label>
                                        <select
                                            className="form-control"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            style={{ height: '48px', backgroundColor: 'white' }}
                                        >
                                            <option value="Present">Present (Active)</option>
                                            <option value="Absent">Absent (Leave)</option>
                                        </select>
                                    </div>

                                    <div className="form-group" style={{ flex: '1', minWidth: '140px', marginBottom: 0 }}>
                                        <button
                                            type="submit"
                                            disabled={actionLoading || isConfirmed}
                                            className={`btn ${status === 'Present' || isConfirmed ? 'btn-primary' : 'btn-danger'} w-full`}
                                            style={{
                                                height: '48px',
                                                backgroundColor: isConfirmed ? 'var(--success)' : '',
                                                borderColor: isConfirmed ? 'var(--success)' : '',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {actionLoading ? <Loader2 className="spinner" style={{ width: 18, height: 18 }} /> : (isConfirmed || status === 'Present' ? <CheckCircle2 size={18} /> : <XCircle size={18} />)}
                                            {actionLoading ? 'Saving...' : (isConfirmed ? 'Confirmed!' : 'Confirm')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* History Table */}
                        <div className="card">
                            <div className="card-header" style={{ padding: '24px 32px' }}>
                                <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <History size={22} className="text-primary" /> Attendance Log
                                </h2>
                            </div>

                            {loading && selectedEmployee ? (
                                <div className="loader-container" style={{ minHeight: '200px' }}>
                                    <Loader2 className="spinner" />
                                </div>
                            ) : attendanceData?.records?.length > 0 ? (
                                <div>
                                    <div className="responsive-filter" style={{ padding: '24px 32px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid var(--border-light)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', width: '100%', justifyContent: 'flex-start' }}>
                                            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', whiteSpace: 'nowrap' }}>Filter by Date:</span>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={filterDate}
                                                onChange={(e) => setFilterDate(e.target.value)}
                                                style={{ height: '36px', minWidth: '150px', flex: '1', backgroundColor: '#f8fafc', fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                            />
                                            {filterDate && (
                                                <button onClick={() => setFilterDate('')} className="btn btn-outline" style={{ height: '36px', padding: '0 12px', fontSize: '13px' }}>Clear</button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="table-wrapper" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                        <table className="table">
                                            <thead style={{ position: 'sticky', top: 0, zIndex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                <tr>
                                                    <th>Record Date (YYYY-MM-DD)</th>
                                                    <th>Attendance Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {attendanceData.records
                                                    .filter(record => filterDate === '' || record.date === filterDate)
                                                    .map((record) => (
                                                        <tr key={record.date}>
                                                            <td className="font-medium" style={{ color: '#111827' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                    <CalendarDays size={16} className="text-muted" />
                                                                    {record.date}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${record.status === 'Present' ? 'badge-success' : 'badge-danger'}`} style={{ padding: '6px 14px' }}>
                                                                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor', marginRight: '6px' }}></span>
                                                                    {record.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="empty-state" style={{ padding: '60px 20px', backgroundColor: 'transparent', border: 'none' }}>
                                    <History size={48} />
                                    <h3>No History Available</h3>
                                    <p>No records found for the selected employee.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Employee Context & Stats Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        <div className="card" style={{ padding: '32px 24px', textAlign: 'center', background: 'white' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-main)', margin: '0 auto 20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #f8fafc', boxShadow: 'var(--shadow-sm)' }}>
                                <User size={40} className="text-muted" />
                            </div>

                            <div className="form-group" style={{ textAlign: 'left', marginBottom: '24px' }}>
                                <label className="form-label text-sm text-muted">Viewing Employee</label>
                                <select
                                    className="form-control"
                                    value={selectedEmployee}
                                    onChange={(e) => setSelectedEmployee(e.target.value)}
                                    style={{ height: '48px', fontWeight: '500', boxShadow: 'var(--shadow-sm)', borderColor: '#e5e7eb' }}
                                >
                                    {employees.map(emp => (
                                        <option key={emp.employee_id} value={emp.employee_id}>
                                            {emp.full_name} ({emp.employee_id})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedEmpDetails && (
                                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', textAlign: 'left' }}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <p className="text-xs text-muted mb-1" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '12px' }}>Department</p>
                                        <p className="font-medium" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span className="badge badge-neutral">{selectedEmpDetails.department}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted mb-1" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '12px' }}>Email Contact</p>
                                        <p style={{ fontSize: '14px', color: '#374151', wordBreak: 'break-all' }}>{selectedEmpDetails.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Summary Stats */}
                        {attendanceData?.summary && (
                            <div className="card" style={{ padding: '24px', background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)' }}>
                                <h3 style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Overall Statistics</h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--success-bg)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.1)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--success)' }}>
                                            <CheckCircle2 size={24} />
                                            <span style={{ fontWeight: '500' }}>Total Present</span>
                                        </div>
                                        <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)' }}>{attendanceData.summary.total_present}</span>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--absent-bg)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(225,29,72,0.1)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--absent)' }}>
                                            <XCircle size={24} />
                                            <span style={{ fontWeight: '500' }}>Total Absent</span>
                                        </div>
                                        <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--absent)' }}>{attendanceData.summary.total_absent}</span>
                                    </div>

                                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                            Total logged days: <strong>{attendanceData.summary.total_days_recorded}</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
