import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 저장된 토큰 확인 (앱 로드 시)
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('authToken');
        const savedUser = await AsyncStorage.getItem('user');
        
        if (savedToken) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('토큰 로드 오류:', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      setError(null);
      const response = await authAPI.login(username, password);
      const { token, user } = response.data;

      setToken(token);
      setUser(user);

      // 로컬 저장
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || '로그인 실패';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    } catch (e) {
      console.error('로그아웃 오류:', e);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setError(null);
      const response = await authAPI.registerUser(userData);
      return { success: true, user: response.data.user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || '회원가입 실패';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    register,
    isSignedIn: !!token,
    isAdmin: user?.permissions?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다.');
  }
  return context;
};
