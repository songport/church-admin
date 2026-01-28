import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  CheckBox,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LoginScreen = ({ navigation }) => {
  const { login, error } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('입력 오류', '사용자명과 비밀번호를 입력하세요.');
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      // 로그인 유지 설정
      if (keepLoggedIn) {
        await AsyncStorage.setItem('keepLoggedIn', 'true');
      }
      Alert.alert('로그인 성공', '환영합니다!');
      navigation.replace('Home');
    } else {
      Alert.alert('로그인 실패', result.error || error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 앱 제목 */}
        <View style={styles.header}>
          <Text style={styles.title}>주님의 교회</Text>
          <Text style={styles.subtitle}>스마트 행정 앱</Text>
        </View>

        {/* 입력 필드 */}
        <View style={styles.formContainer}>
          {/* 사용자명 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>사용자명</Text>
            <TextInput
              style={styles.input}
              placeholder="사용자명을 입력하세요"
              value={username}
              onChangeText={setUsername}
              editable={!loading}
              placeholderTextColor="#999"
            />
          </View>

          {/* 비밀번호 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
              placeholderTextColor="#999"
            />
          </View>

          {/* 로그인 유지 체크박스 */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={keepLoggedIn}
              onValueChange={setKeepLoggedIn}
              disabled={loading}
            />
            <Text style={styles.checkboxLabel}>로그인 유지</Text>
          </View>

          {/* 에러 메시지 */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>로그인</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 하단 정보 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>교회의 행정 업무를</Text>
          <Text style={styles.footerText}>더 효율적으로 관리하세요.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 40
  },
  header: {
    alignItems: 'center',
    marginBottom: 50
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500'
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  input: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500'
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#c62828'
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    fontWeight: '500'
  },
  loginButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  disabledButton: {
    opacity: 0.6
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  footer: {
    alignItems: 'center'
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  }
});
