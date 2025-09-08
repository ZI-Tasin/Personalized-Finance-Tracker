export const BASE_URL = 'http://localhost:8000';

// API paths for the Personalized Finance Tracker application.
// These paths are used to interact with the backend services for authentication, dashboard, income, and expenses.
export const API_PATHS = {
    AUTH: {
        LOGIN: '/api/v1/auth/login',
        REGISTER: '/api/v1/auth/register',
        GET_USER_INFO: '/api/v1/auth/getUser',
        UPDATE_PROFILE_PIC: '/api/v1/auth/update-profile-pic',
    },

    DASHBOARD: {
        GET_DATA: '/api/v1/dashboard',
    },

    INCOME: {
        ADD_INCOME: '/api/v1/income/add',
        GET_ALL_INCOME: '/api/v1/income/get',
        // Function to generate the path for deleting a specific income record
        DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
        DOWNLOAD_INCOME: '/api/v1/income/downloadexcel',
    },

    EXPENSE: {
        ADD_EXPENSE: '/api/v1/expense/add',
        GET_ALL_EXPENSE: '/api/v1/expense/get',
        // Function to generate the path for deleting a specific expense record
        DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
        DOWNLOAD_EXPENSE: '/api/v1/expense/downloadexcel',
    },

    IMAGE: {
        UPLOAD_IMAGE: '/api/v1/auth/upload-image',
    },

    BUDGET: {
    ADD_BUDGET: '/api/v1/budget/add',
    GET_BUDGETS: '/api/v1/budget/get',
    DELETE_BUDGET: (budgetId) => `/api/v1/budget/${budgetId}`,
    },
};

