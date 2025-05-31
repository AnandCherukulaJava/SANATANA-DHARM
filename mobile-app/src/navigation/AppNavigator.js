import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ChannelScreen from '../screens/ChannelScreen';

// Components
import DrawerContent from '../components/DrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#667eea',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: '🕉️ SANATANA-DHARM',
        }}
      />
      <Drawer.Screen 
        name="Channel" 
        component={ChannelScreen}
        options={({ route }) => ({
          title: route.params?.channelName || 'Channel',
        })}
      />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={isAuthenticated ? 'Main' : 'Login'}
      >
        {isAuthenticated ? (
          // Authenticated screens
          <>
            <Stack.Screen name="Main" component={DrawerNavigator} />
          </>
        ) : (
          // Authentication screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;