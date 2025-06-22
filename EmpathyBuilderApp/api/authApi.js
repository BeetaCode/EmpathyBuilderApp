import axios from 'axios';
import { API_URL } from '@env';

// Base URL of backend API
const BASE_URL = `${API_URL}/Auth`;

export const registerUser = async (userDetails) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userDetails);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const loginUser = async (userDetails) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, userDetails);
    return { success: true, data: response.data };
  } catch (error) {
    const errData = error.response?.data || { message: 'Network error' };
    console.log(errData);
    return { success: false, error: errData };
  }
};
