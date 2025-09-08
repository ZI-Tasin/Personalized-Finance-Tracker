import React, { useState, useEffect } from 'react';
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

    const fetchBudgets = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.BUDGET.GET_BUDGETS);
            setBudgets(response.data);
        } catch (error) {
            toast.error("Failed to fetch budgets.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleAddBudget = async (budgetData) => {
        try {
            await axiosInstance.post(API_PATHS.BUDGET.ADD_BUDGET, budgetData);
            toast.success("Budget created successfully!");
            setIsModalOpen(false);
            fetchBudgets(); // Refresh the list after adding a new one.
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create budget.");
        }
    };

    const handleDeleteBudget = async (budgetId) => {
        try {
            await axiosInstance.delete(API_PATHS.BUDGET.DELETE_BUDGET(budgetId));
            toast.success("Budget deleted successfully!");
            fetchBudgets(); // Refresh the list after deleting.
        } catch (error) {
            toast.error("Failed to delete budget.");
        }
    };

    return (
        <DashboardLayout activeMenu="Budgets">
            <div className="my-5 mx-auto p-4">
                {/* Using Flexbox to align the title to the left and the button to the right. */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Monthly Budgets</h1>
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
                <AddBudgetForm onAddBudget={handleAddBudget} />
            </Modal>
        </DashboardLayout>
    );
};

export default Budget;
