import React, { useState } from 'react';
import Input from '../Inputs/Input';

const AddBudgetForm = ({ onAddBudget }) => {
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [month, setMonth] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddBudget({ category, amount, month });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input label="Category" placeholder="e.g., Groceries" value={category} onChange={(e) => setCategory(e.target.value)} />
            <Input label="Budget Amount" type="number" placeholder="e.g., 500" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Input label="Month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
            <button type="submit" className="btn-primary mt-4">Create Budget</button>
        </form>
    );
};

export default AddBudgetForm;
