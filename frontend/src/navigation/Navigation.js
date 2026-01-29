import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { AttendanceScreen } from '../screens/AttendanceScreen';
import { ExpenditureScreen } from '../screens/ExpenditureScreen';
import { ApprovalScreen } from '../screens/ApprovalScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AdminRegisterScreen } from '../screens/AdminRegisterScreen';
import { ApprovalLineManagementScreen } from '../screens/ApprovalLineManagementScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 로그인 화면
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// 메인 앱 탭 네비게이터
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true
    }}
  >
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
  </Stack.Navigator>
);

const AttendanceStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true
    }}
  >
    <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} />
  </Stack.Navigator>
);

const ExpenditureStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true
    }}
  >
    <Stack.Screen name="ExpenditureScreen" component={ExpenditureScreen} />
  </Stack.Navigator>
);

const ApprovalStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true
    }}
  >
    <Stack.Screen name="ApprovalScreen" component={ApprovalScreen} />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true
    }}
  >
    <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
  </Stack.Navigator>
);

// 메인 탭 네비게이터
const MainTabNavigator = ({ isAdmin }) => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#2563EB',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarStyle: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#FFFFFF'
      }
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{
        tabBarLabel: '홈',
        tabBarIcon: ({ color }) => <View style={{ color }}>🏠</View>
      }}
    />
    <Tab.Screen
      name="Attendance"
      component={AttendanceStack}
      options={{
        tabBarLabel: '출석',
        tabBarIcon: ({ color }) => <View style={{ color }}>📍</View>
      }}
    />
    <Tab.Screen
      name="Expenditure"
      component={ExpenditureStack}
      options={{
        tabBarLabel: '지출',
        tabBarIcon: ({ color }) => <View style={{ color }}>💰</View>
      }}
    />
    {isAdmin && (
      <Tab.Screen
        name="Approval"
        component={ApprovalStack}
        options={{
          tabBarLabel: '결재',
          tabBarIcon: ({ color }) => <View style={{ color }}>🔏</View>
        }}
      />
    )}
    <Tab.Screen
      name="Settings"
      component={SettingsStack}
      options={{
        tabBarLabel: '설정',
        tabBarIcon: ({ color }) => <View style={{ color }}>⚙️</View>
      }}
    />
  </Tab.Navigator>
);

// 네비게이션 진입점
export const Navigation = () => {
  const { isSignedIn, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isSignedIn ? (
        <MainTabNavigator isAdmin={isAdmin} />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default Navigation;
