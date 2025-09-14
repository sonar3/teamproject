"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, checkAuthStatus } from '@/app/lib/authStore';
import { AuthGuard } from '@/app/lib/withAuth';

function DashboardContent() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* 헤더 */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
                    <p className="mt-2 text-gray-600">
                        Fit Team Library 관리자 페이지에 오신 것을 환영합니다.
                    </p>
                </div>

                {/* 사용자 정보 카드 */}
                <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            사용자 정보
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">이름</dt>
                                <dd className="mt-1 text-sm text-gray-900">{user?.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">이메일</dt>
                                <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">사용자 ID</dt>
                                <dd className="mt-1 text-sm text-gray-900">{user?.id}</dd>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 관리 기능 카드들 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* 사용자 관리 */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            사용자 관리
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            사용자 계정 관리
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-700 hover:text-indigo-900">
                                    관리하기
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* 콘텐츠 관리 */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            콘텐츠 관리
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            가이드 및 문서 관리
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <a href="/guide/" className="font-medium text-indigo-700 hover:text-indigo-900">
                                    관리하기
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* 시스템 설정 */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            시스템 설정
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            시스템 환경 설정
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <a href="/admin/dashboard-settings" className="font-medium text-indigo-700 hover:text-indigo-900">
                                    설정하기
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 통계 정보 */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            시스템 통계
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-indigo-600">1,234</div>
                                <div className="text-sm text-gray-500">총 사용자</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">567</div>
                                <div className="text-sm text-gray-500">활성 사용자</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">89</div>
                                <div className="text-sm text-gray-500">가이드 문서</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">12</div>
                                <div className="text-sm text-gray-500">컴포넌트</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 로그아웃 버튼 */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <AuthGuard>
            <DashboardContent />
        </AuthGuard>
    );
}
