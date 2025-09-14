"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Report, ReportResponse, ReportType } from '@/app/lib/types/report';
import { useAuthStore } from '@/app/lib/authStore';
import { AuthGuard } from '@/app/lib/withAuth';

function ReportsContent() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [typeFilter, setTypeFilter] = useState<ReportType | ''>('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReports();
    }, [typeFilter, searchTerm]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (typeFilter) params.append('type', typeFilter);
            if (searchTerm) params.append('search', searchTerm);

            const response = await fetch(`/api/reports?${params.toString()}`);
            const data: ReportResponse = await response.json();

            if (data.success && Array.isArray(data.data)) {
                setReports(data.data);
            } else {
                setError(data.message || '보고서 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('Fetch reports error:', error);
            setError('보고서 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말로 이 보고서를 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/reports/${id}`, {
                method: 'DELETE'
            });

            const data: ReportResponse = await response.json();

            if (data.success) {
                alert('보고서가 성공적으로 삭제되었습니다.');
                fetchReports();
            } else {
                alert(data.message || '삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Delete report error:', error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">보고서</h1>
                            <p className="mt-2 text-gray-600">
                                주간보고와 회의록을 관리할 수 있습니다.
                            </p>
                        </div>
                        <Link
                            href="/reports/create"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            보고서 작성
                        </Link>
                    </div>
                </div>

                {/* 필터 및 검색 */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="제목, 내용, 작성자로 검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="sm:w-48">
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value as ReportType | '')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">모든 타입</option>
                                <option value="주간보고">주간보고</option>
                                <option value="회의록">회의록</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div className="mb-6 rounded-md bg-red-50 p-4">
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

                {/* 로딩 상태 */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                )}

                {/* 보고서 목록 */}
                {!loading && (
                    <div className="bg-white shadow rounded-lg">
                        {reports.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">보고서가 없습니다</h3>
                                <p className="mt-1 text-sm text-gray-500">새로운 보고서를 작성해보세요.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {reports.map((report) => (
                                    <div key={report.id} className="p-6 hover:bg-gray-50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        report.type === '주간보고' 
                                                            ? 'bg-blue-100 text-blue-800' 
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {report.type}
                                                    </span>
                                                    {report.threads && report.threads.length > 0 && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            댓글 {report.threads.length}개
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                    <Link 
                                                        href={`/reports/${report.id}`}
                                                        className="hover:text-indigo-600"
                                                    >
                                                        {report.title}
                                                    </Link>
                                                </h3>
                                                <p className="text-gray-600 mb-3 line-clamp-2">
                                                    {report.content}
                                                </p>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <span>작성자: {report.authorName} ({report.authorGrade})</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{formatDate(report.createdAt)}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <Link
                                                    href={`/reports/${report.id}`}
                                                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    보기
                                                </Link>
                                                {(user?.grade === '리더' || user?.grade === '최고관리자') && (
                                                    <>
                                                        <Link
                                                            href={`/reports/edit/${report.id}`}
                                                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                        >
                                                            수정
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(report.id)}
                                                            className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                                                        >
                                                            삭제
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ReportsPage() {
    return (
        <AuthGuard>
            <ReportsContent />
        </AuthGuard>
    );
}
