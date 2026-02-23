import { Outlet, NavLink } from 'react-router-dom';
import { Users, UserPlus, CalendarCheck, Box } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <Box className="w-6 h-6 text-indigo-600" />
                    HRMS Lite
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <Users size={20} />
                        <span>Employees</span>
                    </NavLink>

                    <NavLink
                        to="/add"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <UserPlus size={20} />
                        <span>Add Employee</span>
                    </NavLink>

                    <NavLink
                        to="/attendance"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <CalendarCheck size={20} />
                        <span>Attendance</span>
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <Toaster position="top-right" />
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
