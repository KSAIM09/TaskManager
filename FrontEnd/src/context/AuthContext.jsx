/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]); // New state to manage tasks

  const login = async (email, password) => {
    const { data } = await axiosInstance.post('/api/auth/login', { email, password });
    setUser({ id: data.userId, token: data.token });
    localStorage.setItem('token', data.token);
    fetchTasks(data.userId); // Fetch tasks after login
  };

  const register = async (name, email, password) => {
    await axiosInstance.post('/api/auth/register', { name, email, password });
  };

  const logout = () => {
    setUser(null);
    setTasks([]); // Clear tasks on logout
    localStorage.removeItem('token');
  };

  // Fetch tasks for the logged-in user
  const fetchTasks = async (userId) => {
    try {
      const { data } = await axiosInstance.get(`/api/tasks/user/${userId}`);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, tasks, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
