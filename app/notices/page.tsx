"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Notice, NoticeResponse, NOTICE_CATEGORIES } from '@/app/lib/types/notice';

export default function NoticesPage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 공지사항 목록 조회
    const fetchNotices = async (page = 1, category = '', search = '') => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(category && { category }),
                ...(search && { search })
            });

            const response = await fetch(`/api/notices?${params}`);
            const data: NoticeResponse = await response.json();

            if (data.success && Array.isArray(data.data)) {
                setNotices(data.data);
                if (data.pagination) {
                    setTotalPages(data.pagination.totalPages);
                }
            } else {
                setError(data.message || '공지사항 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('Fetch notices error:', error);
            setError('공지사항 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 검색 처리
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchNotices(1, selectedCategory, searchTerm);
    };

    // 카테고리 변경
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        fetchNotices(1, category, searchTerm);
    };

    // 페이지 변경
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchNotices(page, selectedCategory, searchTerm);
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">공지사항을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">공지 및 소식</h1>
                            <p className="mt-2 text-gray-600">
                                회사의 중요한 공지사항과 소식을 확인하세요.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/notices/register"
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                공지사항 등록
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                홈으로
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 검색 및 필터 */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="p-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="제목, 내용, 작성자로 검색..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                검색
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('');
                                    setCurrentPage(1);
                                    fetchNotices(1, '', '');
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                초기화
                            </button>
                        </form>

                        {/* 카테고리 필터 */}
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => handleCategoryChange('')}
                                className={`px-3 py-1 text-sm rounded-full ${
                                    selectedCategory === '' 
                                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                전체
                            </button>
                            {NOTICE_CATEGORIES.map((category) => (
                                <button
                                    key={category.value}
                                    onClick={() => handleCategoryChange(category.value)}
                                    className={`px-3 py-1 text-sm rounded-full ${
                                        selectedCategory === category.value 
                                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {category.label}
                                </button>
                            ))}
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

                {/* 공지사항 목록 */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            공지사항 목록 ({notices.length}건)
                        </h3>
                    </div>
                    
                    {notices.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">공지사항이 없습니다</h3>
                            <p className="mt-1 text-sm text-gray-500">검색 조건을 변경해보세요.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {notices.map((notice) => (
                                <li key={notice.id}>
                                    <Link
                                        href={`/notices/${notice.id}`}
                                        className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        notice.category === '공지' 
                                                            ? 'bg-red-100 text-red-800' 
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {notice.category}
                                                    </span>
                                                    {notice.isImportant && (
                                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            중요
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-gray-900 truncate">
                                                    {notice.title}
                                                </p>
                                                <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                                                    <span>{notice.author}</span>
                                                    <span>{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</span>
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        {notice.viewCount}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                이전
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        page === currentPage
                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                다음
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}
