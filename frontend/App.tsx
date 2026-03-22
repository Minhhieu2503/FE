import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import LoginScreen from './src/screens/shared/LoginScreen';
import RegisterScreen from './src/screens/shared/RegisterScreen';
import ForgotPasswordScreen from './src/screens/shared/ForgotPasswordScreen';
import CustomerHomeScreen from './src/screens/customer/CustomerHomeScreen';
import StudioHomeScreen from './src/screens/studio/StudioHomeScreen';
import AdminHomeScreen from './src/screens/admin/AdminHomeScreen';
import { authService } from './src/services/auth.service';

const Stack = createNativeStackNavigator();

type RootRoute = 'Login' | 'CustomerHome' | 'StudioHome' | 'AdminHome' | null;

function getHomeRouteByRole(role: string | null): RootRoute {
  switch (role?.toUpperCase()) {
    case 'STUDIO': return 'StudioHome';
    case 'ADMIN':  return 'AdminHome';
    default:       return 'CustomerHome';
  }
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState<RootRoute>(null);

  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const [loggedIn, role] = await Promise.race([
          Promise.all([authService.isAuthenticated(), authService.getRole()]),
          new Promise<[boolean, null]>((resolve) =>
            setTimeout(() => resolve([false, null]), 3000)
          ),
        ]);
        setInitialRoute(loggedIn ? getHomeRouteByRole(role) : 'Login');
      } catch {
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
        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />

        {/* Role-based Home Screens */}
        <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StudioHome" component={StudioHomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

