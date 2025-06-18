import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { loginUser } from '../api/authApi';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailError, setShowEmailError] = useState('');
  const [showPasswordError, setShowPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const validate = () => {
    let valid = true;

    if (!email.trim()) {
      setShowEmailError('Email Required');
      valid = false;
    } else {
      setShowEmailError('');
    }

    if (!password.trim()) {
      setShowPasswordError('Password Required');
      valid = false;
    } else {
      setShowPasswordError('');
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      if (data.success) {
        console.log('Logged in:', data.data);
        navigation.navigate('Home'); // Adjust this route if needed
      } else if (
        data.error.message === 'user_login_failed_please_check_your_credentials'
      ) {
        Alert.alert('Login failed', 'Username or password is incorrect');
      } else {
        Alert.alert('Login error', 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Login error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
        />
      </TouchableOpacity>

      <Image
        source={require('../assets/login-user.png')}
        style={styles.icon}
        resizeMode="contain"
      />

      <Text style={styles.title}>Login to Account</Text>
      <Text style={styles.subtitle}>Login to start your empathy journey</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {showEmailError !== '' && (
        <Text style={styles.errorText}>{showEmailError}</Text>
      )}

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          style={styles.passwordInput}
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons
            name={passwordVisible ? 'eye-off' : 'eye'}
            size={24}
            color="#888"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
      {showPasswordError !== '' && (
        <Text style={styles.errorText}>{showPasswordError}</Text>
      )}

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.continueText}>Continue</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotPasswordButton}
        onPress={() => navigation.navigate('ForgotPassword')} // Update if you have this screen
      >
        <Text style={styles.forgotPasswordText}>Forgot password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  icon: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: '#3478f6',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 90,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  continueButton: {
    backgroundColor: '#3478f6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
  },
  forgotPasswordButton: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#000',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    paddingLeft: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 10,
  },
  eyeIcon: {
    padding: 4,
  },
});

export default LoginScreen;
