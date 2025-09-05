import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'; // Added Tooltip to import
import { addThousandSeparator } from '../../utils/helper';

const FinancialOverview = ({ totalIncome, totalExpenses, totalBalance }) => {
    // Data for the pie chart - no changes here
    const data = [
        { name: 'Total Income', value: totalIncome },
        { name: 'Total Expenses', value: totalExpenses },
    ];

    // Colors for the pie chart slices - no changes here
    const COLORS = ['#FF8042', '#FF0000']; // Orange for Income, Red for Expenses

    // Enhanced Tooltip component
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0];
            const total = totalIncome + totalExpenses;
            
            // Safely calculate percentage, defaulting to 0 if total is 0
            const percentage = total === 0 ? 0 : (dataPoint.value / total) * 100;

            return (
                <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-200">
                    <p className="text-sm font-semibold">{`${dataPoint.name}: ${percentage.toFixed(0)}%`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <h5 className="text-lg font-medium mb-4">Financial Overview</h5>
            <div className="w-full h-80 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        {/* The Tooltip component is using custom function */}
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }} />
                        
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-gray-500 text-sm">Total Balance</p>
                    <p className="text-2xl font-bold">${addThousandSeparator(totalBalance)}</p>
                </div>
            </div>
        </div>
    );
};

export default FinancialOverview;
