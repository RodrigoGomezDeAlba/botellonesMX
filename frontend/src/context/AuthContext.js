import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/auth/profile');
            setUser(response.data);
        } catch (err) {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
            return { success: false, error: err.response?.data?.message };
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await api.post('/auth/register', userData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrarse');
            return { success: false, error: err.response?.data?.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};