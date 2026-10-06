import React, { useCallback, useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-hot-toast';
import Modal from '../../components/Modals';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

const Expense = () => {
  useUserAuth();  // Custom hook for authentication

  const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null
    });

  const [OpenAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [saving, setSaving] = useState(false);

  const closeExpenseModal = () => {
    setOpenAddExpenseModal(false);
    setEditingExpense(null);
  };

  const fetchExpenseDetails = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load expenses.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    if (!category.trim()) {
      toast.error("Expense category is required");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Valid expense amount is required which is greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Expense date is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
          category,
          amount,
          date,
          icon
      };
      if (editingExpense) await axiosInstance.put(API_PATHS.EXPENSE.UPDATE_EXPENSE(editingExpense._id), payload);
      else await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, payload);

      setOpenAddExpenseModal(false);
      setEditingExpense(null);
      toast.success(editingExpense ? "Expense updated successfully" : "Expense added successfully");
      await fetchExpenseDetails();
      if (editingExpense) return;

      try {
        const budgetResponse = await axiosInstance.get(API_PATHS.BUDGET.GET_BUDGETS());
        const relevantBudget = budgetResponse.data.find((budget) => budget.category.toLowerCase() === category.trim().toLowerCase());
        if (relevantBudget && relevantBudget.amount > 0 && relevantBudget.spentAmount / relevantBudget.amount > 0.9) {
          toast.error(`You have spent over 90% of your budget for "${relevantBudget.category}".`, { duration: 6000 });
        }
      } catch {
        // The budget notice is optional; a budget lookup failure does not undo a saved expense.
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save this expense.");
    } finally {
      setSaving(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete this expense.");
    }
  };

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to download expense details. Please try again.");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();

  }, [fetchExpenseDetails]);

  return (
    <DashboardLayout activeMenu="Expenses">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => { setEditingExpense(null); setOpenAddExpenseModal(true); }}
            />
          </div>

          {loading ? <p className="card text-gray-500">Loading expenses…</p> : <ExpenseList
            transactions={expenseData}
            onEdit={(expense) => { setEditingExpense(expense); setOpenAddExpenseModal(true); }}
            onDelete={(id) => {
              setOpenDeleteAlert({
                show: true,
                data: { id }
              });
            }}
            onDownload={handleDownloadExpenseDetails}
          />}
        </div>

        <Modal
          isOpen={OpenAddExpenseModal}
          onClose={closeExpenseModal}
          title={editingExpense ? 'Edit Expense' : 'Add Expense'}
        >
          <AddExpenseForm onAddExpense={handleAddExpense} initialExpense={editingExpense} isSaving={saving} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense?"
            onDelete={() => {
              deleteExpense(openDeleteAlert.data.id);
            }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
