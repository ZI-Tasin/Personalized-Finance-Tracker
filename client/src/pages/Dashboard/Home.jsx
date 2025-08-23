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

    if (loading) {
        return <DashboardLayout><div>Loading dashboard...</div></DashboardLayout>;
    }

    if (error) {
        return <DashboardLayout><div>{error}</div></DashboardLayout>;
    }

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="my-5 mx-auto">
              <h2 className="text-xl font-bold mb-4">Dashboard API Data Successfully Loaded</h2>
              <p className="mb-4 text-gray-600">I'll implement the full UI in the next sprint. For now this shows the raw data received from the backend:</p>
              
              {/* The <pre> tag is perfect for displaying formatted JSON */}
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(dashboardData, null, 2)}
              </pre>
            </div>
        </DashboardLayout>
    );
};

export default Home;
