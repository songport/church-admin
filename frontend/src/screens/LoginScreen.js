import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { TextInputField } from '../components/Input';
import { PrimaryButton } from '../components/Button';

export const LoginScreen = () => {
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const handleLogin = async () => {
    if (!username.trim()) {
      setFormError('사용자명을 입력하세요.');
      return;
    }

    if (!password.trim()) {
      setFormError('비밀번호를 입력하세요.');
      return;
    }

    setFormError('');
    const result = await login(username, password);

    if (!result.success) {
      setFormError(result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 로고 및 제목 */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>✝️</Text>
          <Text style={styles.title}>주님의 교회</Text>
          <Text style={styles.subtitle}>스마트 행정 시스템</Text>
        </View>

        {/* 폼 */}
        <View style={styles.form}>
          {formError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>{formError}</Text>
            </View>
          )}

          <TextInputField
            label="사용자명"
            placeholder="사용자명 입력"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setFormError('');
            }}
          />

          <TextInputField
            label="비밀번호"
            placeholder="비밀번호 입력"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setFormError('');
            }}
            secureTextEntry={true}
          />

          {/* 로그인 유지 */}
          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberMeText}>로그인 유지</Text>
          </TouchableOpacity>

          {/* 로그인 버튼 */}
          <PrimaryButton
            label="로그인"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
          />
        </View>

        {/* 버전 정보 */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>버전 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48
  },
  logo: {
    fontSize: 64,
    marginBottom: 16
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280'
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444'
  },
  errorMessage: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500'
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB'
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold'
  },
  rememberMeText: {
    fontSize: 14,
    color: '#1F2937'
  },
  footer: {
    alignItems: 'center'
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF'
  }
});
