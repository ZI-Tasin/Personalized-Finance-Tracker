import React from 'react';
import Input from '../Inputs/input';
import EmojiPickerPopup from '../layouts/EmojiPickerPopup';

const AddExpenseForm = ({ onAddExpense, initialExpense, isSaving = false }) => {
    const [expense, setExpense] = React.useState(() => initialExpense ? {
        category: initialExpense.category || '',
        amount: initialExpense.amount ?? '',
        date: initialExpense.date ? new Date(initialExpense.date).toISOString().slice(0, 10) : '',
        icon: initialExpense.icon || '',
    } : { category: '', amount: '', date: '', icon: '' });

    const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

    return <form onSubmit={(event) => { event.preventDefault(); onAddExpense(expense); }}>
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
            required
            maxLength={100}
        />

        <Input
            value={expense.amount}
            onChange={({ target }) => handleChange('amount', target.value)}
            label="Expense Amount"
            placeholder="Enter expense amount"
            type="number"
            required
            min="0.01"
            max="1000000000000"
            step="0.01"
        />

        <Input
            value={expense.date}
            onChange={({ target }) => handleChange('date', target.value)}
            label="Expense Date"
            placeholder="Enter expense date"
            type="date"
            required
        />

        <div className="flex justify-end mt-6">
            <button
                type="submit"
                className="add-btn add-btn-fill"
                disabled={isSaving}
            >
                {isSaving ? 'Saving…' : initialExpense ? 'Save changes' : 'Add expense'}
            </button>
        </div>
    </form>;
};

export default AddExpenseForm;
