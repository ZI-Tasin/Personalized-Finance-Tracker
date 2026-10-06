import React from 'react';
import {
    LuUtensils,
    LuTrendingUp,
    LuTrendingDown,
    LuTrash2,
    LuPencil,
} from "react-icons/lu";

const TransactionInfoCard = ({
    title,
    icon,
    date,
    amount,
    type,
    hideDeleteBtn,
    onDelete,
    onEdit,
}) => {

    const getAmountStyles = () => {
        return type === "income" 
            ? "bg-green-50 text-green-500" 
            : "bg-red-50 text-red-500";
    };

    return (
        <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-xl hover:bg-slate-50">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-100">
                {icon ? (
                    <img src={icon} alt={title} className="w-6 h-6" />
                ) : (
                    <LuUtensils /> // Default icon
                )}
            </div>

            <div className="flex-1 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-700 font-medium">{title}</p>
                    <p className="text-xs text-gray-400 mt-1">{date}</p>
                </div>

                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getAmountStyles()}`}>
                    <h6 className="text-xs font-medium">
                        {type === "income" ? "+" : "-"} ${amount}
                    </h6>
                    {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
                </div>
            </div>

            {!hideDeleteBtn && (
                <div className="flex items-center gap-2">
                    {onEdit && <button type="button" aria-label={`Edit ${title}`} className="text-gray-400 hover:text-primary" onClick={onEdit}><LuPencil size={17} /></button>}
                    {onDelete && <button type="button" aria-label={`Delete ${title}`} className="text-gray-400 hover:text-red-500" onClick={onDelete}><LuTrash2 size={18} /></button>}
                </div>
            )}
        </div>
    );
};

export default TransactionInfoCard;
