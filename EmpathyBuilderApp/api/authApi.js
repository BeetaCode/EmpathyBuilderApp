import axios from 'axios';

// Base URL of backend API
const BASE_URL = 'http://192.168.8.101:5246/api/Auth';

export const registerUser = async (userDetails) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userDetails);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};
