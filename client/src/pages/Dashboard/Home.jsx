import React, { useState, useEffect, useMemo  } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-hot-toast';

import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import InfoCard from '../../components/Cards/InfoCard';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinancialOverview from '../../components/Dashboard/FinancialOverview';
import ExpenseDetails from '../../components/Dashboard/ExpenseDetails';
import Last30DaysBarChart from '../../components/Dashboard/Last30DaysBarChart';
import Last60DaysPieChart from '../../components/Dashboard/Last60DaysPieChart';
import IncomeDetails from '../../components/Dashboard/IncomeDetails';

import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandSeparator, prepareExpenseLineChartData  } from '../../utils/helper';

const Home = () => {
    useUserAuth(); // Custom hook to check user authentication

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
      setLoading(true);

      try {
          const response = await axiosInstance.get(
            `${API_PATHS.DASHBOARD.GET_DATA}`
          );

          if (response.data) {
              setDashboardData(response.data);
          }
      } catch (error) {
          setError(error.response?.data?.message || 'Could not load your dashboard. Please try again.');
      } finally {
          setLoading(false);
      }
    };

    useEffect(() => {
      fetchDashboardData();
      return () => {};
    }, []);

    const expenseChartData = useMemo(() => {
        if (!dashboardData) return [];
        return prepareExpenseLineChartData(dashboardData.last30DaysExpenses?.transactions);
    }, [dashboardData]);

    useEffect(() => {
      const checkBudgets = async () => {
        try {
          const response = await axiosInstance.get(API_PATHS.BUDGET.GET_BUDGETS());
          const budgets = response.data;

          if (budgets && budgets.length > 0) {
              budgets.forEach(budget => {
                  const percentageSpent = budget.amount > 0 ? (budget.spentAmount / budget.amount) * 100 : 0;
                  
                  const warningKey = `budget-warning-${budget._id}`;

                  if (percentageSpent > 90 && !sessionStorage.getItem(warningKey)) {
                      toast.error(
                          `Warning: You have spent over 90% of your budget for "${budget.category}"!`,
                          { duration: 6000 }
                      );
                      sessionStorage.setItem(warningKey, 'true');
                  }
              });
          }
        } catch (error) {
          console.error("Could not check budgets for notifications.", error);
        }
    };

      if (dashboardData) {
          checkBudgets();
      }
    }, [dashboardData]); // The dependency array ensures this runs when dashboardData is available.

    if (loading) {
        return <DashboardLayout><div>Loading dashboard...</div></DashboardLayout>;
    }

    if (error) {
        return <DashboardLayout><div>{error}</div></DashboardLayout>;
    }

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="my-5 mx-auto space-y-6">
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <InfoCard
                  icon={<IoMdCard />}
                  label="Total Balance"
                  value={addThousandSeparator(dashboardData?.totalBalance || 0)}
                  color="bg-primary"
                />
                <InfoCard
                  icon={<LuWalletMinimal />}
                  label="Total Income"
                  value={addThousandSeparator(dashboardData?.totalIncome || 0)}
                  color="bg-orange-500"
                />
                <InfoCard
                  icon={<LuHandCoins />}
                  label="Total Expense"
                  value={addThousandSeparator(dashboardData?.totalExpenses || 0)}
                  color="bg-red-500"
                />
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <FinancialOverview 
                  totalIncome={dashboardData?.totalIncome || 0}
                  totalExpenses={dashboardData?.totalExpenses || 0}
                  totalBalance={dashboardData?.totalBalance || 0}
                />
                <RecentTransactions transactions={dashboardData?.recentTransactions || []} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExpenseDetails transactions={dashboardData?.recentTransactions || []} />
                <Last30DaysBarChart data={expenseChartData} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Last60DaysPieChart 
                  data={dashboardData?.last60DaysIncome?.transactions || []}
                  totalIncome={dashboardData?.last60DaysIncome?.total || 0}
                />
                <IncomeDetails transactions={dashboardData?.recentTransactions || []} />
              </div>
            </div>
        </DashboardLayout>
    );
};

export default Home;
