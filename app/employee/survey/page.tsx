"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SurveyData, PasswordChangeData, FOOD_OPTIONS, INTEREST_OPTIONS } from '@/app/lib/types/hr';

export default function EmployeeSurveyPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<'survey' | 'password' | 'complete'>('survey');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [employeeInfo, setEmployeeInfo] = useState<any>(null);

    // 설문조사 데이터
    const [surveyData, setSurveyData] = useState<SurveyData>({
        favoriteFoods: [],
        interests: []
    });

    // 비밀번호 변경 데이터
    const [passwordData, setPasswordData] = useState<PasswordChangeData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // 로컬 스토리지에서 직원 정보 확인
        const storedEmployee = localStorage.getItem('currentEmployee');
        console.log('Survey page loaded, storedEmployee:', storedEmployee);
        
        if (storedEmployee) {
            const employeeData = JSON.parse(storedEmployee);
            console.log('Parsed employee data:', employeeData);
            setEmployeeInfo(employeeData);
        } else {
            // 직원 정보가 없으면 로그인 페이지로 리다이렉트
            console.log('No employee data found, redirecting to login...');
            router.push('/employee/login');
        }
    }, [router]);

    // 체크박스 핸들러
    const handleFoodCheckboxChange = (food: string) => {
        setSurveyData(prev => ({
            ...prev,
            favoriteFoods: prev.favoriteFoods.includes(food)
                ? prev.favoriteFoods.filter(f => f !== food)
                : [...prev.favoriteFoods, food]
        }));
    };

    const handleInterestCheckboxChange = (interest: string) => {
        setSurveyData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleSurveySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (surveyData.favoriteFoods.length === 0 || surveyData.interests.length === 0) {
            setError('좋아하는 음식과 관심분야를 각각 최소 1개 이상 선택해주세요.');
            return;
        }

        if (!employeeInfo) {
            setError('직원 정보를 찾을 수 없습니다.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/hr/survey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeId: employeeInfo.id,
                    surveyData: surveyData
                })
            });

            const data = await response.json();

            if (data.success) {
                setCurrentStep('password');
            } else {
                setError(data.message || '설문조사 제출에 실패했습니다.');
            }
        } catch (error) {
            console.error('Survey submission error:', error);
            setError('설문조사 제출 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setError('모든 비밀번호 필드를 입력해주세요.');
            return;
        }

        if (passwordData.newPassword.length < 4) {
            setError('새 비밀번호는 최소 4자리 이상이어야 합니다.');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (passwordData.currentPassword === passwordData.newPassword) {
            setError('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
            return;
        }

        if (!employeeInfo) {
            setError('직원 정보를 찾을 수 없습니다.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/hr/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeId: employeeInfo.id,
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                setCurrentStep('complete');
                // 로컬 스토리지에서 직원 정보 제거
                localStorage.removeItem('currentEmployee');
            } else {
                setError(data.message || '비밀번호 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('Password change error:', error);
            setError('비밀번호 변경 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSkipSurvey = () => {
        setCurrentStep('password');
    };

    const handleSkipPassword = () => {
        setCurrentStep('complete');
        localStorage.removeItem('currentEmployee');
    };

    const handleComplete = () => {
        router.push('/employee/dashboard');
    };

    if (!employeeInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* 헤더 */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {currentStep === 'survey' && '설문조사'}
                        {currentStep === 'password' && '비밀번호 변경'}
                        {currentStep === 'complete' && '완료'}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        안녕하세요, {employeeInfo.name}님! 첫 로그인을 환영합니다.
                    </p>
                </div>

                {/* 진행 단계 표시 */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-4">
                        <div className={`flex items-center ${currentStep === 'survey' ? 'text-indigo-600' : currentStep === 'password' || currentStep === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'survey' ? 'bg-indigo-600 text-white' : currentStep === 'password' || currentStep === 'complete' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                1
                            </div>
                            <span className="ml-2 text-sm">설문조사</span>
                        </div>
                        <div className={`w-16 h-0.5 ${currentStep === 'password' || currentStep === 'complete' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                        <div className={`flex items-center ${currentStep === 'password' ? 'text-indigo-600' : currentStep === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'password' ? 'bg-indigo-600 text-white' : currentStep === 'complete' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                2
                            </div>
                            <span className="ml-2 text-sm">비밀번호 변경</span>
                        </div>
                        <div className={`w-16 h-0.5 ${currentStep === 'complete' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                        <div className={`flex items-center ${currentStep === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'complete' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                3
                            </div>
                            <span className="ml-2 text-sm">완료</span>
                        </div>
                    </div>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
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

                {/* 설문조사 단계 */}
                {currentStep === 'survey' && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">설문조사</h2>
                            <p className="text-gray-600">환영합니다! 간단한 설문조사를 진행해주세요.</p>
                        </div>

                        <form onSubmit={handleSurveySubmit} className="space-y-6">
                            {/* 좋아하는 음식 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    1. 좋아하는 음식 <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
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
                                <div className="grid grid-cols-2 gap-3">
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
                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={handleSkipSurvey}
                                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={loading}
                                >
                                    건너뛰기
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? '제출 중...' : '다음'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* 비밀번호 변경 단계 */}
                {currentStep === 'password' && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">비밀번호 변경</h2>
                            <p className="text-gray-600">보안을 위해 비밀번호를 변경해주세요. 초기 비밀번호는 0000입니다.</p>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            {/* 현재 비밀번호 */}
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    현재 비밀번호 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
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
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
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
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={handleSkipPassword}
                                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={loading}
                                >
                                    건너뛰기
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? '변경 중...' : '완료'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* 완료 단계 */}
                {currentStep === 'complete' && (
                    <div className="bg-white shadow rounded-lg p-6 text-center">
                        <div className="mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">설정 완료!</h2>
                            <p className="text-gray-600">
                                {employeeInfo.name}님의 첫 로그인 설정이 완료되었습니다.
                            </p>
                        </div>

                        <button
                            onClick={handleComplete}
                            className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            메인 페이지로 이동
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
