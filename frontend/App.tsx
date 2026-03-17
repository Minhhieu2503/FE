import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import LoginScreen from './src/screens/shared/LoginScreen';
import RegisterScreen from './src/screens/shared/RegisterScreen';
import CustomerHomeScreen from './src/screens/customer/CustomerHomeScreen';
import { authService } from './src/services/auth.service';

const Stack = createNativeStackNavigator();

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
    <NavigationContainer>
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
          name="CustomerHome" 
          component={CustomerHomeScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
