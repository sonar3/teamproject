"use client";
import { useState } from 'react';
import { SurveyData, FOOD_OPTIONS, INTEREST_OPTIONS } from '@/app/lib/types/hr';

interface SurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: SurveyData) => void;
}

export default function SurveyModal({ isOpen, onClose, onSubmit }: SurveyModalProps) {
    const [surveyData, setSurveyData] = useState<SurveyData>({
        favoriteFoods: [],
        interests: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // 체크박스 핸들러
    const handleFoodCheckboxChange = (food: string) => {
        setSurveyData(prev => ({
            ...prev,
            favoriteFoods: prev.favoriteFoods.includes(food)
                ? prev.favoriteFoods.filter(f => f !== food)
                : [...prev.favoriteFoods, food]
        }));
        if (error) setError('');
    };

    const handleInterestCheckboxChange = (interest: string) => {
        setSurveyData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
        if (error) setError('');
    };

    const validateForm = (): boolean => {
        if (surveyData.favoriteFoods.length === 0) {
            setError('좋아하는 음식을 최소 1개 이상 선택해주세요.');
            return false;
        }
        if (surveyData.interests.length === 0) {
            setError('관심분야를 최소 1개 이상 선택해주세요.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            await onSubmit(surveyData);
            onClose();
        } catch (error) {
            console.error('Survey submission error:', error);
            setError('설문조사 제출 중 오류가 발생했습니다.');
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
                            설문조사
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
                            환영합니다! 첫 로그인을 기념하여 간단한 설문조사를 진행합니다.
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

                    {/* 설문 폼 */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 좋아하는 음식 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                1. 좋아하는 음식 <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                                {FOOD_OPTIONS.map((food) => (
                                    <label key={food} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={surveyData.favoriteFoods.includes(food)}
                                            onChange={() => handleFoodCheckboxChange(food)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            disabled={loading}
                                        />
                                        <span className="text-sm text-gray-700">{food}</span>
                                    </label>
                                ))}
                            </div>
                            {surveyData.favoriteFoods.length > 0 && (
                                <p className="mt-2 text-xs text-gray-500">
                                    선택된 음식: {surveyData.favoriteFoods.join(', ')}
                                </p>
                            )}
                        </div>

                        {/* 관심분야 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                2. 관심분야 <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                                {INTEREST_OPTIONS.map((interest) => (
                                    <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={surveyData.interests.includes(interest)}
                                            onChange={() => handleInterestCheckboxChange(interest)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            disabled={loading}
                                        />
                                        <span className="text-sm text-gray-700">{interest}</span>
                                    </label>
                                ))}
                            </div>
                            {surveyData.interests.length > 0 && (
                                <p className="mt-2 text-xs text-gray-500">
                                    선택된 관심분야: {surveyData.interests.join(', ')}
                                </p>
                            )}
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
                                        제출 중...
                                    </div>
                                ) : (
                                    '제출'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
