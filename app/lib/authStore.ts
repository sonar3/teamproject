import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    name: string;
    role?: string;
    grade?: '일반직원' | '리더' | '최고관리자';
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    clearAuth: () => void;
    hasPermission: (requiredGrade?: '일반직원' | '리더' | '최고관리자') => boolean;
    isLeaderOrAbove: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email: string, password: string) => {
                set({ isLoading: true });
                
                try {
                    // 실제 API 호출은 로그인 페이지에서 처리하고 여기서는 상태만 관리
                    // API 호출 로직은 로그인 컴포넌트에서 처리
                    return true;
                } catch (error) {
                    console.error('Login error:', error);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
                // localStorage에서도 제거
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userInfo');
                }
            },

            setUser: (user: User) => {
                set({ user, isAuthenticated: true });
            },

            setToken: (token: string) => {
                set({ token });
            },

            clearAuth: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            hasPermission: (requiredGrade?: '일반직원' | '리더' | '최고관리자') => {
                const { user } = get();
                if (!user || !user.grade) return false;
                
                // 최고관리자는 모든 권한 허용
                if (user.grade === '최고관리자') return true;
                
                if (!requiredGrade) return true; // 등급 요구사항이 없으면 모든 사용자 허용
                
                const gradeOrder = { '일반직원': 1, '리더': 2, '최고관리자': 3 };
                const userGradeLevel = gradeOrder[user.grade];
                const requiredGradeLevel = gradeOrder[requiredGrade];
                
                return userGradeLevel >= requiredGradeLevel;
            },

            isLeaderOrAbove: () => {
                const { user } = get();
                if (!user || !user.grade) return false;
                return user.grade === '리더' || user.grade === '최고관리자';
            },
        }),
        {
            name: 'auth-storage', // localStorage key
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

// 인증 상태 확인을 위한 헬퍼 함수
export const checkAuthStatus = () => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('userInfo');
    
    if (token && userInfo) {
        try {
            const user = JSON.parse(userInfo);
            useAuthStore.getState().setUser(user);
            useAuthStore.getState().setToken(token);
            return true;
        } catch (error) {
            console.error('Error parsing user info:', error);
            useAuthStore.getState().clearAuth();
            return false;
        }
    }
    
    return false;
};
