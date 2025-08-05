import React from 'react';

// Placeholder skeleton component.
const RecentIncomeWithChart = ({ data, totalIncome }) => {
    return (
        <div className="p-4 mb-6 bg-white border border-dashed rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">Recent Income With Chart</h2>
            <p className="text-sm text-gray-500 mt-2">
                This section will display a chart of recent income.
            </p>
            <p className="mt-4">
                <strong>Total Income:</strong> ${totalIncome}
            </p>
        </div>
    );
};

export default RecentIncomeWithChart;
