"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Notice, NoticeResponse } from '@/app/lib/types/notice';

export default function NoticeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [notice, setNotice] = useState<Notice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/notices/${params.id}`);
                const data: NoticeResponse = await response.json();

                if (data.success && data.data && !Array.isArray(data.data)) {
                    setNotice(data.data as Notice);
                } else {
                    setError(data.message || '공지사항을 찾을 수 없습니다.');
                }
            } catch (error) {
                console.error('Fetch notice error:', error);
                setError('공지사항을 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchNotice();
        }
    }, [params.id]);

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

    if (error || !notice) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
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
                    <div className="mt-6 text-center">
                        <Link
                            href="/notices"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            목록으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/notices"
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            목록으로
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            홈으로
                        </Link>
                    </div>
                </div>

                {/* 공지사항 상세 */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    {/* 헤더 정보 */}
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
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
                                <h1 className="text-2xl font-bold text-gray-900">{notice.title}</h1>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-gray-500 space-x-6">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                작성자: {notice.author}
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                작성일: {new Date(notice.createdAt).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                조회수: {notice.viewCount}
                            </div>
                        </div>
                    </div>

                    {/* 내용 */}
                    <div className="px-4 py-5 sm:px-6">
                        <div className="prose max-w-none">
                            <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                                {notice.content}
                            </div>
                        </div>
                    </div>

                    {/* 하단 정보 */}
                    <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>
                                수정일: {new Date(notice.updatedAt).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className="mt-8 flex justify-center space-x-4">
                    <Link
                        href="/notices"
                        className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        목록으로
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        홈으로
                    </Link>
                </div>
            </div>
        </div>
    );
}
