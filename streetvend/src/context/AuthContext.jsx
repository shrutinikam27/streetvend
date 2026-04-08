import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
<<<<<<< HEAD
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
=======

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
>>>>>>> 9bdae445493da8ec4ea2d8640cb4e2501e7503c3
            setIsAuthenticated(true);
        }
    }, []);

<<<<<<< HEAD
    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
=======
    const login = (newToken) => {
        setToken(newToken);
        setIsAuthenticated(true);
        localStorage.setItem('token', newToken);
>>>>>>> 9bdae445493da8ec4ea2d8640cb4e2501e7503c3
    };

    const logout = () => {
        setToken(null);
<<<<<<< HEAD
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
=======
        setIsAuthenticated(false);
        localStorage.removeItem('token');
>>>>>>> 9bdae445493da8ec4ea2d8640cb4e2501e7503c3
    };

    const value = {
        isAuthenticated,
        token,
<<<<<<< HEAD
        user,
=======
>>>>>>> 9bdae445493da8ec4ea2d8640cb4e2501e7503c3
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
