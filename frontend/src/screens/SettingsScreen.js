// frontend/src/screens/SettingsScreen.js
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Switch
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { DangerButton } from '../components/Button';

export const SettingsScreen = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = React.useState(true);
  const [reminders, setReminders] = React.useState(true);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>설정</Text>
        </View>

        {/* 사용자 정보 */}
        <Text style={styles.sectionTitle}>사용자 정보</Text>
        <Card>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userPosition}>{user?.position}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>
        </Card>

        {/* 보안 & 권한 */}
        <Text style={styles.sectionTitle}>보안 & 권한</Text>
        <Card>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>비밀번호 변경</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>생체인증 설정</Text>
            <Switch value={false} disabled />
          </View>
        </Card>

        {/* 알림 설정 */}
        <Text style={styles.sectionTitle}>알림 설정</Text>
        <Card>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>결재 알림</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>출석 리마인더</Text>
            <Switch
              value={reminders}
              onValueChange={setReminders}
            />
          </View>
        </Card>

        {/* 앱 정보 */}
        <Text style={styles.sectionTitle}>앱 정보</Text>
        <Card>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>버전</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>빌드</Text>
            <Text style={styles.infoValue}>2026.01</Text>
          </View>
        </Card>

        {/* 로그아웃 */}
        <View style={styles.logoutContainer}>
          <DangerButton
            label="로그아웃"
            onPress={handleLogout}
          />
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
  content: {
    padding: 16
  },
  header: {
    marginBottom: 24
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 12
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  userDetails: {
    flex: 1
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4
  },
  userPosition: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2
  },
  userEmail: {
    fontSize: 12,
    color: '#9CA3AF'
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12
  },
  settingLabel: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500'
  },
  settingArrow: {
    fontSize: 20,
    color: '#D1D5DB'
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB'
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280'
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937'
  },
  logoutContainer: {
    marginTop: 32,
    marginBottom: 40
  }
});
