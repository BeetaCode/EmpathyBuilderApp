import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const BASE_URL = `${config.BASE_URL}/UserChallenge`;

export const getChallenges = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/get-all-challenges`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data.data };
  } catch (error) {
    const errData = error.response?.data || { message: 'Network error' };
    return { success: false, error: errData };
  }
};
