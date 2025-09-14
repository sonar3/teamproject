'use client';

import { useState, useEffect } from 'react';
import { Equipment, EquipmentFormData, EQUIPMENT_CATEGORIES, EQUIPMENT_STATUS } from '@/app/lib/types/equipment';

interface EquipmentModalProps {
  equipment: Equipment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EquipmentModal({ equipment, onClose, onSuccess }: EquipmentModalProps) {
  const [formData, setFormData] = useState<EquipmentFormData>({
    category: '',
    customCategory: '',
    assigneeName: '',
    equipmentInfo: '',
    status: '',
    isInUse: true,
    assignedDate: '',
    returnedDate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<EquipmentFormData>>({});

  useEffect(() => {
    if (equipment) {
      setFormData({
        category: equipment.category,
        customCategory: equipment.customCategory || '',
        assigneeName: equipment.assigneeName,
        equipmentInfo: equipment.equipmentInfo,
        status: equipment.status,
        isInUse: equipment.isInUse,
        assignedDate: equipment.assignedDate.split('T')[0],
        returnedDate: equipment.returnedDate ? equipment.returnedDate.split('T')[0] : '',
        notes: equipment.notes || ''
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        category: '',
        customCategory: '',
        assigneeName: '',
        equipmentInfo: '',
        status: '',
        isInUse: true,
        assignedDate: today,
        returnedDate: '',
        notes: ''
      });
    }
    setErrors({});
  }, [equipment]);

  const validateForm = (): boolean => {
    const newErrors: Partial<EquipmentFormData> = {};

    if (!formData.category) {
      newErrors.category = '장비 구분을 선택해주세요.';
    }

    if (formData.category === 'other' && !formData.customCategory?.trim()) {
      newErrors.customCategory = '기타 장비명을 입력해주세요.';
    }

    if (!formData.assigneeName.trim()) {
      newErrors.assigneeName = '지급자 이름을 입력해주세요.';
    }

    if (!formData.equipmentInfo.trim()) {
      newErrors.equipmentInfo = '장비정보를 입력해주세요.';
    }

    if (!formData.status) {
      newErrors.status = '상태를 선택해주세요.';
    }

    if (!formData.assignedDate) {
      newErrors.assignedDate = '지급일을 입력해주세요.';
    }

    if (formData.returnedDate && formData.assignedDate && new Date(formData.returnedDate) < new Date(formData.assignedDate)) {
      newErrors.returnedDate = '반납일은 지급일보다 늦어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const url = equipment ? `/api/equipment/equipments/${equipment.id}` : '/api/equipment/equipments';
      const method = equipment ? 'PUT' : 'POST';

      const submitData = {
        ...formData,
        assignedDate: new Date(formData.assignedDate).toISOString(),
        returnedDate: formData.returnedDate ? new Date(formData.returnedDate).toISOString() : undefined
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        alert(errorData.message || '오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Failed to save equipment:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof EquipmentFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleDelete = async () => {
    if (!equipment) return;
    
    if (!confirm('정말로 이 장비를 삭제하시겠습니까?')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/equipment/equipments/${equipment.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete equipment:', error);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {equipment ? '장비 수정' : '장비 등록'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                장비 구분 *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">장비 구분을 선택해주세요</option>
                {EQUIPMENT_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {formData.category === 'other' && (
              <div>
                <label htmlFor="customCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  기타 장비명 *
                </label>
                <input
                  type="text"
                  id="customCategory"
                  value={formData.customCategory}
                  onChange={(e) => handleInputChange('customCategory', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.customCategory ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="예: 태블릿, 스마트폰, 키보드 등"
                />
                {errors.customCategory && (
                  <p className="mt-1 text-sm text-red-600">{errors.customCategory}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="assigneeName" className="block text-sm font-medium text-gray-700 mb-1">
                지급자 이름 *
              </label>
              <input
                type="text"
                id="assigneeName"
                value={formData.assigneeName}
                onChange={(e) => handleInputChange('assigneeName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.assigneeName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="예: 홍길동"
              />
              {errors.assigneeName && (
                <p className="mt-1 text-sm text-red-600">{errors.assigneeName}</p>
              )}
            </div>

            <div>
              <label htmlFor="equipmentInfo" className="block text-sm font-medium text-gray-700 mb-1">
                장비정보 *
              </label>
              <textarea
                id="equipmentInfo"
                value={formData.equipmentInfo}
                onChange={(e) => handleInputChange('equipmentInfo', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors.equipmentInfo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="예: 모델명, 시리얼번호, 사양 등"
              />
              {errors.equipmentInfo && (
                <p className="mt-1 text-sm text-red-600">{errors.equipmentInfo}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  상태 *
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.status ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">상태를 선택해주세요</option>
                  {EQUIPMENT_STATUS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
              </div>

              <div>
                <label htmlFor="isInUse" className="block text-sm font-medium text-gray-700 mb-1">
                  사용여부 *
                </label>
                <select
                  id="isInUse"
                  value={formData.isInUse.toString()}
                  onChange={(e) => handleInputChange('isInUse', e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">사용중</option>
                  <option value="false">미사용</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="assignedDate" className="block text-sm font-medium text-gray-700 mb-1">
                  지급일 *
                </label>
                <input
                  type="date"
                  id="assignedDate"
                  value={formData.assignedDate}
                  onChange={(e) => handleInputChange('assignedDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.assignedDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.assignedDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.assignedDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="returnedDate" className="block text-sm font-medium text-gray-700 mb-1">
                  반납일 (선택사항)
                </label>
                <input
                  type="date"
                  id="returnedDate"
                  value={formData.returnedDate}
                  onChange={(e) => handleInputChange('returnedDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.returnedDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.returnedDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.returnedDate}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                비고 (선택사항)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="추가 정보나 메모를 입력해주세요"
              />
            </div>

            <div className="flex justify-between pt-4">
              <div>
                {equipment && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    삭제
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  disabled={loading}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      저장 중...
                    </div>
                  ) : (
                    equipment ? '수정' : '등록'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
