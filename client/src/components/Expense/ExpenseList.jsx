import moment from 'moment';
import React from 'react';
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { useMemo, useState } from 'react';

const ExpenseList = ({ transactions, onDelete, onEdit, onDownload }) => {
    const [search, setSearch] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const filtered = useMemo(() => transactions.filter((item) => {
        const date = new Date(item.date).toISOString().slice(0, 10);
        return item.category.toLowerCase().includes(search.trim().toLowerCase()) && (!from || date >= from) && (!to || date <= to);
    }), [transactions, search, from, to]);
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">All Expenses</h5>

                <button 
                    className="flex items-center gap-2 text-sm text-primary font-medium px-4 py-2 rounded-lg hover:bg-primary hover:text-white border border-primary" 
                    onClick={onDownload}
                >
                    <LuDownload className="text-base" />
                    Download Expenses
                </button>
            </div>

            <div className="my-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input aria-label="Search expense category" className="input-box" placeholder="Search category" value={search} onChange={(event) => setSearch(event.target.value)} />
                <input aria-label="From date" className="input-box" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
                <input aria-label="To date" className="input-box" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {filtered.map((expense) => (
                    <TransactionInfoCard
                        key={expense._id}
                        title={expense.category}
                        icon={expense.icon}
                        date={moment(expense.date).format('Do MMM YYYY')}
                        amount={expense.amount}
                        type="expense"
                        onEdit={() => onEdit(expense)}
                        onDelete={() => onDelete(expense._id)}
                    />
                ))}
                {filtered.length === 0 && <p className="text-gray-500 py-6">{transactions.length ? 'No expenses match these filters.' : 'No expenses yet. Add your first expense to get started.'}</p>}
            </div>
        </div>
    );
};

export default ExpenseList;
