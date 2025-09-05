import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { addThousandSeparator } from '../../utils/helper';

// This is the main component for the Last 30 Days Expenses Bar Chart.
const Last30DaysBarChart = ({ data }) => {

    // Creating a custom tooltip to show when a user hovers over a bar.
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            return (
                <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-200">
                    {/* Displaying the category and the exact amount from the data. */}
                    <p className="text-sm font-semibold">{dataPoint.category}</p>
                    <p className="text-sm text-gray-700">Amount: ${addThousandSeparator(dataPoint.amount)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <h5 className="text-lg font-medium mb-4">Last 30 Days Expenses</h5>
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(135, 92, 245, 0.1)' }} />
                        <Bar dataKey="amount" fill="#875cf5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Last30DaysBarChart;
