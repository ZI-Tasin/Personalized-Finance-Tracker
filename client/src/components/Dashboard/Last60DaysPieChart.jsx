import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { addThousandSeparator } from '../../utils/helper';

// This is the main component for the Last 60 Days Income Pie Chart.
const Last60DaysPieChart = ({ data, totalIncome }) => {
    // A palette of distinct colors to use for the chart slices.
    const COLORS = [
        '#3b82f6', // Blue
        '#f97316', // Orange
        '#22c55e', // Green
        '#ef4444', // Red
        '#14b8a6', // Teal
        '#eab308', // Yellow
        '#6366f1', // Indigo
        '#ec4899', // Pink
    ];

    // Get all unique source names from the data
    const uniqueSources = [...new Set(data.map(item => item.source))];
    
    // Create a "color map" object that assigns a color to each unique source
    const colorMap = uniqueSources.reduce((acc, source, index) => {
        // Assign a color from the COLORS array. Use modulo to loop back if more sources than colors.
        acc[source] = COLORS[index % COLORS.length];
        return acc;
    }, {});
    
    // Custom Tooltip component to show details on hover.
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0];
            const name = dataPoint.name;
            const value = dataPoint.value;
            const percentage = totalIncome === 0 ? 0 : (value / totalIncome) * 100;

            return (
                <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-200">
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-gray-600 mt-1">
                        {`Amount: $${addThousandSeparator(value)} (${percentage.toFixed(0)}%)`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <h5 className="text-lg font-medium mb-4">Last 60 Days Income</h5>
            <div className="w-full h-80 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }}/>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            innerRadius={80}
                            outerRadius={110}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="amount"
                            nameKey="source"
                        >
                            {/* Use the colorMap to look up the correct color */}
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colorMap[entry.source]} />
                            ))}
                        </Pie>
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-gray-500 text-sm">Total Income</p>
                    <p className="text-2xl font-bold">${addThousandSeparator(totalIncome)}</p>
                </div>
            </div>
        </div>
    );
};

export default Last60DaysPieChart;
