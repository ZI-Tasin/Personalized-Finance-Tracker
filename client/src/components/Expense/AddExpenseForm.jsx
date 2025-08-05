import React, { useState } from 'react';
import Input from '../Inputs/input';
import EmojiPickerPopup from '../layouts/EmojiPickerPopup';

const AddExpenseForm = ({ onAddExpense }) => {
    const [expense, setExpense] = React.useState({
        category: '',
        amount: '',
        date: '',
        icon: ''
    });

    const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

    return <div>
        <EmojiPickerPopup
            icon={expense.icon}
            onSelect={(SelectedIcon) => handleChange('icon', SelectedIcon)}
        />

        <Input
            value={expense.category}
            onChange={({ target }) => handleChange('category', target.value)}
            label="Expense Category"
            placeholder="Enter expense category"
            type="text"
        />

        <Input
            value={expense.amount}
            onChange={({ target }) => handleChange('amount', target.value)}
            label="Expense Amount"
            placeholder="Enter expense amount"
            type="number"
        />

        <Input
            value={expense.date}
            onChange={({ target }) => handleChange('date', target.value)}
            label="Expense Date"
            placeholder="Enter expense date"
            type="date"
        />

        <div className="flex justify-end mt-6">
            <button
                type="button"
                className="add-btn add-btn-fill"
                onClick={() => onAddExpense(expense)}
            >
                Add Expense
            </button>
        </div>
    </div>;
};

export default AddExpenseForm;
