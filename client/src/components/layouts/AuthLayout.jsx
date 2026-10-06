import React from 'react';

const AuthLayout = ({ children }) => {
    return <div className='flex'>
        <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
            <h2 className='text-lg font-medium text-black'>Personalized Finance Tracker</h2>
            {children}
        </div>

        <div className='hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative'>
            <div className='w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5' />
            <div className='w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] right-10' />
            <div className='w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5' />
            <div className="relative z-10 mt-20 max-w-md rounded-3xl border border-white/60 bg-white/80 p-8 shadow-lg shadow-violet-900/5 backdrop-blur-sm">
                <p className="text-sm font-medium text-primary">Personal finance, made clearer</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-900">Keep income, spending, and budgets together.</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">Record your transactions and use your dashboard to review the activity you have entered.</p>
            </div>
        </div>
    </div>;
};

export default AuthLayout
