import React, { useState, useEffect, useMemo  } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

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

// Main Home (Dashboard) Component
const Home = () => {
    useUserAuth(); // Custom hook to check user authentication

    // State to hold all the data that comes from the dashboard API
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Function to fetch dashboard data from the backend API
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
          console.log('Failed to fetch dashboard data. Please try again.', error);
      } finally {
          setLoading(false);
      }
    };

    useEffect(() => {
      fetchDashboardData();
      return () => {};
    }, []);

    // Using useMemo to prepare the data for the bar chart.
    // This ensures the data is only recalculated when the dashboardData changes, which is efficient.
    const expenseChartData = useMemo(() => {
        if (!dashboardData) return [];
        return prepareExpenseLineChartData(dashboardData.last30DaysExpenses?.transactions);
    }, [dashboardData]);

    if (loading) {
        return <DashboardLayout><div>Loading dashboard...</div></DashboardLayout>;
    }

    if (error) {
        return <DashboardLayout><div>{error}</div></DashboardLayout>;
    }

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="my-5 mx-auto space-y-6">
              {/* Row 1: Three Info Cards */}
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

              {/* Row 2: Financial Overview & Recent Transactions */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <FinancialOverview 
                  totalIncome={dashboardData?.totalIncome || 0}
                  totalExpenses={dashboardData?.totalExpenses || 0}
                  totalBalance={dashboardData?.totalBalance || 0}
                />
                <RecentTransactions transactions={dashboardData?.recentTransactions || []} />
              </div>

              {/* Row 3: Expense Details & Bar Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExpenseDetails transactions={dashboardData?.recentTransactions || []} />
                <Last30DaysBarChart data={expenseChartData} />
              </div>

              {/* Row 4: Income Pie Chart & Details */}
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
