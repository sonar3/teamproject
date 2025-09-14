'use client';

import { useState, useEffect } from 'react';
import { Vacation, VacationFormData, VACATION_TYPES } from '@/app/lib/types/vacation';

interface VacationModalProps {
  selectedDate: Date;
  vacation: Vacation | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VacationModal({ selectedDate, vacation, onClose, onSuccess }: VacationModalProps) {
  const [formData, setFormData] = useState<VacationFormData>({
    employeeId: '',
    employeeName: '',
    startDate: '',
    endDate: '',
    type: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<VacationFormData>>({});
  const [employees, setEmployees] = useState<Array<{id: string, name: string}>>([]);

  useEffect(() => {
    // 직원 목록 가져오기
    fetchEmployees();
    
    if (vacation) {
      setFormData({
        employeeId: vacation.employeeId,
        employeeName: vacation.employeeName,
        startDate: vacation.startDate.split('T')[0],
        endDate: vacation.endDate.split('T')[0],
        type: vacation.type,
        reason: vacation.reason || ''
      });
    } else {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setFormData({
        employeeId: '',
        employeeName: '',
        startDate: dateStr,
        endDate: dateStr,
        type: '',
        reason: ''
      });
    }
    setErrors({});
  }, [vacation, selectedDate]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/hr/employees');
      const data = await response.json();
      if (data.success && data.data) {
        setEmployees(data.data.map((emp: any) => ({
          id: emp.id,
          name: emp.name
        })));
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<VacationFormData> = {};

    if (!formData.employeeId) {
      newErrors.employeeId = '직원을 선택해주세요.';
    }

    if (!formData.startDate) {
      newErrors.startDate = '시작일을 입력해주세요.';
    }

    if (!formData.endDate) {
      newErrors.endDate = '종료일을 입력해주세요.';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = '종료일은 시작일보다 늦어야 합니다.';
    }

    if (!formData.type) {
      newErrors.type = '휴가 유형을 선택해주세요.';
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
      const url = vacation ? `/api/vacation/vacations/${vacation.id}` : '/api/vacation/vacations';
      const method = vacation ? 'PUT' : 'POST';

      const submitData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
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
      console.error('Failed to save vacation:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof VacationFormData, value: string) => {
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

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    setFormData(prev => ({
      ...prev,
      employeeId,
      employeeName: employee?.name || ''
    }));
  };

  const handleDelete = async () => {
    if (!vacation) return;
    
    if (!confirm('정말로 이 휴가를 삭제하시겠습니까?')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/vacation/vacations/${vacation.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete vacation:', error);
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
              {vacation ? '휴가 수정' : '휴가 등록'}
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
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                직원 *
              </label>
              <select
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.employeeId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">직원을 선택해주세요</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
              {errors.employeeId && (
                <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  시작일 *
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  종료일 *
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                휴가 유형 *
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">휴가 유형을 선택해주세요</option>
                {VACATION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                사유 (선택사항)
              </label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="휴가 사유를 입력해주세요"
              />
            </div>

            <div className="flex justify-between pt-4">
              <div>
                {vacation && (
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
                    vacation ? '수정' : '등록'
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
