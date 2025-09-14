"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Report, ReportResponse, ThreadFormData, ThreadResponse, ReportThread } from '@/app/lib/types/report';
import { useAuthStore } from '@/app/lib/authStore';
import { AuthGuard } from '@/app/lib/withAuth';

function ReportDetailContent() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthStore();
    const id = params.id as string;

    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [threadContent, setThreadContent] = useState('');
    const [threadLoading, setThreadLoading] = useState(false);

    useEffect(() => {
        fetchReport();
    }, [id]);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/reports/${id}`);
            const data: ReportResponse = await response.json();

            if (data.success && data.data && !Array.isArray(data.data)) {
                setReport(data.data as Report);
            } else {
                setError(data.message || '보고서를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('Fetch report error:', error);
            setError('보고서를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddThread = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!threadContent.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }
        
        if (!user) {
            alert('사용자 정보를 찾을 수 없습니다.');
            return;
        }

        setThreadLoading(true);

        try {
            const response = await fetch(`/api/reports/${id}/threads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: threadContent,
                    authorId: user.id,
                    authorName: user.name,
                    authorGrade: user.grade
                })
            });

            const data: ThreadResponse = await response.json();

            if (data.success) {
                setThreadContent('');
                fetchReport(); // 보고서 다시 로드
                alert('스레드가 성공적으로 추가되었습니다.');
            } else {
                alert(data.message || '스레드 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error('Add thread error:', error);
            alert('스레드 추가 중 오류가 발생했습니다.');
        } finally {
            setThreadLoading(false);
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

    const renderMarkdown = (content: string) => {
        return content
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mb-2">$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
            .replace(/\n/g, '<br>');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">보고서를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">오류 발생</h3>
                            <p className="mt-1 text-gray-500">{error || '보고서를 찾을 수 없습니다.'}</p>
                            <div className="mt-6">
                                <Link
                                    href="/reports"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    목록으로 돌아가기
                                </Link>
                            </div>
                        </div>
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
                        <div>
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
                            <h1 className="text-3xl font-bold text-gray-900">{report.title}</h1>
                            <p className="mt-2 text-gray-600">
                                작성자: {report.authorName} ({report.authorGrade}) • {formatDate(report.createdAt)}
                            </p>
                        </div>
                        <Link
                            href="/reports"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            목록으로
                        </Link>
                    </div>
                </div>

                {/* 메인 내용 */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(report.content) }}
                    />
                </div>

                {/* 스레드 섹션 (주간보고인 경우만) */}
                {report.type === '주간보고' && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">스레드</h2>
                        
                        {/* 기존 스레드들 */}
                        {report.threads && report.threads.length > 0 ? (
                            <div className="space-y-4 mb-6">
                                {report.threads.map((thread) => (
                                    <div key={thread.id} className="border-l-4 border-indigo-200 pl-4 py-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-medium text-gray-900">{thread.authorName}</span>
                                            <span className="text-sm text-gray-500">({thread.authorGrade})</span>
                                            <span className="text-sm text-gray-400">•</span>
                                            <span className="text-sm text-gray-500">{formatDate(thread.createdAt)}</span>
                                        </div>
                                        <p className="text-gray-700">{thread.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 mb-6">
                                <p className="text-gray-500">아직 스레드가 없습니다. 첫 번째 의견을 남겨보세요.</p>
                            </div>
                        )}

                        {/* 스레드 작성 폼 */}
                        <form onSubmit={handleAddThread} className="border-t pt-6">
                            <div className="mb-4">
                                <label htmlFor="threadContent" className="block text-sm font-medium text-gray-700 mb-2">
                                    의견 추가
                                </label>
                                <textarea
                                    id="threadContent"
                                    rows={4}
                                    value={threadContent}
                                    onChange={(e) => setThreadContent(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="의견이나 추가 정보를 입력하세요..."
                                    disabled={threadLoading}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={threadLoading || !threadContent.trim()}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {threadLoading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            추가 중...
                                        </div>
                                    ) : (
                                        '의견 추가'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ReportDetailPage() {
    return (
        <AuthGuard>
            <ReportDetailContent />
        </AuthGuard>
    );
}
