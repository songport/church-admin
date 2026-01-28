import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { AuthContext } from '../context/AuthContext';
import { attendanceAPI } from '../services/api';

const LOCATION_TASK_NAME = 'background-location-task';

export const AttendanceScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [location, setLocation] = useState(null);
  const [isInChurch, setIsInChurch] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [distance, setDistance] = useState(null);

  // 위치 권한 요청
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status: foregroundStatus } =
          await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus === 'granted') {
          const { status: backgroundStatus } =
            await Location.requestBackgroundPermissionsAsync();
          if (backgroundStatus === 'granted') {
            startLocationTracking();
          }
        } else {
          Alert.alert(
            '위치 권한',
            '출석 체크를 위해 위치 권한이 필요합니다.'
          );
        }
      } catch (error) {
        console.error('위치 권한 요청 오류:', error);
      }
    };

    requestLocationPermission();
  }, []);

  // 위치 추적 시작
  const startLocationTracking = async () => {
    try {
      // 백그라운드 위치 추적 작업 정의
      TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
        if (error) {
          console.error('위치 추적 오류:', error);
          return;
        }

        if (data) {
          const { locations } = data;
          if (locations && locations.length > 0) {
            const currentLocation = locations[0];
            checkGeofencing(currentLocation.coords);
          }
        }
      });

      // 백그라운드 위치 추적 시작
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 30000, // 30초마다 업데이트
        distanceInterval: 10, // 10미터 이상 이동 시
      });

      console.log('백그라운드 위치 추적이 시작되었습니다.');
    } catch (error) {
      console.error('위치 추적 시작 오류:', error);
    }
  };

  // 지오펜싱 확인
  const checkGeofencing = async (coords) => {
    try {
      const response = await attendanceAPI.checkGeofencing(
        coords.latitude,
        coords.longitude
      );

      if (response.data.success) {
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude
        });
        setIsInChurch(response.data.isInside);
        setDistance(response.data.distance);
      }
    } catch (error) {
      console.error('지오펜싱 확인 오류:', error);
    }
  };

  // 현재 위치 조회
  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const { latitude, longitude } = currentLocation.coords;
      await checkGeofencing({ latitude, longitude });
    } catch (error) {
      console.error('현재 위치 조회 오류:', error);
      Alert.alert('오류', '위치를 가져올 수 없습니다.');
    } finally {
      setLocationLoading(false);
    }
  };

  // 출석 체크인
  const handleCheckIn = async () => {
    if (!location) {
      Alert.alert('오류', '위치 정보를 다시 불러주세요.');
      return;
    }

    try {
      setLoading(true);
      const response = await attendanceAPI.checkIn(
        location.latitude,
        location.longitude
      );

      if (response.data.success) {
        setCheckedIn(true);
        Alert.alert('출석 완료', '출석이 확인되었습니다.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || '출석 체크인 실패';
      Alert.alert('오류', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 퇴청
  const handleCheckOut = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.checkOut();

      if (response.data.success) {
        setCheckedIn(false);
        Alert.alert('퇴청 완료', '퇴청이 확인되었습니다.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || '퇴청 실패';
      Alert.alert('오류', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', onPress: () => {} },
      {
        text: '확인',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>안녕하세요,</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        {/* 위치 정보 */}
        <View style={styles.locationCard}>
          <Text style={styles.sectionTitle}>현재 위치</Text>
          <View style={styles.locationInfo}>
            {location ? (
              <>
                <Text style={styles.coordsText}>
                  위도: {location.latitude.toFixed(4)}°
                </Text>
                <Text style={styles.coordsText}>
                  경도: {location.longitude.toFixed(4)}°
                </Text>
                {distance !== null && (
                  <Text style={[
                    styles.distanceText,
                    { color: isInChurch ? '#4CAF50' : '#F44336' }
                  ]}>
                    교회까지 거리: {distance}m
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.noLocationText}>위치 정보를 불러오는 중...</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={getCurrentLocation}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <ActivityIndicator color="#2196F3" size="small" />
            ) : (
              <Text style={styles.refreshButtonText}>위치 새로고침</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 지오펜싱 상태 */}
        <View style={[
          styles.statusCard,
          { backgroundColor: isInChurch ? '#E8F5E9' : '#FFEBEE' }
        ]}>
          <Text style={styles.sectionTitle}>
            {isInChurch ? '✓ 교회 경계 내' : '✗ 교회 경계 외'}
          </Text>
          <Text style={[
            styles.statusText,
            { color: isInChurch ? '#2E7D32' : '#C62828' }
          ]}>
            {isInChurch
              ? '출석 버튼을 눌러주세요.'
              : '교회에 더 가까워져 주세요.'}
          </Text>
        </View>

        {/* 출석/퇴청 버튼 */}
        {isInChurch && (
          <View style={styles.buttonContainer}>
            {!checkedIn ? (
              <TouchableOpacity
                style={[styles.actionButton, styles.checkInButton]}
                onPress={handleCheckIn}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>출석</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, styles.checkOutButton]}
                onPress={handleCheckOut}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>퇴청</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* 상태 표시 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>출석 상태</Text>
          <Text style={[
            styles.infoStatus,
            { color: checkedIn ? '#4CAF50' : '#999' }
          ]}>
            {checkedIn ? '✓ 출석 완료' : '- 미입장'}
          </Text>
          <Text style={styles.infoNote}>
            5시간 후 자동으로 퇴청 처리됩니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1,
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8
  },
  greeting: {
    fontSize: 14,
    color: '#666'
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f44336'
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  locationCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  locationInfo: {
    marginBottom: 12
  },
  coordsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'monospace'
  },
  distanceText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8
  },
  noLocationText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic'
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center'
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  statusCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3'
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500'
  },
  buttonContainer: {
    marginBottom: 16
  },
  actionButton: {
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkInButton: {
    backgroundColor: '#4CAF50'
  },
  checkOutButton: {
    backgroundColor: '#FF9800'
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  infoStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  infoNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic'
  }
});
