import React from 'react';

// This is a basic layout component. It provides a consistent structure for all dashboard pages.
// The `children` prop is a special prop that will render whatever components you place inside <DashboardLayout>.
const DashboardLayout = ({ children }) => {
    return (
        <div className="flex">
            {/* Sidebar (Placeholder) */}
            <aside className="w-64 bg-gray-800 text-white p-4 hidden md:block">
                <h2 className="text-xl font-bold mb-6">Finance Tracker</h2>
                <nav>
                    <ul>
                        <li className="mb-4"><a href="/dashboard" className="hover:text-violet-400">Dashboard</a></li>
                        <li className="mb-4"><a href="/income" className="hover:text-violet-400">Income</a></li>
                        <li className="mb-4"><a href="/expense" className="hover:text-violet-400">Expenses</a></li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 bg-gray-100">
                {/* The content of your specific page (e.g., Income) will be rendered here */}
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
