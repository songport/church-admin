'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { attendanceAPI } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface AttendanceRecord {
  _id: string;
  checkInTime: string;
  checkOutTime?: string;
  date: string;
}

export default function AttendancePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // 위치 확인
  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          calculateDistance(latitude, longitude);
          setLoading(false);
        },
        (err) => {
          setError('위치 권한을 허용해주세요');
          setLoading(false);
        }
      );
    }
  };

  // 거리 계산 (Haversine 공식)
  const calculateDistance = (lat: number, lon: number) => {
    // 강서지부 좌표
    const churchLat = 37.5505;
    const churchLon = 126.8695;

    const R = 6371; // 지구 반지름 (km)
    const dLat = (churchLat - lat) * (Math.PI / 180);
    const dLon = (churchLon - lon) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) *
        Math.cos((churchLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // 미터로 변환

    setDistance(distance);
  };

  // 출석 처리
  const handleCheckIn = async () => {
    if (!location) {
      setError('먼저 위치를 확인해주세요');
      return;
    }

    setLoading(true);
    try {
      await attendanceAPI.checkIn(location.lat, location.lon);
      setCheckedIn(true);
      setError(null);
      loadAttendanceRecords();
    } catch (err: any) {
      setError(err.response?.data?.message || '출석 처리 실패');
    } finally {
      setLoading(false);
    }
  };

  // 퇴석 처리
  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await attendanceAPI.checkOut();
      setCheckedIn(false);
      setError(null);
      loadAttendanceRecords();
    } catch (err: any) {
      setError(err.response?.data?.message || '퇴석 처리 실패');
    } finally {
      setLoading(false);
    }
  };

  // 출석 기록 로드
  const loadAttendanceRecords = async () => {
    try {
      const response = await attendanceAPI.getTodayAttendance();
      setRecords(response.data);
    } catch (err) {
      console.error('Failed to load records:', err);
    }
  };

  useEffect(() => {
    loadAttendanceRecords();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">출석 관리</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* 위치 확인 섹션 */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold mb-4">현재 위치</h2>

          <div className="space-y-4">
            <Button
              onClick={getLocation}
              variant="primary"
              isLoading={loading}
              className="w-full"
            >
              📍 위치 확인
            </Button>

            {location && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  좌표: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                </p>
                {distance !== null && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">
                      교회까지 거리: {distance.toFixed(0)}m
                    </p>
                    {distance < 100 ? (
                      <p className="text-sm text-green-600 mt-1">✅ 출석 가능</p>
                    ) : (
                      <p className="text-sm text-orange-600 mt-1">⚠️ 교회 범위 내 아님</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {location && distance !== null && distance < 100 && (
              <div className="flex gap-4">
                <Button
                  onClick={handleCheckIn}
                  variant="primary"
                  isLoading={loading}
                  disabled={checkedIn}
                  className="flex-1"
                >
                  ✅ 출석
                </Button>
                <Button
                  onClick={handleCheckOut}
                  variant="secondary"
                  isLoading={loading}
                  disabled={!checkedIn}
                  className="flex-1"
                >
                  🚪 퇴석
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* 출석 기록 */}
        <Card>
          <h2 className="text-xl font-bold mb-4">출석 기록</h2>

          {records.length === 0 ? (
            <p className="text-gray-600 text-center py-8">출석 기록이 없습니다</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-2 px-2">날짜</th>
                    <th className="text-left py-2 px-2">입장 시간</th>
                    <th className="text-left py-2 px-2">퇴장 시간</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record._id} className="border-b border-gray-100">
                      <td className="py-2 px-2">{new Date(record.date).toLocaleDateString('ko-KR')}</td>
                      <td className="py-2 px-2">{new Date(record.checkInTime).toLocaleTimeString('ko-KR')}</td>
                      <td className="py-2 px-2">
                        {record.checkOutTime
                          ? new Date(record.checkOutTime).toLocaleTimeString('ko-KR')
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
