"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EmployeeLoginData, EmployeeLoginResponse } from '@/app/lib/types/hr';
import { useAuthStore } from '@/app/lib/authStore';

export default function EmployeeLoginPage() {
    const router = useRouter();
    const { setUser, setToken } = useAuthStore();
    const [loginData, setLoginData] = useState<EmployeeLoginData>({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!loginData.email || !loginData.password) {
            setError('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/hr/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const data: EmployeeLoginResponse = await response.json();
            
            // 디버깅을 위한 로그
            console.log('Login response:', data);

            if (data.success && data.data) {
                console.log('Login successful, isFirstLogin:', data.data.isFirstLogin);
                console.log('Employee data:', data.data.employee);
                
                // authStore에 사용자 정보 저장
                setUser({
                    id: data.data.employee.id,
                    email: data.data.employee.email,
                    name: data.data.employee.name,
                    grade: data.data.employee.grade
                });
                
                // 로컬 스토리지에도 저장
                localStorage.setItem('userInfo', JSON.stringify({
                    id: data.data.employee.id,
                    email: data.data.employee.email,
                    name: data.data.employee.name,
                    grade: data.data.employee.grade
                }));
                localStorage.setItem('authToken', 'employee_token_' + data.data.employee.id);
                localStorage.setItem('currentEmployee', JSON.stringify(data.data.employee));
                
                if (data.data.isFirstLogin) {
                    // 첫 로그인인 경우 설문조사 페이지로 이동
                    console.log('Redirecting to survey page...');
                    router.push('/employee/survey');
                } else {
                    // 일반 로그인인 경우 대시보드로 이동
                    console.log('Redirecting to dashboard...');
                    router.push('/employee/dashboard');
                }
            } else {
                console.log('Login failed:', data.message);
                setError(data.message || '로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('로그인 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        직원 로그인
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        이메일과 비밀번호를 입력하여 로그인하세요
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-800 text-center">
                            <strong>초기 비밀번호:</strong> 0000
                        </p>
                        <p className="text-xs text-blue-600 text-center mt-1">
                            첫 로그인 시 설문조사와 비밀번호 변경이 필요합니다
                        </p>
                    </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {/* 에러 메시지 */}
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
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

                    <div className="rounded-md shadow-sm -space-y-px">
                        {/* 이메일 */}
                        <div>
                            <label htmlFor="email" className="sr-only">
                                이메일
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={loginData.email}
                                onChange={handleInputChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="이메일 주소"
                                disabled={loading}
                            />
                        </div>

                        {/* 비밀번호 */}
                        <div>
                            <label htmlFor="password" className="sr-only">
                                비밀번호
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={loginData.password}
                                onChange={handleInputChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="비밀번호"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* 로그인 버튼 */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    로그인 중...
                                </div>
                            ) : (
                                '로그인'
                            )}
                        </button>
                    </div>

                    {/* 안내 메시지 */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            초기 비밀번호는 <span className="font-semibold">0000</span> 입니다.
                        </p>
                        <div className="mt-4">
                            <Link 
                                href="/" 
                                className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                                ← 홈으로 돌아가기
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
