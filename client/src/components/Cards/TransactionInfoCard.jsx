import React from 'react';
import moment from 'moment';


import {
    LuUtensils,
    LuTrendingUp,
    LuTrendingDown,
    LuTrash2,
} from "react-icons/lu";

const TransactionInfoCard = ({
    title,
    icon,
    date,
    amount,
    type, // 'income' or 'expense'
    hideDeleteBtn,
    onDelete,
}) => {

    // Helper function to determine card styling based on type
    const getAmountStyles = () => {
        return type === "income" 
            ? "bg-green-50 text-green-500" 
            : "bg-red-50 text-red-500";
    };

    return (
        <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-xl hover:bg-slate-50">
            {/* Icon Section */}
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-100">
                {icon ? (
                    <img src={icon} alt={title} className="w-6 h-6" />
                ) : (
                    <LuUtensils /> // Default icon
                )}
            </div>

            {/* Title and Date Section */}
            <div className="flex-1 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-700 font-medium">{title}</p>
                    <p className="text-xs text-gray-400 mt-1">{date}</p>
                </div>

                {/* Amount and Type Section */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getAmountStyles()}`}>
                    <h6 className="text-xs font-medium">
                        {type === "income" ? "+" : "-"} ${amount}
                    </h6>
                    {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
                </div>
            </div>

            {/* Delete Button (conditionally rendered) */}
            {!hideDeleteBtn && (
                <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={onDelete}
                >
                    <LuTrash2 size={18} />
                </button>
            )}
        </div>
    );
};

export default TransactionInfoCard;
