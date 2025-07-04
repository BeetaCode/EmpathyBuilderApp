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

export const setUserChallenge = async ({ id, startedOn, progress }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('user');
    const { id: userId } = JSON.parse(userData);
    const payload = {
      userId,
      challengeId: id,
      startedOn,
      progress: progress.toString(),
    };

    const response = await axios.post(`${BASE_URL}/join-challenge`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    //console.log('test');
    const errData = error.response?.data || { message: 'Network error' };
    return { success: false, error: errData };
  }
};

export const getNewlyJoinedChallenge = async ({ id }) => {
  //console.log(id);
  try {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('user');
    const { id: userId } = JSON.parse(userData);

    const response = await axios.post(
      `${BASE_URL}/get-newly-joined-challenge`,
      id,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    //console.log(response);
    return { success: true, data: response.data };
  } catch (error) {
    console.log(error);
    const errData = error.response?.data || { message: 'Network error' };
    return { success: false, error: errData };
  }
};
