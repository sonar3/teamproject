// 공지사항 관련 타입 정의

export interface Notice {
    id: string;
    title: string;
    content: string;
    author: string;
    authorId: string;
    category: '공지' | '소식';
    isImportant: boolean; // 중요 공지 여부
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface NoticeFormData {
    title: string;
    content: string;
    category: '공지' | '소식';
    isImportant: boolean;
}

export interface NoticeResponse {
    success: boolean;
    message: string;
    data?: Notice | Notice[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// 공지사항 카테고리 옵션
export const NOTICE_CATEGORIES = [
    { value: '공지', label: '공지사항' },
    { value: '소식', label: '회사 소식' }
] as const;
