import React, { useState } from 'react';
import Input from '../Inputs/input';
import EmojiPickerPopup from '../../components/layouts/EmojiPickerPopup';

const AddIncomeForm = ({ onAddIncome, initialIncome, isSaving = false }) => {
    const [income, setIncome] = useState(() => initialIncome ? {
        source: initialIncome.source || '',
        amount: initialIncome.amount ?? '',
        date: initialIncome.date ? new Date(initialIncome.date).toISOString().slice(0, 10) : '',
        icon: initialIncome.icon || '',
    } : { source: '', amount: '', date: '', icon: '' });

    const handleChange = (key, value) => setIncome({ ...income, [key]: value });
    return (
        <form onSubmit={(event) => { event.preventDefault(); onAddIncome(income); }}>

            <EmojiPickerPopup
            icon={income.icon}
            onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
        />

            <Input
                value={income.source}
                onChange={({ target }) => handleChange('source', target.value)}
                label="Income Source"
                placeholder="Freelance, Salary, etc."
                type="text"
                required
                maxLength={100}
            />

            <Input
                value={income.amount}
                onChange={({ target }) => handleChange('amount', target.value)}
                label="Amount"
                placeholder="Enter amount"
                type="number"
                required
                min="0.01"
                max="1000000000000"
                step="0.01"
            />

            <Input
                value={income.date}
                onChange={({ target }) => handleChange('date', target.value)}
                label="Date"
                placeholder="DD-MM-YYYY"
                type="date"
                required
            />

            <div className="flex justify-end mt-6">
                <button
                    type="submit"
                    className="add-btn add-btn-fill"
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving…' : initialIncome ? 'Save changes' : 'Add income'}
                </button>
            </div>
        </form>
    );
};

export default AddIncomeForm;
