import React, { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Function to update user data
    // This can be used after login or when user data changes
    const updateUser = (userData) => {
        setUser(userData);
    };

    // Function to clear user data
    // This can be used for logout functionality or when user data is no longer needed
    const clearUser = () => {
        setUser(null);
    };

    // Optionally, user can load user data from local storage or an API when the provider mounts
    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
