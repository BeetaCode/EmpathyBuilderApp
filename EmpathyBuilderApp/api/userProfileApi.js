import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const BASE_URL = `${config.BASE_URL}/User`;

export const getProfileSummary = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('user');
    const { id: userId } = JSON.parse(userData);
    console.log(userId);
    const response = await axios.get(`${BASE_URL}/get-user-profile-details`, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return { success: true, data: response.data.data };
  } catch (error) {
    const errData = error.response?.data || { message: 'Network error' };
    return { success: false, error: errData };
  }
};
