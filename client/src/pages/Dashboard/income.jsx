import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Modal from '../../components/Modals';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import { toast } from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';

const Income = () => {
  useUserAuth();


  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  });

  const [OpenAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [saving, setSaving] = useState(false);

  const closeIncomeModal = () => {
    setOpenAddIncomeModal(false);
    setEditingIncome(null);
  };

  const fetchIncomeDetails = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );

      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load income records.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    if (!source.trim()) {
      toast.error("Income source is required");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Valid income amount is required which is greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Income date is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        source,
        amount,
        date,
        icon
      };
      if (editingIncome) await axiosInstance.put(API_PATHS.INCOME.UPDATE_INCOME(editingIncome._id), payload);
      else await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, payload);

      setOpenAddIncomeModal(false);
      setEditingIncome(null);
      toast.success(editingIncome ? "Income updated successfully" : "Income added successfully");
      await fetchIncomeDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save this income record.");
    } finally {
      setSaving(false);
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income details deleted successfully");
      fetchIncomeDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete this income record.");
    }
  };

  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'income_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to download income details. Please try again.");
    }
  }; 

  useEffect(() => {
    fetchIncomeDetails();

  }, [fetchIncomeDetails]);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => { setEditingIncome(null); setOpenAddIncomeModal(true); }}
            />
          </div>

          {loading ? <p className="card text-gray-500">Loading income…</p> : <IncomeList
            transactions={incomeData}
            onEdit={(income) => { setEditingIncome(income); setOpenAddIncomeModal(true); }}
            onDelete={(id) => {
              setOpenDeleteAlert({
                show: true,
                data: { id }
              });
            }}
            onDownload={handleDownloadIncomeDetails}
          />}
        </div>

        <Modal
          isOpen={OpenAddIncomeModal}
          onClose={closeIncomeModal}
          title={editingIncome ? 'Edit Income' : 'Add Income'}
        >
          <AddIncomeForm onAddIncome={handleAddIncome} initialIncome={editingIncome} isSaving={saving} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income?"
            onDelete={() => {
              deleteIncome(openDeleteAlert.data.id);
            }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
