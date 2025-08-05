import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import RecentIncome from '../../components/Dashboard/RecentIncome';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';


// Main Home (Dashboard) Component
const Home = () => {
    useUserAuth(); // Custom hook to check user authentication

    // State to hold all the data that comes from the dashboard API
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // useEffect hook to fetch dashboard data when the component mounts
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // TODO: In the future, you will create and call the dashboard API endpoint
                // const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
                // setDashboardData(response.data);

                // For now, we will use mock/placeholder data to build the UI
                const mockData = {
                    totalBalance: 15000,
                    totalIncome: 20000,
                    totalExpenses: 5000,
                    recentTransactions: [],
                    last30DaysExpenses: { transactions: [] }
                };
                setDashboardData(mockData);

            } catch (error) {
                setError('Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []); // The empty dependency array means this runs only once on mount

    // Render loading state
    if (loading) {
        return <DashboardLayout><div>Loading...</div></DashboardLayout>;
    }

    // Render error state
    if (error) {
        return <DashboardLayout><div>{error}</div></DashboardLayout>;
    }

    return (
        <DashboardLayout>
          <div>
            <div>
              <RecentIncomeWithChart
                data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []}
                totalIncome={dashboardData?.totalIncome || 0}
              />

              <RecentIncome
                transactions={dashboardData?.last60DaysIncome?.transactions || []}
                onSeeMore={() => navigate('/income')}
              />
            </div>
          </div>
            
        </DashboardLayout>
    );
};

export default Home;