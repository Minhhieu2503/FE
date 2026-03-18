import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ExpoLinking from 'expo-linking';
import { ActivityIndicator, View } from 'react-native';
import {
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
} from './src/screens/shared';
import CustomerHomeScreen from './src/screens/customer/CustomerHomeScreen';
import { authService } from './src/services/auth.service';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [ExpoLinking.createURL('/'), 'snapbook://'],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      ForgotPassword: 'forgot-password',
      ResetPassword: 'reset-password',
      CustomerHome: 'customer-home',
    },
  },
};

export default function App() {
  const [initialRoute, setInitialRoute] = useState<'Login' | 'CustomerHome' | null>(null);

  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const loggedIn = await authService.isAuthenticated();
        setInitialRoute(loggedIn ? 'CustomerHome' : 'Login');
      } catch {
        // Never block UI on bootstrap errors (storage/network/runtime issues).
        setInitialRoute('Login');
      }
    };

    bootstrapSession();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CustomerHome" 
          component={CustomerHomeScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
