import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

export const getUserRole = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded?.role || null; // Adjust if your JWT stores role under a different key
  } catch (err) {
    console.error('Error decoding token:', err);
    return null;
  }
};

export const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
