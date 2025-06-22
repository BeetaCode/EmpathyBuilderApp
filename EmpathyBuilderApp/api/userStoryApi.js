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
    console.log(error);
    const errData = error.response?.data || { message: 'Network error' };
    return { success: false, error: errData };
  }
};

// export const getUserStories = async () => {
//   const BASE_URL = `${API_URL}/UserStory`
//   const role = await getUserRole();

//   if (role !== 'User' && role !== 'Admin') {
//     return { success: false, message: 'Access denied' };
//   }

//   try {
//     const response = await axios.get(
//       `${BASE_URL}/get-user-stories`,
//       await getAuthHeader()
//     );
//     return { success: true, data: response.data };
//   } catch (err) {
//     return { success: false, message: err.response?.data?.message || 'Error' };
//   }
// };
