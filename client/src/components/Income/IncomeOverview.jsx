import React from 'react';

// Placeholder skeleton for the IncomeOverview component.
const IncomeOverview = ({ transactions, onAddIncome }) => {
    return (
        <div className="p-4 bg-white border border-dashed rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">Income Overview</h2>
            <p className="text-sm text-gray-500 mt-2">
                This section will display a summary and list of your income.
            </p>
            
            {/* We can even make the button work so you can still open your modal */}
            <button 
                onClick={onAddIncome} 
                className="btn-primary mt-4"
            >
                Add Income
            </button>
        </div>
    );
};

export default IncomeOverview;
