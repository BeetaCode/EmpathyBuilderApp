import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import ShareUserStoryScreen from './screens/ShareUserStoryScreen';
import FeaturedStoriesScreen from './screens/FeaturedStoriesScreen';
import ChallengesScreen from './screens/ChallengesScreen';
import ChallengeDetailScreen from './screens/ChallengeDetailScreen';
import MyStoriesScreen from './screens/MyStoriesScreen';
import { Provider as PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="AuthLoading"
            component={AuthLoadingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
          />
          <Stack.Screen
            name="CreateAccount"
            component={CreateAccountScreen}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            name="ShareUserStory"
            component={ShareUserStoryScreen}
          />
          <Stack.Screen
            name="FeaturedStories"
            component={FeaturedStoriesScreen}
          />
          <Stack.Screen
            name="Challenges"
            component={ChallengesScreen}
          />
          <Stack.Screen
            name="ChallengeDetail"
            component={ChallengeDetailScreen}
          />
          <Stack.Screen
            name="MyStories"
            component={MyStoriesScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
