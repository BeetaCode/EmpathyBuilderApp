// config.js
import Constants from 'expo-constants';

let BASE_URL = 'http://localhost:5246/api'; // Fallback

try {
  const debuggerHost =
    Constants.expoConfig?.hostUri ?? Constants.manifest?.debuggerHost;

  if (debuggerHost) {
    const IP = debuggerHost.split(':')[0];
    BASE_URL = `http://${IP}:5246/api`;
  }
} catch (err) {
  console.warn('Failed to set dynamic BASE_URL:', err);
}

console.log('Using BASE_URL:', BASE_URL);

export default {
  BASE_URL,
};
