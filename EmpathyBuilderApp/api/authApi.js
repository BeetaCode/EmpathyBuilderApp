import axios from 'axios';
import { API_URL } from '@env';
import config from '../config';

// Base URL of backend API
const BASE_URL = `${config.BASE_URL}/Auth`;

export const registerUser = async (userDetails) => {
  try {
    console.log(BASE_URL);
    const response = await axios.post(`${BASE_URL}/register`, userDetails);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const loginUser = async (userDetails) => {
  try {
    //console.log(BASE_URL);
    const response = await axios.post(`${BASE_URL}/login`, userDetails);
    return { success: true, data: response.data };
  } catch (error) {
    console.log(error);
    const errData = error.response?.data || { message: 'Network error' };
    console.log(errData);
    return { success: false, error: errData };
  }
};
