import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, Mail, Building, User, Briefcase, Hash, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AddEmployee = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: 'Engineering'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const departments = ['Engineering', 'Human Resources', 'Marketing', 'Sales', 'Finance', 'Operations', 'IT Support'];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.employee_id || !formData.full_name || !formData.email || !formData.department) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        try {
            await axios.post('https://hrms-lite-1-1re9.onrender.com/api/employees', formData);
            toast.success('Employee successfully onboarded!');
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'An unexpected error occurred while adding the employee.';
            setError(errorMsg);
            toast.error(errorMsg);
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '650px', margin: '0 auto', animation: 'slideUpFade 0.4s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid var(--border-light)', backgroundColor: 'white', color: 'var(--text-muted)', cursor: 'pointer',
                        transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                    onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '28px', margin: 0, lineHeight: '1.2', color: '#111827', letterSpacing: '-0.02em', fontWeight: '700' }}>Add New Team Member</h1>
                    <p className="text-muted" style={{ fontSize: '14px', marginTop: '4px', marginBottom: 0 }}>Create a new employee profile in the directory.</p>
                </div>
            </div>

            <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative Background Blob */}
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none' }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {error && (
                        <div style={{ padding: '16px', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '12px', marginBottom: '32px', fontSize: '14px', display: 'flex', alignItems: 'flex-start', gap: '12px', border: '1px solid #fecaca' }}>
                            <div style={{ marginTop: '2px' }}><XCircle size={18} /></div>
                            <div>
                                <strong style={{ fontWeight: '600', display: 'block', marginBottom: '4px' }}>Submission Error</strong>
                                {error}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                        <div>
                            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', marginBottom: '20px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User size={16} /> Personal Details
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Employee ID <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <input
                                        type="text"
                                        name="employee_id"
                                        value={formData.employee_id}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="e.g. EMP-9100"
                                        style={{ height: '52px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="e.g. Rahul Verma"
                                        style={{ height: '52px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ height: '1px', background: 'linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)', margin: '4px 0' }}></div>

                        <div>
                            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', marginBottom: '20px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Building size={16} /> Work Profile
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Work Email Address <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="rahul.verma@company.com"
                                            style={{ height: '52px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', paddingLeft: '44px' }}
                                        />
                                        <Mail size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '17px' }} />
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Department Assignment <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="form-control"
                                            style={{ height: '52px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', paddingLeft: '44px', cursor: 'pointer', appearance: 'none' }}
                                        >
                                            {departments.map((dep) => (
                                                <option key={dep} value={dep}>{dep}</option>
                                            ))}
                                        </select>
                                        <Briefcase size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '17px' }} />
                                        {/* Custom dropdown arrow to replace default browser appearance since we hid it */}
                                        <div style={{ position: 'absolute', right: '16px', top: '18px', pointerEvents: 'none', color: '#6b7280' }}>
                                            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.5 2L7 7.5L12.5 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '16px' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ width: '100%', height: '56px', fontSize: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)', boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)', transition: 'all 0.3s ease' }}
                            >
                                {loading ? <Loader2 className="spinner" style={{ width: '22px', height: '22px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : <UserPlus size={20} />}
                                {loading ? 'Finalizing Profile...' : 'Complete Registration'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;
