import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
  Modal,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { registerUser } from '../api/authApi';

const CreateAccountScreen = () => {
  const navigation = useNavigation();

  // form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFirstNameError, setShowFirstNameError] = useState('');
  const [showLastNameError, setShowLastNameError] = useState('');
  const [showEmailError, setShowEmailError] = useState('');
  const [showPasswordError, setShowPasswordError] = useState('');
  const [showConfirmPasswordError, setShowConfirmPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // modal state
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,20}$/;

  const validate = () => {
    let valid = true;

    if (!firstName.trim()) {
      setShowFirstNameError('First Name Required');
      valid = false;
    } else setShowFirstNameError('');

    if (!lastName.trim()) {
      setShowLastNameError('Last Name Required');
      valid = false;
    } else setShowLastNameError('');

    if (!email.trim()) {
      setShowEmailError('Email Required');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setShowEmailError('Email Not Valid');
      valid = false;
    } else setShowEmailError('');

    if (!password.trim()) {
      setShowPasswordError('Password Required');
      valid = false;
    } else if (!passwordRegex.test(password)) {
      setShowPasswordError(
        'Password must be 6-20 chars, include uppercase, number & special character'
      );
      valid = false;
    } else setShowPasswordError('');

    if (!confirmPassword.trim()) {
      setShowConfirmPasswordError('Confirm Password Required');
      valid = false;
    } else if (confirmPassword != password) {
      setShowConfirmPasswordError('Password & Confirm Password Not Match');
      valid = false;
    } else setShowConfirmPasswordError('');

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
        Alert.alert('Error', data.message || 'Registration failed.');
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}
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

        {/* Icon + title */}
        <Image
          source={require('../assets/add-user.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Join our community and start your empathy journey
        </Text>

        {/* Form */}
        <TextInput
          placeholder="First Name"
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />
        {showFirstNameError ? (
          <Text style={styles.errorText}>{showFirstNameError}</Text>
        ) : null}

        <TextInput
          placeholder="Last Name"
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />
        {showLastNameError ? (
          <Text style={styles.errorText}>{showLastNameError}</Text>
        ) : null}

        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {showEmailError ? (
          <Text style={styles.errorText}>{showEmailError}</Text>
        ) : null}

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            style={styles.passwordInput}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? 'eye-off' : 'eye'}
              size={24}
              color="#888"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        {showPasswordError ? (
          <Text style={styles.errorText}>{showPasswordError}</Text>
        ) : null}

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirm Password"
            style={styles.passwordInput}
            secureTextEntry={!confirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            <Ionicons
              name={confirmPasswordVisible ? 'eye-off' : 'eye'}
              size={24}
              color="#888"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        {showConfirmPasswordError ? (
          <Text style={styles.errorText}>{showConfirmPasswordError}</Text>
        ) : null}

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

        {/* Legal line with links that open modals */}
        <Text style={styles.footerText}>
          By clicking continue, you agree to our{' '}
          <Text
            style={styles.link}
            onPress={() => setShowTerms(true)}
          >
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            style={styles.link}
            onPress={() => setShowPrivacy(true)}
          >
            Privacy Policy
          </Text>
        </Text>

        {/* Terms Modal */}
        <Modal
          transparent
          animationType="slide"
          visible={showTerms}
          onRequestClose={() => setShowTerms(false)}
        >
          <View style={styles.backdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Terms of Service</Text>
                <Pressable
                  onPress={() => setShowTerms(false)}
                  hitSlop={10}
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color="#111"
                  />
                </Pressable>
              </View>
              <ScrollView
                style={{ maxHeight: 420 }}
                contentContainerStyle={{ paddingBottom: 8 }}
              >
                <Text style={styles.modalParagraph}>
                  By creating an account, you agree to use Empathy Builder
                  respectfully and responsibly.
                </Text>
                <Text style={styles.modalParagraph}>
                  You must provide accurate information and keep your login
                  details secure.
                </Text>
                <Text style={styles.modalParagraph}>
                  Do not post harmful, offensive, or illegal content.
                </Text>
                <Text style={styles.modalParagraph}>
                  The app is for personal, non-commercial use only.
                </Text>
                <Text style={styles.modalParagraph}>
                  We may update features, policies, or terminate accounts that
                  violate these terms.
                </Text>
              </ScrollView>
              <Pressable
                style={styles.modalButton}
                onPress={() => setShowTerms(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Privacy Modal */}
        <Modal
          transparent
          animationType="slide"
          visible={showPrivacy}
          onRequestClose={() => setShowPrivacy(false)}
        >
          <View style={styles.backdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Privacy Policy</Text>
                <Pressable
                  onPress={() => setShowPrivacy(false)}
                  hitSlop={10}
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color="#111"
                  />
                </Pressable>
              </View>
              <ScrollView
                style={{ maxHeight: 420 }}
                contentContainerStyle={{ paddingBottom: 8 }}
              >
                <Text style={styles.modalParagraph}>
                  We collect only necessary data (name, email, stories,
                  activity) to provide app services.
                </Text>
                <Text style={styles.modalParagraph}>
                  Your data will not be sold to third parties.
                </Text>
                <Text style={styles.modalParagraph}>
                  Information may be used to improve AI feedback and user
                  experience.
                </Text>
                <Text style={styles.modalParagraph}>
                  You can request deletion of your account and data at any time.
                </Text>
                <Text style={styles.modalParagraph}>
                  Security measures are in place to protect your information.
                </Text>
              </ScrollView>
              <Pressable
                style={styles.modalButton}
                onPress={() => setShowPrivacy(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#fff' },
  backButton: { marginTop: 40, marginBottom: 20 },
  icon: { width: 70, height: 70, alignSelf: 'center', marginBottom: 10 },
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
  continueText: { color: '#fff', fontSize: 16 },
  loginButton: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: { color: '#000', fontSize: 16 },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
    paddingHorizontal: 40,
  },
  link: { color: '#3478f6', textDecorationLine: 'underline' },
  errorText: { color: 'red', fontSize: 12, marginBottom: 10, paddingLeft: 10 },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  passwordInput: { flex: 1, paddingVertical: 12, paddingRight: 10 },
  eyeIcon: { padding: 4 },

  // Modal styles
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalParagraph: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 8,
    backgroundColor: '#3478f6',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonText: { color: '#fff', fontWeight: '600' },
});

export default CreateAccountScreen;
