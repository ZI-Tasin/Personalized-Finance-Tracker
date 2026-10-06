import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-hot-toast';
import Modal from '../../components/Modals';
import AddBudgetForm from '../../components/Budgets/AddBudgetForm';
import BudgetList from '../../components/Budgets/BudgetList';

const Budget = () => {
    useUserAuth();
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
    const [saving, setSaving] = useState(false);

    const fetchBudgets = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.BUDGET.GET_BUDGETS(month));
            setBudgets(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch budgets.");
        } finally {
            setLoading(false);
        }
    }, [month]);

    useEffect(() => {
        fetchBudgets();
    }, [fetchBudgets]);

    const handleAddBudget = async (budgetData) => {
        setSaving(true);
        try {
            await axiosInstance.post(API_PATHS.BUDGET.ADD_BUDGET, budgetData);
            toast.success("Budget created successfully!");
            setIsModalOpen(false);
            fetchBudgets(); // Refresh the list after adding a new one.
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create budget.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteBudget = async (budgetId) => {
        try {
            await axiosInstance.delete(API_PATHS.BUDGET.DELETE_BUDGET(budgetId));
            toast.success("Budget deleted successfully!");
            fetchBudgets(); // Refresh the list after deleting.
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete budget.");
        }
    };

    return (
        <DashboardLayout activeMenu="Budgets">
            <div className="my-5 mx-auto p-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Monthly Budgets</h1>
                        <label className="sr-only" htmlFor="budget-month">Select budget month</label>
                        <input id="budget-month" type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="input-box mt-3 mb-0 max-w-52" />
                    </div>
                    <button 
                        className="flex items-center gap-2 bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-violet-600" 
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Add Budget
                    </button>
                </div>

                {loading ? (
                    <p>Loading budgets...</p>
                ) : (
                    <BudgetList budgets={budgets} onDelete={handleDeleteBudget} />
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create a New Budget">
                <AddBudgetForm onAddBudget={handleAddBudget} initialMonth={month} isSaving={saving} />
            </Modal>
        </DashboardLayout>
    );
};

export default Budget;
