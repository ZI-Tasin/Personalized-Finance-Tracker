import React from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { addThousandSeparator } from '../../utils/helper';

// This is the main component that maps over the budgets.
const BudgetList = ({ budgets, onDelete }) => {
    if (!budgets || budgets.length === 0) {
        return <p className="text-center text-gray-500 mt-8">No budgets created for this month yet. Add one to get started!</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
                <BudgetCard key={budget._id} budget={budget} onDelete={onDelete} />
            ))}
        </div>
    );
};


const BudgetCard = ({ budget, onDelete }) => {
    const { category, amount, spentAmount } = budget;
    // RemainingAmount calculation.
    const remainingAmount = amount - spentAmount;
    const percentageSpent = amount > 0 ? (spentAmount / amount) * 100 : 0;
    
    // Determine the progress bar color based on spending.
    const progressBarColor = percentageSpent > 90 ? 'bg-red-500' : percentageSpent > 70 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        // Using Tailwind CSS classes to create the card layout.
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 relative group">
            {/* The delete button will only appear when I hover over the card. */}
            <button 
                onClick={() => onDelete(budget._id)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <LuTrash2 />
            </button>
            
            <h3 className="font-bold text-xl mb-1">{category}</h3>
            <p className="text-sm text-gray-500">Budget: ${addThousandSeparator(amount)}</p>
            
            <div className="mt-6">
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                        className={`${progressBarColor} h-2.5 rounded-full`} 
                        style={{ width: `${Math.min(percentageSpent, 100)}%` }}
                    ></div>
                </div>
                
                {/* Spent vs. Remaining Text */}
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Spent: <span className="font-medium">${addThousandSeparator(spentAmount.toFixed(2))}</span></span>
                    <span>Remaining: <span className="font-medium">${addThousandSeparator(remainingAmount.toFixed(2))}</span></span>
                </div>
            </div>
        </div>
    );
};

export default BudgetList;
