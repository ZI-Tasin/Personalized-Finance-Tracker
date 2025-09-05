import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';
import moment from 'moment';
import TransactionInfoCard from '../Cards/TransactionInfoCard';

const RecentTransactions = ({ transactions }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <div className="flex items-center justify-between mb-6">
                <h5 className="text-lg font-medium">Recent Transactions</h5>
                <button 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary"
                    onClick={() => navigate('/expense')} // Or a dedicated transactions page
                >
                    See All <LuArrowRight />
                </button>
            </div>

            {/* List of transactions */}
            <div className="space-y-2">
                {transactions && transactions.length > 0 ? (
                    transactions.slice(0, 5).map((item) => (
                        <TransactionInfoCard
                            key={item._id}
                            title={item.source || item.category} // Use 'source' for income, 'category' for expense
                            icon={item.icon}
                            date={moment(item.date).format("Do MMM YYYY")}
                            amount={item.amount}
                            type={item.type} // 'income' or 'expense', provided by the backend
                            hideDeleteBtn={true} // Don't need a delete button here
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No recent transactions found.</p>
                )}
            </div>
        </div>
    );
};

export default RecentTransactions;
