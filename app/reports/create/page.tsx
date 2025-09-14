"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ReportFormData, ReportResponse, REPORT_TYPE_OPTIONS } from '@/app/lib/types/report';
import { useAuthStore } from '@/app/lib/authStore';
import { AuthGuard } from '@/app/lib/withAuth';

function CreateReportContent() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [formData, setFormData] = useState<ReportFormData>({
        title: '',
        type: '주간보고',
        content: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({
            ...prev,
            content
        }));
        if (error) setError('');
    };

    const validateForm = (): boolean => {
        if (!formData.title.trim()) {
            setError('제목을 입력해주세요.');
            return false;
        }
        if (!formData.type) {
            setError('보고서 타입을 선택해주세요.');
            return false;
        }
        if (!formData.content.trim()) {
            setError('내용을 입력해주세요.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        if (!user) {
            setError('사용자 정보를 찾을 수 없습니다.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    authorId: user.id,
                    authorName: user.name,
                    authorGrade: user.grade
                })
            });

            const data: ReportResponse = await response.json();

            if (data.success) {
                alert('보고서가 성공적으로 생성되었습니다.');
                router.push('/reports');
            } else {
                setError(data.message || '생성에 실패했습니다.');
            }
        } catch (error) {
            console.error('Create report error:', error);
            setError('생성 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">보고서 작성</h1>
                            <p className="mt-2 text-gray-600">
                                새로운 보고서를 작성하세요.
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

                {/* 작성 폼 */}
                <div className="bg-white shadow rounded-lg">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

                        {/* 제목 */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                제목 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="보고서 제목을 입력하세요"
                                disabled={loading}
                            />
                        </div>

                        {/* 보고서 타입 */}
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                보고서 타입 <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                disabled={loading}
                            >
                                {REPORT_TYPE_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-sm text-gray-500">
                                주간보고는 스레드 형태로 작성되며, 회의록은 단일 문서로 작성됩니다.
                            </p>
                        </div>

                        {/* 내용 */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                내용 <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="content"
                                    name="content"
                                    rows={15}
                                    value={formData.content}
                                    onChange={(e) => handleContentChange(e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder={formData.type === '주간보고' 
                                        ? "주간보고의 초기 내용을 입력하세요. 다른 팀원들이 스레드로 추가 의견을 달 수 있습니다."
                                        : "회의록 내용을 입력하세요. 마크다운 형식을 사용할 수 있습니다."
                                    }
                                    disabled={loading}
                                />
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                <p className="mb-1">
                                    <strong>마크다운 지원:</strong> 제목(#), 리스트(-), 굵게(**텍스트**), 기울임(*텍스트*) 등
                                </p>
                                {formData.type === '주간보고' && (
                                    <p>주간보고의 경우 다른 팀원들이 댓글 형태로 추가 의견을 달 수 있습니다.</p>
                                )}
                            </div>
                        </div>

                        {/* 버튼 */}
                        <div className="flex justify-end space-x-3 pt-6">
                            <Link
                                href="/reports"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                취소
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        생성 중...
                                    </div>
                                ) : (
                                    '보고서 생성'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function CreateReportPage() {
    return (
        <AuthGuard>
            <CreateReportContent />
        </AuthGuard>
    );
}
