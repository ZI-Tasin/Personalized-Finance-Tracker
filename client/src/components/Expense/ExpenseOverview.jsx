import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { prepareExpenseLineChartData } from "../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart";

const ExpenseOverview = ({ transactions, onAddExpense  }) => {
    const [charData, setCharData] = useState([]);
    
    useEffect(() => {
        const result = prepareExpenseLineChartData(transactions);
        setCharData(result);
    
        return () => {};
    }, [transactions]);

    return <div className="card">
        <div className="flex items-center justify-between">
            <div className="">
                <h5 className="text-lg">Expense Overview</h5>
                <p className="text-xs text-gray-400 mt-0.5">
                    This is your expense overview. Track your expenses and manage your budget effectively.
                </p>
            </div>

            <button 
                className="flex items-center gap-2 bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-violet-600" 
                onClick={onAddExpense}
            >
                <LuPlus className="text-lg" />
                Add Expense
            </button>
        </div>

        <div className="mt-10">
            <CustomLineChart
                data={charData}
            />
        </div>
    </div>
};

export default ExpenseOverview;
