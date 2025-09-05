import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';
import moment from 'moment';
import TransactionInfoCard from '../Cards/TransactionInfoCard';

// This component shows a filtered list of recent transactions that are income.
const IncomeDetails = ({ transactions }) => {
    const navigate = useNavigate();

    // Filtering the transactions array to only include items of type 'income'.
    const incomeTransactions = transactions.filter(t => t.type === 'income').slice(0, 3);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <div className="flex items-center justify-between mb-6">
                <h5 className="text-lg font-medium">Income</h5>
                <button 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary"
                    onClick={() => navigate('/income')}
                >
                    See All <LuArrowRight />
                </button>
            </div>

            <div className="space-y-2">
                {incomeTransactions.length > 0 ? (
                    incomeTransactions.map((item) => (
                        <TransactionInfoCard
                            key={item._id}
                            // Added className for hover effect
                            className="transition-colors duration-200 ease-in-out hover:bg-gray-50 rounded-lg"
                            title={item.source} // Using 'source' for income
                            icon={item.icon}
                            date={moment(item.date).format("Do MMM YY")}
                            amount={item.amount}
                            type={item.type}
                            hideDeleteBtn={true}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No recent income found.</p>
                )}
            </div>
        </div>
    );
};

export default IncomeDetails;
