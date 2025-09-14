// 보고서 관련 타입 정의

export type ReportType = '주간보고' | '회의록';

export interface ReportThread {
    id: string;
    authorId: string;
    authorName: string;
    authorGrade: '일반직원' | '리더' | '최고관리자';
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface Report {
    id: string;
    title: string;
    type: ReportType;
    authorId: string;
    authorName: string;
    authorGrade: '일반직원' | '리더' | '최고관리자';
    content: string; // 회의록의 경우 단일 콘텐츠
    threads?: ReportThread[]; // 주간보고의 경우 스레드 배열
    createdAt: string;
    updatedAt: string;
}

export interface ReportFormData {
    title: string;
    type: ReportType;
    content: string;
}

export interface ReportResponse {
    success: boolean;
    message: string;
    data?: Report | Report[];
}

export interface ThreadFormData {
    content: string;
}

export interface ThreadResponse {
    success: boolean;
    message: string;
    data?: ReportThread;
}

// 보고서 타입 옵션
export const REPORT_TYPE_OPTIONS = [
    { value: '주간보고', label: '주간보고' },
    { value: '회의록', label: '회의록' }
] as const;
