"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployeeDashboard() {
    const router = useRouter();
    const [employeeInfo, setEmployeeInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 로컬 스토리지에서 직원 정보 확인
        const storedEmployee = localStorage.getItem('currentEmployee');
        console.log('Dashboard loaded, storedEmployee:', storedEmployee);
        
        if (storedEmployee) {
            const employeeData = JSON.parse(storedEmployee);
            console.log('Parsed employee data:', employeeData);
            setEmployeeInfo(employeeData);
        } else {
            // 직원 정보가 없으면 로그인 페이지로 리다이렉트
            console.log('No employee data found, redirecting to login...');
            router.push('/employee/login');
        }
        setLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('currentEmployee');
        router.push('/employee/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!employeeInfo) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">직원 대시보드</h1>
                            <p className="text-gray-600">안녕하세요, {employeeInfo.name}님!</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">{employeeInfo.position}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                로그아웃
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* 환영 메시지 */}
                    <div className="mb-8 bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            환영합니다!
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {employeeInfo.name}님, 시스템에 성공적으로 로그인하셨습니다.
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 직원 정보 카드 */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {/* 기본 정보 */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                기본 정보
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {employeeInfo.name}
                                            </dd>
                                            <dd className="text-sm text-gray-500">
                                                {employeeInfo.email}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 직급 정보 */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                직급
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {employeeInfo.position}
                                            </dd>
                                            <dd className="text-sm text-gray-500">
                                                {employeeInfo.gender}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 프로젝트 정보 */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                참여 프로젝트
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {employeeInfo.project}
                                            </dd>
                                            <dd className="text-sm text-gray-500">
                                                투입일: {new Date(employeeInfo.startDate).toLocaleDateString('ko-KR')}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 빠른 액션 버튼들 */}
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">빠른 액션</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <Link
                                href="/dashboard"
                                className="inline-flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <div className="text-2xl mb-2">📊</div>
                                <div className="text-sm font-medium">대시보드</div>
                            </Link>
                            <Link
                                href="/blog"
                                className="inline-flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <div className="text-2xl mb-2">📝</div>
                                <div className="text-sm font-medium">블로그</div>
                            </Link>
                            <Link
                                href="/reports"
                                className="inline-flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <div className="text-2xl mb-2">📋</div>
                                <div className="text-sm font-medium">보고서</div>
                            </Link>
                            <Link
                                href="/notices"
                                className="inline-flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <div className="text-2xl mb-2">📢</div>
                                <div className="text-sm font-medium">공지사항</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
