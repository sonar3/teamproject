"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Employee, EmployeeResponse } from '@/app/lib/types/hr';
import { AuthGuard } from '@/app/lib/withAuth';

function HRListContent() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 직원 목록 조회
    const fetchEmployees = async (page = 1, search = '') => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(search && { search })
            });

            const response = await fetch(`/api/hr/employees?${params}`);
            const data: EmployeeResponse = await response.json();

            if (data.success && Array.isArray(data.data)) {
                setEmployees(data.data);
                // 실제 환경에서는 API에서 총 페이지 수를 받아와야 함
                setTotalPages(Math.ceil(data.data.length / 10));
            } else {
                setError(data.message || '직원 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('Fetch employees error:', error);
            setError('직원 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 직원 삭제
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`정말로 ${name} 직원의 정보를 삭제하시겠습니까?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/hr/employees/${id}`, {
                method: 'DELETE'
            });
            const data: EmployeeResponse = await response.json();

            if (data.success) {
                alert('직원 정보가 삭제되었습니다.');
                fetchEmployees(currentPage, searchTerm);
            } else {
                alert(data.message || '삭제 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Delete employee error:', error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    // 검색 처리
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchEmployees(1, searchTerm);
    };

    // 페이지 변경
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchEmployees(page, searchTerm);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">직원 목록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">인사정보 관리</h1>
                            <p className="mt-2 text-gray-600">
                                직원 정보를 조회, 등록, 수정, 삭제할 수 있습니다.
                            </p>
                        </div>
                        <Link
                            href="/hr/register"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            직원 등록
                        </Link>
                    </div>
                </div>

                {/* 검색 및 필터 */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="p-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="이름, 이메일, 직급, 프로젝트로 검색..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                검색
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm('');
                                    setCurrentPage(1);
                                    fetchEmployees(1, '');
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                초기화
                            </button>
                        </form>
                    </div>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
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

                {/* 직원 목록 테이블 */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            직원 목록 ({employees.length}명)
                        </h3>
                    </div>
                    
                    {employees.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">직원이 없습니다</h3>
                            <p className="mt-1 text-sm text-gray-500">새로운 직원을 등록해보세요.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            이름
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            이메일
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            성별
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            직급
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            참여프로젝트
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            투입일
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            철수일
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            상태
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            관리
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {employees.map((employee) => (
                                        <tr key={employee.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {employee.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.gender}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.position}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.project}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(employee.startDate).toLocaleDateString('ko-KR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.endDate ? new Date(employee.endDate).toLocaleDateString('ko-KR') : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    employee.endDate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {employee.endDate ? '철수' : '활성'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={`/hr/edit/${employee.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        수정
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(employee.id, employee.name)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                이전
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        page === currentPage
                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                다음
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function HRListPage() {
    return (
        <AuthGuard>
            <HRListContent />
        </AuthGuard>
    );
}
