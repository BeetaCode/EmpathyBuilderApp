import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = `${API_URL}/UserStory`;

export const getUserStories = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/get-user-stories`, {
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

export const getMyUserStories = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('user');
    const { id, firstName, lastName } = JSON.parse(userData);
    const response = await axios.post(
      `${BASE_URL}/get-user-stories-by-userId`,
      JSON.stringify(id), // send raw string
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return { success: true, data: response.data.data };
  } catch (error) {
    const errData = error.response?.data || { message: 'Network error' };
    return { success: false, error: errData };
  }
};

export const addUserStory = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('user');
    const { id, firstName, lastName } = JSON.parse(userData);
    const response = await axios.post(
      `${BASE_URL}/get-user-stories-by-userId`,
      JSON.stringify(id), // send raw string
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return { success: true, data: response.data.data };
  } catch (error) {
    const errData = error.response?.data || { message: 'Network error' };
    return { success: false, error: errData };
  }
};
