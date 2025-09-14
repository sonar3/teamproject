"use client";
import { useState, useEffect } from 'react';
import { DashboardData, DashboardResponse, NewsItem, WeatherInfo, Restaurant, VacationEmployee, BirthdayEmployee } from '@/app/lib/types/dashboard';
import { useAuthStore } from '@/app/lib/authStore';
import { AuthGuard } from '@/app/lib/withAuth';
import Link from 'next/link';

function DashboardContent() {
    const { user } = useAuthStore();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // 사용자 관심사는 설문조사 데이터에서 가져옴 (임시로 하드코딩)
            const userInterests = ['AI', '기술', '비즈니스'];
            const params = new URLSearchParams({
                userId: user?.id || '',
                interests: userInterests.join(',')
            });

            const response = await fetch(`/api/dashboard?${params.toString()}`);
            const data: DashboardResponse = await response.json();

            if (data.success && data.data) {
                setDashboardData(data.data);
            } else {
                setError(data.message || '대시보드 데이터를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('Fetch dashboard data error:', error);
            setError('대시보드 데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">대시보드를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error || !dashboardData) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">오류 발생</h3>
                            <p className="mt-1 text-gray-500">{error || '대시보드 데이터를 불러올 수 없습니다.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* 헤더 */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
                    <p className="mt-2 text-gray-600">
                        안녕하세요, {user?.name}님! 오늘도 좋은 하루 되세요.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* 왼쪽 컬럼 */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 뉴스 섹션 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">관심 뉴스</h2>
                                <p className="text-sm text-gray-500">
                                    관심사와 관리자 키워드 기반 뉴스
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {dashboardData.news.map((news) => (
                                        <div key={news.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                            {news.imageUrl && (
                                                <img
                                                    src={news.imageUrl}
                                                    alt={news.title}
                                                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                                                    <a 
                                                        href={news.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="hover:text-indigo-600"
                                                    >
                                                        {news.title}
                                                    </a>
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                    {news.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>{news.source}</span>
                                                    <span>•</span>
                                                    <span>{formatTime(news.publishedAt)}</span>
                                                    <div className="flex gap-1">
                                                        {news.keywords.map((keyword, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                                                            >
                                                                #{keyword}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 맛집 추천 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">주변 맛집</h2>
                                <p className="text-sm text-gray-500">
                                    {dashboardData.weather.location} 근처 추천 맛집
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {dashboardData.restaurants.map((restaurant) => (
                                        <div key={restaurant.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex gap-3">
                                                {restaurant.imageUrl && (
                                                    <img
                                                        src={restaurant.imageUrl}
                                                        alt={restaurant.name}
                                                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900 mb-1">
                                                        {restaurant.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {restaurant.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                                                            {restaurant.category}
                                                        </span>
                                                        <span>⭐ {restaurant.rating}</span>
                                                        <span>•</span>
                                                        <span>{restaurant.distance}</span>
                                                        <span>•</span>
                                                        <span>{restaurant.priceRange}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 오른쪽 컬럼 */}
                    <div className="space-y-6">
                        {/* 날씨 정보 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">날씨</h2>
                                <p className="text-sm text-gray-500">{dashboardData.weather.location}</p>
                            </div>
                            <div className="p-6">
                                <div className="text-center">
                                    <div className="text-4xl mb-2">{dashboardData.weather.icon}</div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">
                                        {dashboardData.weather.temperature}°C
                                    </div>
                                    <div className="text-lg text-gray-600 mb-4">
                                        {dashboardData.weather.condition}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {dashboardData.weather.description}
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">습도</span>
                                            <div className="font-medium">{dashboardData.weather.humidity}%</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">풍속</span>
                                            <div className="font-medium">{dashboardData.weather.windSpeed}m/s</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 휴가자 정보 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">휴가자</h2>
                                <p className="text-sm text-gray-500">오늘 휴가 중인 팀원</p>
                            </div>
                            <div className="p-6">
                                {dashboardData.vacationEmployees.length > 0 ? (
                                    <div className="space-y-3">
                                        {dashboardData.vacationEmployees.map((employee) => (
                                            <div key={employee.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                                <div>
                                                    <div className="font-medium text-gray-900">{employee.name}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {formatDate(employee.startDate)} - {formatDate(employee.endDate)}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500">{employee.type}</div>
                                                    <div className="text-xs text-gray-600">{employee.reason}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        휴가 중인 팀원이 없습니다.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 생일자 정보 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">생일자</h2>
                                <p className="text-sm text-gray-500">오늘 생일인 팀원</p>
                            </div>
                            <div className="p-6">
                                {dashboardData.birthdayEmployees.length > 0 ? (
                                    <div className="space-y-3">
                                        {dashboardData.birthdayEmployees.map((employee) => (
                                            <div key={employee.id} className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                                                {employee.profileImage && (
                                                    <img
                                                        src={employee.profileImage}
                                                        alt={employee.name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{employee.name}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {employee.position} • {employee.age}세
                                                    </div>
                                                </div>
                                                <div className="text-2xl">🎉</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        오늘 생일인 팀원이 없습니다.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 빠른 링크 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">빠른 링크</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/reports"
                                        className="p-3 text-center border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="text-2xl mb-1">📊</div>
                                        <div className="text-sm font-medium">보고서</div>
                                    </Link>
                                    <Link
                                        href="/blog"
                                        className="p-3 text-center border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="text-2xl mb-1">📝</div>
                                        <div className="text-sm font-medium">블로그</div>
                                    </Link>
                                    <Link
                                        href="/vacation"
                                        className="p-3 text-center border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="text-2xl mb-1">🏖️</div>
                                        <div className="text-sm font-medium">휴가</div>
                                    </Link>
                                    <Link
                                        href="/notices"
                                        className="p-3 text-center border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="text-2xl mb-1">📢</div>
                                        <div className="text-sm font-medium">공지사항</div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <AuthGuard>
            <DashboardContent />
        </AuthGuard>
    );
}
