import moment from 'moment';

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};


export const getInitials = (name) => {
    if (!name) return '';

    const words = name.split(' ');
    let initials = '';
    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0]
    }
    return initials.toUpperCase();
};


export const addThousandSeparator = (num) => {
    if (num === null || isNaN(num)) return "";

    const [integerPart, fractionalPart] = num.toString().split('.');

    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return fractionalPart
        ? `${formattedIntegerPart}.${fractionalPart}`
        : formattedIntegerPart;
};


export const prepareIncomeChartData = (transactions = []) => {
    const sortedData = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
        date: moment(item.date).format('Do MMM'),
        amount: item.amount,
    }));

    return chartData;
};


export const prepareExpenseLineChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
        month: moment(item?.date).format('Do MMM'),
        amount: item?.amount,
        category: item?.category,
    }));

    return chartData;
};

