'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { expenditureAPI } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

interface Expenditure {
  _id: string;
  title: string;
  amount: number;
  category: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedDate: string;
}

export default function ApprovalPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'admin') {
      router.push('/dashboard');
    } else {
      loadExpenditures();
    }
  }, [user, router]);

  const loadExpenditures = async () => {
    setLoading(true);
    try {
      const response = await expenditureAPI.getAllExpenditures();
      setExpenditures(response.data);
    } catch (err) {
      console.error('Failed to load expenditures:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setLoading(true);
    try {
      await expenditureAPI.approveExpenditure(id, comment);
      setComment('');
      setSelectedId(null);
      await loadExpenditures();
    } catch (err: any) {
      console.error('Failed to approve:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setLoading(true);
    try {
      await expenditureAPI.rejectExpenditure(id, comment);
      setComment('');
      setSelectedId(null);
      await loadExpenditures();
    } catch (err: any) {
      console.error('Failed to reject:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExpenditures = expenditures.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user || user.role !== 'admin') {
    return <div className="flex items-center justify-center min-h-screen">접근 권한이 없습니다</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">결재 관리</h1>

        {/* 필터 */}
        <div className="flex gap-2 mb-8">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'primary' : 'secondary'}
              onClick={() => setFilter(f)}
            >
              {f === 'all' && '전체'}
              {f === 'pending' && '대기 중'}
              {f === 'approved' && '승인'}
              {f === 'rejected' && '반려'}
            </Button>
          ))}
        </div>

        {/* 결재 목록 */}
        <div className="space-y-4">
          {filteredExpenditures.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-600">항목이 없습니다</p>
            </Card>
          ) : (
            filteredExpenditures.map((item) => (
              <Card
                key={item._id}
                className={selectedId === item._id ? 'border-2 border-blue-500' : ''}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      신청자: {item.submittedBy}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(item.submittedDate).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-blue-600">
                      ₩{item.amount.toLocaleString()}
                    </p>
                    <div className="mt-2">
                      {item.status === 'pending' && (
                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                          대기 중
                        </span>
                      )}
                      {item.status === 'approved' && (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          승인됨
                        </span>
                      )}
                      {item.status === 'rejected' && (
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                          반려됨
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {item.description && (
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                )}

                {/* 결재 폼 */}
                {selectedId === item._id && item.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900 block mb-2">
                        결재 의견
                      </label>
                      <textarea
                        placeholder="의견을 입력하세요"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant="primary"
                        onClick={() => handleApprove(item._id)}
                        isLoading={loading}
                        className="flex-1"
                      >
                        ✅ 승인
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleReject(item._id)}
                        isLoading={loading}
                        className="flex-1"
                      >
                        ❌ 반려
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedId(null)}
                        className="flex-1"
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                )}

                {/* 선택 버튼 */}
                {selectedId !== item._id && item.status === 'pending' && (
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedId(item._id)}
                    className="w-full mt-4"
                  >
                    검토하기
                  </Button>
                )}
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
