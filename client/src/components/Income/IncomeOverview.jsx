import React, { useState, useEffect } from 'react';
import { LuPlus } from 'react-icons/lu';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { prepareIncomeChartData } from '../../utils/helper';

const IncomeOverview = ({ transactions, onAddIncome }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareIncomeChartData(transactions);
        setChartData(result);
    }, [transactions]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-200">
                    <p className="text-sm font-semibold">Amount: ${payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <div className="flex items-center justify-between">
                <div>
                    <h5 className="text-lg font-semibold">Income Overview</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your earnings over time and analyze your income trends.
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-white text-sm px-4 py-2 rounded-lg" onClick={onAddIncome}>
                    <LuPlus />
                    Add Income
                </button>
            </div>

            <div className="mt-8 w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(135, 92, 245, 0.1)' }} />
                        <Bar dataKey="amount" fill="#875cf5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default IncomeOverview;
