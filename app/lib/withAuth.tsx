"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, checkAuthStatus } from './authStore';

interface WithAuthProps {
    children: React.ReactNode;
}

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
    return function AuthenticatedComponent(props: P) {
        const { isAuthenticated, user } = useAuthStore();
        const router = useRouter();

        useEffect(() => {
            // 클라이언트 사이드에서 인증 상태 확인
            const isAuth = checkAuthStatus();
            
            if (!isAuth) {
                router.push('/admin/login');
            }
        }, [router]);

        // 인증되지 않은 경우 로딩 표시
        if (!isAuthenticated) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600">인증 확인 중...</p>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
}

// 인증이 필요한 페이지를 감싸는 컴포넌트
export function AuthGuard({ children }: WithAuthProps) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        const isAuth = checkAuthStatus();
        
        if (!isAuth) {
            router.push('/admin/login');
        }
    }, [router]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">인증 확인 중...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
