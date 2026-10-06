import React, { useState } from 'react';
import Input from '../Inputs/input';

const AddBudgetForm = ({ onAddBudget, initialMonth, isSaving = false }) => {
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [month, setMonth] = useState(initialMonth || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddBudget({ category, amount, month });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input label="Category" placeholder="e.g., Groceries" value={category} onChange={(e) => setCategory(e.target.value)} required maxLength={100} />
            <Input label="Budget Amount" type="number" min="0.01" max="1000000000000" step="0.01" placeholder="e.g., 500" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <Input label="Month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} required />
            <button type="submit" className="btn-primary mt-4" disabled={isSaving}>{isSaving ? 'Saving…' : 'Create budget'}</button>
        </form>
    );
};

export default AddBudgetForm;
