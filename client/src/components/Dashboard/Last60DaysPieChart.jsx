import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { addThousandSeparator } from '../../utils/helper';

const Last60DaysPieChart = ({ data, totalIncome }) => {
    const COLORS = [
        '#3b82f6', '#f97316', '#22c55e', '#ef4444',
        '#14b8a6', '#eab308', '#6366f1', '#ec4899',
    ];

    const uniqueSources = [...new Set(data.map(item => item.source))];
    
    const colorMap = uniqueSources.reduce((acc, source, index) => {
        acc[source] = COLORS[index % COLORS.length];
        return acc;
    }, {});
    
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
