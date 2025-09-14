'use client';

import { useState, useEffect } from 'react';
import { CollaborationTool, CollaborationFormData, TOOL_OPTIONS } from '@/app/lib/types/collaboration';

interface CollaborationModalProps {
  tool: CollaborationTool | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CollaborationModal({ tool, onClose, onSuccess }: CollaborationModalProps) {
  const [formData, setFormData] = useState<CollaborationFormData>({
    name: '',
    tool: '',
    loginInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CollaborationFormData>>({});

  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name,
        tool: tool.tool,
        loginInfo: tool.loginInfo
      });
    } else {
      setFormData({
        name: '',
        tool: '',
        loginInfo: ''
      });
    }
    setErrors({});
  }, [tool]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CollaborationFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.tool) {
      newErrors.tool = '도구를 선택해주세요.';
    }

    if (!formData.loginInfo.trim()) {
      newErrors.loginInfo = '로그인정보를 입력해주세요.';
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
      const url = tool ? `/api/collaboration/tools/${tool.id}` : '/api/collaboration/tools';
      const method = tool ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        alert(errorData.message || '오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Failed to save collaboration tool:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CollaborationFormData, value: string) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {tool ? '협업툴 수정' : '협업툴 등록'}
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                이름 *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="예: 팀 슬랙, 프로젝트 노션 등"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="tool" className="block text-sm font-medium text-gray-700 mb-1">
                도구 *
              </label>
              <select
                id="tool"
                value={formData.tool}
                onChange={(e) => handleInputChange('tool', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.tool ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">도구를 선택해주세요</option>
                {TOOL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.tool && (
                <p className="mt-1 text-sm text-red-600">{errors.tool}</p>
              )}
            </div>

            <div>
              <label htmlFor="loginInfo" className="block text-sm font-medium text-gray-700 mb-1">
                로그인정보 *
              </label>
              <textarea
                id="loginInfo"
                value={formData.loginInfo}
                onChange={(e) => handleInputChange('loginInfo', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors.loginInfo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="예: 아이디/비밀번호, 링크, 접속 방법 등"
              />
              {errors.loginInfo && (
                <p className="mt-1 text-sm text-red-600">{errors.loginInfo}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
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
                  tool ? '수정' : '등록'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
