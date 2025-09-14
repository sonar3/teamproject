"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NoticeFormData, NoticeResponse, NOTICE_CATEGORIES } from '@/app/lib/types/notice';

export default function NoticeRegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<NoticeFormData>({
        title: '',
        content: '',
        category: '공지',
        isImportant: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // 폼 데이터 변경 핸들러
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        if (error) setError('');
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 유효성 검사
        if (!formData.title.trim()) {
            setError('제목을 입력해주세요.');
            return;
        }
        
        if (!formData.content.trim()) {
            setError('내용을 입력해주세요.');
            return;
        }
        
        if (formData.title.length > 100) {
            setError('제목은 100자를 초과할 수 없습니다.');
            return;
        }
        
        if (formData.content.length > 5000) {
            setError('내용은 5000자를 초과할 수 없습니다.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/notices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    authorId: 'admin' // 임시로 관리자 ID 설정
                }),
            });

            const data: NoticeResponse = await response.json();

            if (data.success) {
                alert('공지사항이 성공적으로 등록되었습니다.');
                router.push('/notices');
            } else {
                setError(data.message || '공지사항 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('Register notice error:', error);
            setError('공지사항 등록 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="guide-content">
            <div className="page-location">
                <span>공지사항 관리 &gt; 공지사항 등록</span>
            </div>
            
            <div className="guide-box">
                <h2 className="text-2xl font-bold mb-6">공지사항 등록</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 카테고리 */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            카테고리 *
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            {NOTICE_CATEGORIES.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 제목 */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            제목 * (최대 100자)
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="공지사항 제목을 입력하세요"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            maxLength={100}
                            required
                        />
                        <div className="text-right text-sm text-gray-500 mt-1">
                            {formData.title.length}/100
                        </div>
                    </div>

                    {/* 내용 */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                            내용 * (최대 5000자)
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            placeholder="공지사항 내용을 입력하세요"
                            rows={15}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                            maxLength={5000}
                            required
                        />
                        <div className="text-right text-sm text-gray-500 mt-1">
                            {formData.content.length}/5000
                        </div>
                    </div>

                    {/* 중요 공지 여부 */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isImportant"
                            name="isImportant"
                            checked={formData.isImportant}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isImportant" className="ml-2 block text-sm text-gray-700">
                            중요 공지사항으로 설정
                        </label>
                        <span className="ml-2 text-xs text-gray-500">
                            (중요 공지사항은 목록 상단에 고정됩니다)
                        </span>
                    </div>

                    {/* 에러 메시지 */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* 버튼 */}
                    <div className="flex gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '등록 중...' : '등록하기'}
                        </button>
                        <Link
                            href="/notices"
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
                        >
                            취소
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
