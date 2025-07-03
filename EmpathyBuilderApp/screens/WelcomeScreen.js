import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/handshake.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Empathy Builder</Text>
      <Text style={styles.description}>
        A community dedicated to fostering understanding, kindness, and positive
        social change through everyday actions.
      </Text>
      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={() => navigation.navigate('CreateAccount')}
      >
        <Text style={styles.createAccountText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#3478f6',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    paddingHorizontal: 50,
  },
  createAccountButton: {
    backgroundColor: '#3478f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginBottom: 10,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountText: {
    color: '#fff',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: '#000',
    fontSize: 16,
  },
});

export default WelcomeScreen;
