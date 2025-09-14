"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EmployeeFormData, EmployeeResponse, POSITION_OPTIONS, GENDER_OPTIONS, PROJECT_OPTIONS, EMPLOYEE_GRADE_OPTIONS } from '@/app/lib/types/hr';
import { AuthGuard } from '@/app/lib/withAuth';

function RegisterContent() {
    const router = useRouter();
    const [formData, setFormData] = useState<EmployeeFormData>({
        name: '',
        email: '',
        gender: '남',
        position: '',
        project: '',
        startDate: '',
        endDate: '',
        grade: '일반직원'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // 에러 메시지 초기화
        if (error) setError('');
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError('이름을 입력해주세요.');
            return false;
        }
        if (!formData.email.trim()) {
            setError('이메일을 입력해주세요.');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('올바른 이메일 형식을 입력해주세요.');
            return false;
        }
        if (!formData.position) {
            setError('직급을 선택해주세요.');
            return false;
        }
        if (!formData.project) {
            setError('참여프로젝트를 선택해주세요.');
            return false;
        }
        if (!formData.grade) {
            setError('등급을 선택해주세요.');
            return false;
        }
        if (!formData.startDate) {
            setError('투입일을 입력해주세요.');
            return false;
        }
        if (formData.endDate && formData.endDate < formData.startDate) {
            setError('철수일은 투입일보다 늦어야 합니다.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/hr/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data: EmployeeResponse = await response.json();

            if (data.success) {
                alert('직원 정보가 성공적으로 등록되었습니다.');
                router.push('/hr');
            } else {
                setError(data.message || '등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('Register employee error:', error);
            setError('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">직원 등록</h1>
                            <p className="mt-2 text-gray-600">
                                새로운 직원의 정보를 입력해주세요.
                            </p>
                        </div>
                        <Link
                            href="/hr"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            목록으로
                        </Link>
                    </div>
                </div>

                {/* 등록 폼 */}
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

                        {/* 이름 */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                이름 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="직원 이름을 입력하세요"
                                disabled={loading}
                            />
                        </div>

                        {/* 이메일 */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                이메일 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="example@company.com"
                                disabled={loading}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                직원이 로그인할 때 사용할 이메일입니다. 초기 비밀번호는 0000으로 설정됩니다.
                            </p>
                        </div>

                        {/* 성별 */}
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                성별 <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                disabled={loading}
                            >
                                {GENDER_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 직급 */}
                        <div>
                            <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                                직급 <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                disabled={loading}
                            >
                                <option value="">직급을 선택하세요</option>
                                {POSITION_OPTIONS.map((position) => (
                                    <option key={position} value={position}>
                                        {position}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 참여프로젝트 */}
                        <div>
                            <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                                참여프로젝트 <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="project"
                                name="project"
                                value={formData.project}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                disabled={loading}
                            >
                                <option value="">프로젝트를 선택하세요</option>
                                {PROJECT_OPTIONS.map((project) => (
                                    <option key={project} value={project}>
                                        {project}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 등급 */}
                        <div>
                            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                                등급 <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="grade"
                                name="grade"
                                value={formData.grade}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                disabled={loading}
                            >
                                {EMPLOYEE_GRADE_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-sm text-gray-500">
                                등급에 따라 접근 가능한 메뉴가 결정됩니다.
                            </p>
                        </div>

                        {/* 투입일 */}
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                투입일 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                disabled={loading}
                            />
                        </div>

                        {/* 철수일 */}
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                철수일 <span className="text-gray-400">(선택사항)</span>
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                disabled={loading}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                프로젝트에서 철수한 경우에만 입력하세요.
                            </p>
                        </div>

                        {/* 버튼 */}
                        <div className="flex justify-end space-x-3 pt-6">
                            <Link
                                href="/hr"
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
                                        등록 중...
                                    </div>
                                ) : (
                                    '등록'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <AuthGuard>
            <RegisterContent />
        </AuthGuard>
    );
}
