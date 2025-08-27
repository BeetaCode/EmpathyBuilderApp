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
import { registerUser } from '../api/authApi';

const CreateAccountScreen = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFirstNameError, setShowFirstNameError] = useState('');
  const [showLastNameError, setShowLastNameError] = useState('');
  const [showEmailError, setShowEmailError] = useState('');
  const [showPasswordError, setShowPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,20}$/;

  const validate = () => {
    let valid = true;

    if (!firstName.trim()) {
      setShowFirstNameError('First Name Required');
      valid = false;
    } else {
      setShowFirstNameError('');
    }
    if (!lastName.trim()) {
      setShowLastNameError('Last Name Required');
      valid = false;
    } else {
      setShowLastNameError('');
    }
    if (!email.trim()) {
      setShowEmailError('Email Requird');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setShowEmailError('Email Not Valid');
      valid = false;
    } else {
      setShowEmailError('');
    }
    if (!password.trim()) {
      setShowPasswordError('Password Required');
      valid = false;
    } else if (!passwordRegex.test(password)) {
      setShowPasswordError(
        'Password must be 6-20 chars, include uppercase, number & special character'
      );
      valid = false;
    } else {
      setShowPasswordError('');
    }

    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const data = await registerUser({
        firstName,
        lastName,
        email,
        password,
      });

      if (data.message === 'user_registered_successfully') {
        Alert.alert(
          'Success',
          'Registration successful! Please check your email.'
        );
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.message + 'test' || 'Registration failed.');
      }
    } catch (err) {
      if (err.message === 'user_already_exists') {
        Alert.alert('Registration Error', 'Email already in use');
      } else {
        Alert.alert(
          'Registration Error',
          err.message || 'Something went wrong.'
        );
      }
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
        source={require('../assets/add-user.png')}
        style={styles.icon}
        resizeMode="contain"
      />

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Join our community and start your empathy journey
      </Text>

      <TextInput
        placeholder="First Name"
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />
      {showFirstNameError !== '' && (
        <Text style={styles.errorText}>{showFirstNameError}</Text>
      )}
      <TextInput
        placeholder="Last Name"
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />
      {showLastNameError !== '' && (
        <Text style={styles.errorText}>{showLastNameError}</Text>
      )}
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
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.continueText}>Continue</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
        disabled={loading}
      >
        <Text style={styles.loginText}>Already have an account</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        By clicking continue, you agree to our{' '}
        <Text style={styles.link}>Terms of Service</Text> and{' '}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>
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
  loginButton: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#000',
    fontSize: 16,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
    paddingHorizontal: 10,
    paddingHorizontal: 40,
  },
  link: {
    color: '#3478f6',
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

export default CreateAccountScreen;
