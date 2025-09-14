"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { BlogPost, BlogResponse } from '@/app/lib/types/blog';
import { useAuthStore } from '@/app/lib/authStore';
import { AuthGuard } from '@/app/lib/withAuth';

function BlogDetailContent() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthStore();
    const id = params.id as string;

    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/blog/${id}`);
            const data: BlogResponse = await response.json();

            if (data.success && data.data && !Array.isArray(data.data)) {
                setPost(data.data as BlogPost);
            } else {
                setError(data.message || '블로그 포스트를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('Fetch post error:', error);
            setError('블로그 포스트를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
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
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-8 first:mt-0">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 mt-6">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3 mt-4">$1</h3>')
            .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-bold mb-2 mt-3">$1</h4>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
            .replace(/`(.*?)`/gim, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
            .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono">$1</code></pre>')
            .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
            .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
            .replace(/\n\n/g, '</p><p class="mb-4">')
            .replace(/\n/g, '<br>');
    };

    const renderTags = (tags: string[]) => {
        return tags.map((tag, index) => (
            <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
                #{tag}
            </span>
        ));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">블로그 포스트를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">오류 발생</h3>
                            <p className="mt-1 text-gray-500">{error || '블로그 포스트를 찾을 수 없습니다.'}</p>
                            <div className="mt-6">
                                <Link
                                    href="/blog"
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
                        <Link
                            href="/blog"
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            블로그 목록으로
                        </Link>
                        {(user?.grade === '리더' || user?.grade === '최고관리자') && (
                            <div className="flex gap-2">
                                <Link
                                    href={`/blog/edit/${id}`}
                                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    수정
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* 포스트 헤더 */}
                <div className="bg-white shadow rounded-lg p-8 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            post.source === 'editor' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-purple-100 text-purple-800'
                        }`}>
                            {post.source === 'editor' ? '에디터 작성' : '파일 업로드'}
                        </span>
                        {post.fileName && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                {post.fileName}
                            </span>
                        )}
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                    
                    <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                        {renderTags(post.tags)}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                        <div className="flex items-center gap-4">
                            <span className="font-medium">{post.authorName}</span>
                            <span>({post.authorGrade})</span>
                            <span>•</span>
                            <span>{formatDate(post.createdAt)}</span>
                            {post.publishedAt && post.publishedAt !== post.createdAt && (
                                <>
                                    <span>•</span>
                                    <span>발행: {formatDate(post.publishedAt)}</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <span>조회 {post.viewCount}</span>
                        </div>
                    </div>
                </div>

                {/* 포스트 내용 */}
                <div className="bg-white shadow rounded-lg p-8">
                    <div 
                        className="prose max-w-none prose-lg"
                        dangerouslySetInnerHTML={{ 
                            __html: `<div class="prose-content">${renderMarkdown(post.content)}</div>` 
                        }}
                    />
                </div>

                {/* 네비게이션 */}
                <div className="mt-8 flex justify-between">
                    <Link
                        href="/blog"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        목록으로
                    </Link>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            맨 위로
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BlogDetailPage() {
    return (
        <AuthGuard>
            <BlogDetailContent />
        </AuthGuard>
    );
}
