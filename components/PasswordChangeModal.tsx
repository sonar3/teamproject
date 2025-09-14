"use client";
import { useState } from 'react';
import { PasswordChangeData } from '@/app/lib/types/hr';

interface PasswordChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PasswordChangeData) => void;
}

export default function PasswordChangeModal({ isOpen, onClose, onSubmit }: PasswordChangeModalProps) {
    const [passwordData, setPasswordData] = useState<PasswordChangeData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const validateForm = (): boolean => {
        if (!passwordData.currentPassword) {
            setError('현재 비밀번호를 입력해주세요.');
            return false;
        }
        if (!passwordData.newPassword) {
            setError('새 비밀번호를 입력해주세요.');
            return false;
        }
        if (passwordData.newPassword.length < 4) {
            setError('새 비밀번호는 최소 4자리 이상이어야 합니다.');
            return false;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
            return false;
        }
        if (passwordData.currentPassword === passwordData.newPassword) {
            setError('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            await onSubmit(passwordData);
            onClose();
        } catch (error) {
            console.error('Password change error:', error);
            setError('비밀번호 변경 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    {/* 헤더 */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            비밀번호 변경
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* 설명 */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-600">
                            보안을 위해 비밀번호를 변경해주세요. 초기 비밀번호는 0000입니다.
                        </p>
                    </div>

                    {/* 에러 메시지 */}
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 비밀번호 변경 폼 */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* 현재 비밀번호 */}
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                현재 비밀번호 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handleInputChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="현재 비밀번호를 입력하세요"
                                disabled={loading}
                            />
                        </div>

                        {/* 새 비밀번호 */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                새 비밀번호 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handleInputChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="새 비밀번호를 입력하세요 (최소 4자리)"
                                disabled={loading}
                            />
                        </div>

                        {/* 비밀번호 확인 */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                새 비밀번호 확인 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handleInputChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="새 비밀번호를 다시 입력하세요"
                                disabled={loading}
                            />
                        </div>

                        {/* 비밀번호 요구사항 */}
                        <div className="text-xs text-gray-500">
                            <p>비밀번호 요구사항:</p>
                            <ul className="list-disc list-inside ml-2">
                                <li>최소 4자리 이상</li>
                                <li>현재 비밀번호와 달라야 함</li>
                            </ul>
                        </div>

                        {/* 버튼 */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={loading}
                            >
                                나중에
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        변경 중...
                                    </div>
                                ) : (
                                    '변경'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
