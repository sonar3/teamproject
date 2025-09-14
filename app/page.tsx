"use client";
import Link from "next/link";
import { useAuthStore, checkAuthStatus } from "@/app/lib/authStore";
import { useEffect } from "react";

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full" style={{ gap: '20px', height: '100vh' }}>
        {/* 인증 상태 표시 */}
        {isAuthenticated && user && (
          <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p className="text-center">
              안녕하세요, <strong>{user.name}</strong>님! 로그인되었습니다.
            </p>
          </div>
        )}
        
        {/* 메인 메뉴 */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 공지 및 소식 */}
          <Link 
            href="/notices" 
            className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            공지 및 소식
          </Link>
          
          {/* 관리자 로그인 링크 */}
          <div>
            {isAuthenticated ? (
              <Link 
                href="/admin/dashboard" 
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                관리자 대시보드
              </Link>
            ) : (
              <Link 
                href="/admin/login" 
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                관리자 로그인
              </Link>
            )}
          </div>
          
          {/* 일반 직원 로그인 링크 */}
          <div>
            <Link 
              href="/employee/login" 
              className="inline-flex items-center justify-center px-6 py-4 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              일반 직원 로그인
            </Link>
          </div>
        </div>
        
        {/* 안내 메시지 */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>일반 직원은 이메일과 초기 비밀번호(0000)로 로그인하세요.</p>
        </div>
        
        {/* 디버그 링크 */}
        <div className="mt-4 text-center">
          <Link 
            href="/debug" 
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            디버그 페이지
          </Link>
        </div>
    </div>
  );
}
