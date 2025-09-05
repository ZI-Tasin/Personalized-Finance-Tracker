import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';
import moment from 'moment';
import TransactionInfoCard from '../Cards/TransactionInfoCard';

// This component will show a filtered list of recent transactions that are expenses.
const ExpenseDetails = ({ transactions }) => {
    const navigate = useNavigate();

    // Filtering the transactions array to only include items of type 'expense'.
    const expenseTransactions = transactions.filter(t => t.type === 'expense').slice(0, 3); // Show max 3

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <div className="flex items-center justify-between mb-6">
                <h5 className="text-lg font-medium">Expenses</h5>
                <button 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary"
                    onClick={() => navigate('/expense')}
                >
                    See All <LuArrowRight />
                </button>
            </div>

            {/* Map over the filtered list to display each expense. */}
            <div className="space-y-2">
                {expenseTransactions.length > 0 ? (
                    expenseTransactions.map((item) => (
                        <TransactionInfoCard
                            key={item._id}
                            title={item.category} // Using 'category' for expenses
                            icon={item.icon}
                            date={moment(item.date).format("Do MMM YYYY")}
                            amount={item.amount}
                            type={item.type}
                            hideDeleteBtn={true}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No recent expenses found.</p>
                )}
            </div>
        </div>
    );
};

export default ExpenseDetails;
