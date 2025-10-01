// 블로그 관련 타입 정의

export type BlogSource = 'editor' | 'file'; // 에디터 작성 또는 파일 업로드

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    excerpt: string; // 요약
    authorId: string;
    authorName: string;
    authorGrade: '일반직원' | '리더' | '최고관리자';
    source: BlogSource; // 작성 방식
    fileName?: string; // 파일 업로드인 경우 파일명
    tags: string[]; // 태그
    isPublished: boolean; // 발행 여부
    viewCount: number; // 조회수
    createdAt: string;
    updatedAt: string;
    publishedAt?: string; // 발행일
}

export interface BlogFormData {
    title: string;
    content: string;
    excerpt: string;
    source: BlogSource;
    fileName?: string;
    tags: string[];
    isPublished: boolean;
}

export interface BlogResponse {
    success: boolean;
    message: string;
    data?: BlogPost | BlogPost[];
}

export interface FileUploadResponse {
    success: boolean;
    message: string;
    fileName?: string;
    content?: string;
}

// 블로그 소스 옵션
export const BLOG_SOURCE_OPTIONS = [
    { value: 'editor', label: '에디터 작성' },
    { value: 'file', label: '파일 업로드' }
] as const;

// 인기 태그들
export const POPULAR_TAGS = [
    '개발',
    '기술',
    '프로젝트',
    '회고',
    '학습',
    '소통',
    '업무',
    '리더십',
    '팀워크',
    '일상'
] as const;
