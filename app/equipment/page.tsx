'use client';

import { useState, useEffect } from 'react';
import { Equipment, EquipmentListResponse, EQUIPMENT_CATEGORIES, EQUIPMENT_STATUS } from '@/app/lib/types/equipment';
import { AuthGuard } from '@/app/lib/withAuth';
import EquipmentModal from '@/components/EquipmentModal';

export default function EquipmentPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterUsage, setFilterUsage] = useState<string>('all');

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/equipment/equipments');
      const data: EquipmentListResponse = await response.json();
      
      if (data.success && data.data) {
        setEquipments(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch equipments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    setIsModalOpen(true);
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEquipment(null);
  };

  const handleModalSuccess = () => {
    fetchEquipments();
    handleModalClose();
  };

  const handleDeleteEquipment = async (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/equipment/equipments/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchEquipments();
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete equipment:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const getCategoryLabel = (category: string, customCategory?: string) => {
    if (category === 'other' && customCategory) {
      return customCategory;
    }
    return EQUIPMENT_CATEGORIES.find(cat => cat.value === category)?.label || category;
  };

  const getStatusLabel = (status: string) => {
    return EQUIPMENT_STATUS.find(s => s.value === status)?.label || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800',
      repair: 'bg-orange-100 text-orange-800',
      disposed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getUsageColor = (isInUse: boolean) => {
    return isInUse ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  // 필터링된 장비 목록
  const filteredEquipments = equipments.filter(equipment => {
    const categoryMatch = filterCategory === 'all' || equipment.category === filterCategory;
    const statusMatch = filterStatus === 'all' || equipment.status === filterStatus;
    const usageMatch = filterUsage === 'all' || 
      (filterUsage === 'in-use' && equipment.isInUse) || 
      (filterUsage === 'not-in-use' && !equipment.isInUse);
    
    return categoryMatch && statusMatch && usageMatch;
  });

  // 통계 정보
  const stats = {
    total: equipments.length,
    inUse: equipments.filter(e => e.isInUse).length,
    notInUse: equipments.filter(e => !e.isInUse).length,
    byCategory: EQUIPMENT_CATEGORIES.map(cat => ({
      category: cat.label,
      count: equipments.filter(e => e.category === cat.value).length
    }))
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">장비관리</h1>
                <p className="mt-2 text-gray-600">프로젝트 투입된 장비들을 관리합니다.</p>
              </div>
              <button
                onClick={handleAddEquipment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + 장비 등록
              </button>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">전체 장비</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">사용중</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.inUse}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">미사용</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.notInUse}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">사용률</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.total > 0 ? Math.round((stats.inUse / stats.total) * 100) : 0}%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 필터 */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">장비 구분</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">전체</option>
                    {EQUIPMENT_CATEGORIES.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">전체</option>
                    {EQUIPMENT_STATUS.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">사용여부</label>
                  <select
                    value={filterUsage}
                    onChange={(e) => setFilterUsage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">전체</option>
                    <option value="in-use">사용중</option>
                    <option value="not-in-use">미사용</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 장비 목록 */}
          <div className="bg-white shadow rounded-lg">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">로딩 중...</p>
              </div>
            ) : filteredEquipments.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 장비가 없습니다</h3>
                <p className="text-gray-600 mb-4">새로운 장비를 등록해보세요.</p>
                <button
                  onClick={handleAddEquipment}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  첫 번째 장비 등록하기
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        장비 구분
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        지급자
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        장비정보
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        사용여부
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        지급일
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEquipments.map((equipment) => (
                      <tr key={equipment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {getCategoryLabel(equipment.category, equipment.customCategory)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{equipment.assigneeName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={equipment.equipmentInfo}>
                            {equipment.equipmentInfo}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(equipment.status)}`}>
                            {getStatusLabel(equipment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUsageColor(equipment.isInUse)}`}>
                            {equipment.isInUse ? '사용중' : '미사용'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(equipment.assignedDate).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditEquipment(equipment)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteEquipment(equipment.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <EquipmentModal
            equipment={editingEquipment}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
          />
        )}
      </div>
    </AuthGuard>
  );
}
