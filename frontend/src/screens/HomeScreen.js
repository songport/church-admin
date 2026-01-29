import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import * as Location from 'expo-location';
import { Card } from '../components/Card';

export const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [nearestChurch, setNearestChurch] = useState(null);

  const churches = [
    { id: 1, name: '강서지부', lat: 37.6379499, lon: 126.8747216 },
    { id: 2, name: '송파지부', lat: 37.5524510, lon: 126.8589197 }
  ];

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });

      let minDistance = Infinity;
      let closest = null;

      churches.forEach((church) => {
        const dist = calculateDistance(latitude, longitude, church.lat, church.lon);
        if (dist < minDistance) {
          minDistance = dist;
          closest = church;
        }
      });

      setNearestChurch(closest);
      setDistance(minDistance);
    } catch (error) {
      console.error('위치 조회 오류:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>주님의 교회</Text>
          <Text style={styles.subtitle}>스마트 행정 시스템</Text>
        </View>

        <Card style={styles.locationCard}>
          <View style={styles.locationContent}>
            <View>
              <Text style={styles.locationLabel}>📍 현재 위치</Text>
              <Text style={styles.churchName}>
                {nearestChurch?.name || '위치 확인 중...'}
              </Text>
              <Text style={styles.distance}>
                🌡️ 거리: {distance ? `${Math.round(distance)}m` : '계산 중...'}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                distance !== null && distance <= 30
                  ? styles.statusActive
                  : styles.statusInactive
              ]}
            >
              <Text style={styles.statusText}>
                {distance !== null && distance <= 30 ? '✅ 출석\n가능' : '❌ 범위\n외부'}
              </Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>빠른 메뉴</Text>
        <View style={styles.quickMenuGrid}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Attendance')}
          >
            <Text style={styles.menuIcon}>📍</Text>
            <Text style={styles.menuText}>출석</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Attendance')}
          >
            <Text style={styles.menuIcon}>✅</Text>
            <Text style={styles.menuText}>퇴청</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Expenditure')}
          >
            <Text style={styles.menuIcon}>💰</Text>
            <Text style={styles.menuText}>지출</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Approval')}
          >
            <Text style={styles.menuIcon}>🔏</Text>
            <Text style={styles.menuText}>결재</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>오늘의 현황</Text>
        <Card style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>총 출석</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>결재 대기</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>미처리</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>최근 소식</Text>
        <Card style={styles.newsCard}>
          <Text style={styles.newsItem}>• 주일 예배: 10:00</Text>
          <Text style={styles.newsItem}>• 중보기도: 매주 목요일 20:00</Text>
          <Text style={styles.newsItem}>• 교육관 청소: 토요일 10:00</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6'
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB'
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4
  },
  locationCard: {
    margin: 16,
    backgroundColor: '#FFFFFF'
  },
  locationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  locationLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8
  },
  churchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4
  },
  distance: {
    fontSize: 14,
    color: '#059669'
  },
  statusBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusActive: {
    backgroundColor: '#D1FAE5'
  },
  statusInactive: {
    backgroundColor: '#FEE2E2'
  },
  statusText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#1F2937'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12
  },
  quickMenuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12
  },
  menuButton: {
    width: '48%',
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937'
  },
  statsCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF'
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB'
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB'
  },
  newsCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF'
  },
  newsItem: {
    fontSize: 14,
    color: '#1F2937',
    marginVertical: 6
  }
});
