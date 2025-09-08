import moment from 'moment';
import React from 'react';
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';

const ExpenseList = ({ transactions, onDelete, onDownload }) => {
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

            <div className="grid grid-cols-1 md:grid-cols-2">
                {transactions.map((expense) => (
                    <TransactionInfoCard
                        key={expense._id}
                        title={expense.category}
                        icon={expense.icon}
                        date={moment(expense.date).format('Do MMM YYYY')}
                        amount={expense.amount}
                        type="expense"
                        onDelete={() => onDelete(expense._id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExpenseList;
