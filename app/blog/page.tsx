"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BlogPost, BlogResponse } from '@/app/lib/types/blog';
import { useAuthStore } from '@/app/lib/authStore';
import { AuthGuard } from '@/app/lib/withAuth';

function BlogContent() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [tagFilter, setTagFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDrafts, setShowDrafts] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [tagFilter, searchTerm, showDrafts]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (tagFilter) params.append('tag', tagFilter);
            if (searchTerm) params.append('search', searchTerm);
            params.append('published', showDrafts ? 'false' : 'true');

            const response = await fetch(`/api/blog?${params.toString()}`);
            const data: BlogResponse = await response.json();

            if (data.success && Array.isArray(data.data)) {
                setPosts(data.data);
            } else {
                setError(data.message || '블로그 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('Fetch posts error:', error);
            setError('블로그 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말로 이 블로그 포스트를 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/blog/${id}`, {
                method: 'DELETE'
            });

            const data: BlogResponse = await response.json();

            if (data.success) {
                alert('블로그 포스트가 성공적으로 삭제되었습니다.');
                fetchPosts();
            } else {
                alert(data.message || '삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Delete post error:', error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderTags = (tags: string[]) => {
        return tags.map((tag, index) => (
            <span
                key={index}
                onClick={() => setTagFilter(tag)}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
            >
                #{tag}
            </span>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">블로그</h1>
                            <p className="mt-2 text-gray-600">
                                팀원들의 다양한 이야기를 만나보세요.
                            </p>
                        </div>
                        <Link
                            href="/blog/create"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            포스트 작성
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
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTagFilter('')}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    tagFilter === '' 
                                        ? 'bg-indigo-100 text-indigo-800' 
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                            >
                                전체
                            </button>
                            {(user?.grade === '리더' || user?.grade === '최고관리자') && (
                                <button
                                    onClick={() => setShowDrafts(!showDrafts)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                                        showDrafts 
                                            ? 'bg-yellow-100 text-yellow-800' 
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                >
                                    {showDrafts ? '발행된 포스트' : '임시저장'}
                                </button>
                            )}
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

                {/* 블로그 목록 */}
                {!loading && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">블로그 포스트가 없습니다</h3>
                                <p className="mt-1 text-sm text-gray-500">새로운 포스트를 작성해보세요.</p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                post.source === 'editor' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-purple-100 text-purple-800'
                                            }`}>
                                                {post.source === 'editor' ? '에디터' : '파일'}
                                            </span>
                                            {!post.isPublished && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    임시저장
                                                </span>
                                            )}
                                        </div>
                                        
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                            <Link 
                                                href={`/blog/${post.id}`}
                                                className="hover:text-indigo-600"
                                            >
                                                {post.title}
                                            </Link>
                                        </h3>
                                        
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {renderTags(post.tags)}
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center gap-4">
                                                <span>{post.authorName}</span>
                                                <span>•</span>
                                                <span>{formatDate(post.createdAt)}</span>
                                                <span>•</span>
                                                <span>조회 {post.viewCount}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/blog/${post.id}`}
                                                    className="text-indigo-600 hover:text-indigo-800"
                                                >
                                                    보기
                                                </Link>
                                                {(user?.grade === '리더' || user?.grade === '최고관리자') && (
                                                    <>
                                                        <Link
                                                            href={`/blog/edit/${post.id}`}
                                                            className="text-gray-600 hover:text-gray-800"
                                                        >
                                                            수정
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(post.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            삭제
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function BlogPage() {
    return (
        <AuthGuard>
            <BlogContent />
        </AuthGuard>
    );
}
