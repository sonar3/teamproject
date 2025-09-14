"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BlogFormData, BlogResponse, FileUploadResponse, BLOG_SOURCE_OPTIONS, POPULAR_TAGS } from '@/app/lib/types/blog';
import { useAuthStore } from '@/app/lib/authStore';
import { AuthGuard } from '@/app/lib/withAuth';

function CreateBlogContent() {
    const router = useRouter();
    const { user } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState<BlogFormData>({
        title: '',
        content: '',
        excerpt: '',
        source: 'editor',
        tags: [],
        isPublished: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [newTag, setNewTag] = useState('');
    const [uploadingFile, setUploadingFile] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingFile(true);
        setError('');

        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const response = await fetch('/api/blog/upload', {
                method: 'POST',
                body: uploadFormData
            });

            const data: FileUploadResponse = await response.json();

            if (data.success && data.content) {
                setFormData(prev => ({
                    ...prev,
                    source: 'file',
                    content: data.content!,
                    fileName: data.fileName
                }));
                
                // 파일명에서 제목 추출
                if (data.fileName) {
                    const titleFromFile = data.fileName.replace('.md', '');
                    if (!formData.title) {
                        setFormData(prev => ({ ...prev, title: titleFromFile }));
                    }
                }
                
                alert('파일이 성공적으로 업로드되었습니다.');
            } else {
                setError(data.message || '파일 업로드에 실패했습니다.');
            }
        } catch (error) {
            console.error('File upload error:', error);
            setError('파일 업로드 중 오류가 발생했습니다.');
        } finally {
            setUploadingFile(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const addPopularTag = (tag: string) => {
        if (!formData.tags.includes(tag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag]
            }));
        }
    };

    const validateForm = (): boolean => {
        if (!formData.title.trim()) {
            setError('제목을 입력해주세요.');
            return false;
        }
        if (!formData.content.trim()) {
            setError('내용을 입력해주세요.');
            return false;
        }
        if (!formData.excerpt.trim()) {
            setError('요약을 입력해주세요.');
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
            const response = await fetch('/api/blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    authorId: user.id,
                    authorName: user.name,
                    authorGrade: user.grade,
                    fileName: formData.source === 'file' ? formData.fileName : undefined
                })
            });

            const data: BlogResponse = await response.json();

            if (data.success) {
                alert('블로그 포스트가 성공적으로 생성되었습니다.');
                router.push('/blog');
            } else {
                setError(data.message || '생성에 실패했습니다.');
            }
        } catch (error) {
            console.error('Create blog post error:', error);
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
                            <h1 className="text-3xl font-bold text-gray-900">블로그 포스트 작성</h1>
                            <p className="mt-2 text-gray-600">
                                새로운 블로그 포스트를 작성하세요.
                            </p>
                        </div>
                        <Link
                            href="/blog"
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

                        {/* 작성 방식 */}
                        <div>
                            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-3">
                                작성 방식
                            </label>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {BLOG_SOURCE_OPTIONS.map((option) => (
                                    <label key={option.value} className="relative flex cursor-pointer rounded-lg p-4 focus:outline-none">
                                        <input
                                            type="radio"
                                            name="source"
                                            value={option.value}
                                            checked={formData.source === option.value}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <span className={`flex flex-1 rounded-lg border-2 p-4 ${
                                            formData.source === option.value
                                                ? 'border-indigo-600 bg-indigo-50'
                                                : 'border-gray-300'
                                        }`}>
                                            <div className="flex flex-col">
                                                <span className={`block text-sm font-medium ${
                                                    formData.source === option.value ? 'text-indigo-900' : 'text-gray-900'
                                                }`}>
                                                    {option.label}
                                                </span>
                                                <span className={`mt-1 block text-sm ${
                                                    formData.source === option.value ? 'text-indigo-700' : 'text-gray-500'
                                                }`}>
                                                    {option.value === 'editor' 
                                                        ? '에디터에서 직접 작성합니다' 
                                                        : '마크다운 파일(.md)을 업로드합니다'
                                                    }
                                                </span>
                                            </div>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 파일 업로드 */}
                        {formData.source === 'file' && (
                            <div>
                                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                                    마크다운 파일 업로드
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="file" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                <span>파일 선택</span>
                                                <input
                                                    ref={fileInputRef}
                                                    id="file"
                                                    name="file"
                                                    type="file"
                                                    accept=".md"
                                                    onChange={handleFileUpload}
                                                    className="sr-only"
                                                    disabled={uploadingFile}
                                                />
                                            </label>
                                            <p className="pl-1">또는 드래그 앤 드롭</p>
                                        </div>
                                        <p className="text-xs text-gray-500">마크다운 파일(.md) 최대 5MB</p>
                                    </div>
                                </div>
                                {uploadingFile && (
                                    <div className="mt-2 text-center">
                                        <div className="inline-flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            파일 업로드 중...
                                        </div>
                                    </div>
                                )}
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
                                placeholder="블로그 포스트 제목을 입력하세요"
                                disabled={loading}
                            />
                        </div>

                        {/* 요약 */}
                        <div>
                            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                                요약 <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                rows={3}
                                value={formData.excerpt}
                                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="포스트의 요약을 입력하세요"
                                disabled={loading}
                            />
                        </div>

                        {/* 태그 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                태그
                            </label>
                            
                            {/* 기존 태그들 */}
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* 태그 추가 */}
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="태그 입력 후 엔터"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    disabled={loading}
                                >
                                    추가
                                </button>
                            </div>

                            {/* 인기 태그 */}
                            <div>
                                <p className="text-sm text-gray-600 mb-2">인기 태그:</p>
                                <div className="flex flex-wrap gap-2">
                                    {POPULAR_TAGS.map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => addPopularTag(tag)}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                                            disabled={loading || formData.tags.includes(tag)}
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
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
                                    placeholder={formData.source === 'editor' 
                                        ? "마크다운 형식으로 내용을 작성하세요..."
                                        : "파일을 업로드하면 내용이 자동으로 입력됩니다."
                                    }
                                    disabled={loading || formData.source === 'file'}
                                />
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                <p>
                                    <strong>마크다운 지원:</strong> 제목(#), 리스트(-), 굵게(**텍스트**), 기울임(*텍스트*), 코드(`코드`) 등
                                </p>
                            </div>
                        </div>

                        {/* 발행 여부 */}
                        <div className="flex items-center">
                            <input
                                id="isPublished"
                                name="isPublished"
                                type="checkbox"
                                checked={formData.isPublished}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                disabled={loading}
                            />
                            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                                즉시 발행
                            </label>
                        </div>

                        {/* 버튼 */}
                        <div className="flex justify-end space-x-3 pt-6">
                            <Link
                                href="/blog"
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
                                    formData.isPublished ? '발행하기' : '임시저장'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function CreateBlogPage() {
    return (
        <AuthGuard>
            <CreateBlogContent />
        </AuthGuard>
    );
}
