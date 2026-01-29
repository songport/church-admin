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
  imageUrl?: string;
}

export default function ExpenditurePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'others',
    description: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await expenditureAPI.createExpenditure({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setFormData({ title: '', amount: '', category: 'others', description: '' });
      setShowForm(false);
      await loadExpenditures();
    } catch (err: any) {
      console.error('Failed to create expenditure:', err);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">지출 관리</h1>
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            + 새 결의서
          </Button>
        </div>

        {/* 새 결의서 폼 */}
        {showForm && (
          <Card className="mb-8">
            <h2 className="text-xl font-bold mb-4">새 결의서 작성</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="제목"
                type="text"
                placeholder="지출 항목"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <Input
                label="금액 (원)"
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />

              <div>
                <label className="text-sm font-medium text-gray-900 block mb-2">
                  카테고리
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="others">기타</option>
                  <option value="office">사무용품</option>
                  <option value="facility">시설비</option>
                  <option value="education">교육비</option>
                  <option value="maintenance">유지비</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 block mb-2">
                  설명
                </label>
                <textarea
                  placeholder="상세 내용"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="primary" isLoading={loading}>
                  제출
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                >
                  취소
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* 지출 목록 */}
        <div className="grid gap-4">
          {expenditures.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-600">지출 항목이 없습니다</p>
            </Card>
          ) : (
            expenditures.map((item) => (
              <Card key={item._id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
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
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
