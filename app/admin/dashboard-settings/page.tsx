"use client";
import { useState, useEffect } from 'react';
import { AdminKeywordSettings, AdminSettingsResponse } from '@/app/lib/types/dashboard';
import { useAuthStore } from '@/app/lib/authStore';
import { AuthGuard } from '@/app/lib/withAuth';

function DashboardSettingsContent() {
    const { user } = useAuthStore();
    const [settings, setSettings] = useState<AdminKeywordSettings>({
        keywords: [],
        location: '',
        newsCount: 10
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>('');
    const [newKeyword, setNewKeyword] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/dashboard-settings');
            const data: AdminSettingsResponse = await response.json();

            if (data.success && data.data) {
                setSettings(data.data);
            } else {
                setError(data.message || '설정을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('Fetch settings error:', error);
            setError('설정을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
        if (error) setError('');
    };

    const addKeyword = () => {
        if (newKeyword.trim() && !settings.keywords.includes(newKeyword.trim())) {
            setSettings(prev => ({
                ...prev,
                keywords: [...prev.keywords, newKeyword.trim()]
            }));
            setNewKeyword('');
        }
    };

    const removeKeyword = (keywordToRemove: string) => {
        setSettings(prev => ({
            ...prev,
            keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!settings.keywords.length) {
            setError('최소 하나의 키워드를 입력해주세요.');
            return;
        }

        if (!settings.location.trim()) {
            setError('위치를 입력해주세요.');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const response = await fetch('/api/admin/dashboard-settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings)
            });

            const data: AdminSettingsResponse = await response.json();

            if (data.success) {
                alert('설정이 성공적으로 저장되었습니다.');
            } else {
                setError(data.message || '설정 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Save settings error:', error);
            setError('설정 저장 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">설정을 불러오는 중...</p>
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
                            <h1 className="text-3xl font-bold text-gray-900">대시보드 설정</h1>
                            <p className="mt-2 text-gray-600">
                                대시보드에 표시될 뉴스 키워드와 위치를 설정할 수 있습니다.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 설정 폼 */}
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

                        {/* 뉴스 키워드 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                뉴스 키워드 <span className="text-red-500">*</span>
                            </label>
                            <p className="text-sm text-gray-500 mb-4">
                                사용자들이 관심을 가질 만한 뉴스 키워드를 설정하세요.
                            </p>
                            
                            {/* 기존 키워드들 */}
                            {settings.keywords.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {settings.keywords.map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                        >
                                            #{keyword}
                                            <button
                                                type="button"
                                                onClick={() => removeKeyword(keyword)}
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* 키워드 추가 */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newKeyword}
                                    onChange={(e) => setNewKeyword(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="키워드 입력 후 엔터"
                                    disabled={saving}
                                />
                                <button
                                    type="button"
                                    onClick={addKeyword}
                                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    disabled={saving}
                                >
                                    추가
                                </button>
                            </div>
                        </div>

                        {/* 위치 설정 */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                위치 <span className="text-red-500">*</span>
                            </label>
                            <p className="text-sm text-gray-500 mb-2">
                                날씨와 맛집 정보를 제공할 위치를 설정하세요.
                            </p>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={settings.location}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="예: 서울시 강남구"
                                disabled={saving}
                            />
                        </div>

                        {/* 뉴스 개수 */}
                        <div>
                            <label htmlFor="newsCount" className="block text-sm font-medium text-gray-700">
                                뉴스 개수
                            </label>
                            <p className="text-sm text-gray-500 mb-2">
                                대시보드에 표시할 뉴스 개수를 설정하세요. (1-20개)
                            </p>
                            <input
                                type="number"
                                id="newsCount"
                                name="newsCount"
                                min="1"
                                max="20"
                                value={settings.newsCount}
                                onChange={handleInputChange}
                                className="mt-1 block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                disabled={saving}
                            />
                        </div>

                        {/* 설정 설명 */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-blue-800 mb-2">설정 안내</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• 뉴스 키워드는 사용자의 관심사와 함께 뉴스를 필터링하는데 사용됩니다.</li>
                                <li>• 설정한 위치의 날씨와 주변 맛집 정보가 대시보드에 표시됩니다.</li>
                                <li>• 뉴스 개수는 대시보드의 성능과 가독성을 고려하여 설정하세요.</li>
                            </ul>
                        </div>

                        {/* 버튼 */}
                        <div className="flex justify-end space-x-3 pt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        저장 중...
                                    </div>
                                ) : (
                                    '설정 저장'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function DashboardSettingsPage() {
    return (
        <AuthGuard>
            <DashboardSettingsContent />
        </AuthGuard>
    );
}
