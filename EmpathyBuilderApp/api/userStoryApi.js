import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const BASE_URL = `${config.BASE_URL}/UserStory`;

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

export const addUserStory = async ({ story, tags, isShared, isAnonymous }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('user');
    const { id: userId } = JSON.parse(userData);

    const payload = {
      userId,
      story,
      userStoryTags: tags.map((tag) => ({ tag })), // convert to { tag } objects
      postedOn: new Date().toISOString(),
      isShared,
      isAnonymous,
    };

    const response = await axios.post(`${BASE_URL}/add-user-story`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    const errData = error.response?.data || { message: 'Network error' };
    return { success: false, error: errData };
  }
};
