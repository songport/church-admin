import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';

import { LoginScreen } from '../screens/LoginScreen';
import { AttendanceScreen } from '../screens/AttendanceScreen';
import { AdminRegisterScreen } from '../screens/AdminRegisterScreen';
import { ApprovalLineManagementScreen } from '../screens/ApprovalLineManagementScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 인증 스택
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

// 일반 사용자 스택 (출석 관리)
const UserStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true
    }}
  >
    <Stack.Screen name="Attendance" component={AttendanceScreen} />
  </Stack.Navigator>
);

// 관리자 스택
const AdminStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true
    }}
  >
    <Stack.Screen name="AdminHome" component={AdminRegisterScreen} />
    <Stack.Screen 
      name="ApprovalLineManagement" 
      component={ApprovalLineManagementScreen}
      options={{ animationEnabled: true }}
    />
  </Stack.Navigator>
);

// 앱 스택 (로그인 후)
const AppStack = ({ user }) => {
  // 관리자 확인
  const isAdmin = user?.permissions?.isAdmin;

  if (isAdmin) {
    return <AdminStack />;
  }

  return <UserStack />;
};

// 네비게이션 구조
export const Navigation = () => {
  const { isSignedIn, loading, user } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isSignedIn ? <AppStack user={user} /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Navigation;
