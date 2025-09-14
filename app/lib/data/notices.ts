import { Notice } from '@/app/lib/types/notice';

// 임시 데이터 저장소 (실제 환경에서는 데이터베이스 사용)
export let notices: Notice[] = [
    {
        id: "1",
        title: "2024년 연말 휴무 안내",
        content: "안녕하세요.\n\n2024년 연말 휴무 일정을 안내드립니다.\n\n- 휴무일: 2024년 12월 30일(월) ~ 2025년 1월 1일(수)\n- 업무 재개: 2025년 1월 2일(목)\n\n연말 연시 휴무 기간 동안 업무상 긴급한 사항이 있을 경우 담당자에게 연락 바랍니다.\n\n감사합니다.",
        author: "홍길동",
        authorId: "1",
        category: "공지",
        isImportant: true,
        viewCount: 45,
        createdAt: "2024-12-15T09:00:00Z",
        updatedAt: "2024-12-15T09:00:00Z"
    },
    {
        id: "2",
        title: "신규 프로젝트 Fit Team Library 개발 완료",
        content: "신규 프로젝트 'Fit Team Library' 개발이 성공적으로 완료되었습니다.\n\n주요 기능:\n- 직원 관리 시스템\n- 프로젝트 관리\n- 설문조사 기능\n- 대시보드\n\n모든 직원분들의 적극적인 협력과 피드백에 감사드립니다.",
        author: "김철수",
        authorId: "2",
        category: "소식",
        isImportant: false,
        viewCount: 23,
        createdAt: "2024-12-10T14:30:00Z",
        updatedAt: "2024-12-10T14:30:00Z"
    },
    {
        id: "3",
        title: "사내 복지 프로그램 신규 도입",
        content: "직원 복지 향상을 위한 새로운 프로그램을 도입합니다.\n\n신규 복지 프로그램:\n- 헬스케어 프로그램\n- 자기계발 지원금\n- 휴가 제도 개선\n- 유연근무제 확대\n\n자세한 내용은 HR팀으로 문의 바랍니다.",
        author: "이영희",
        authorId: "3",
        category: "소식",
        isImportant: false,
        viewCount: 67,
        createdAt: "2024-12-05T11:15:00Z",
        updatedAt: "2024-12-05T11:15:00Z"
    },
    {
        id: "4",
        title: "보안 정책 업데이트 안내",
        content: "보안 강화를 위한 정책이 업데이트되었습니다.\n\n주요 변경사항:\n- 비밀번호 정책 강화\n- 2단계 인증 도입\n- 정기 보안 교육 실시\n\n모든 직원분들은 새로운 보안 정책을 숙지하고 준수해 주시기 바랍니다.",
        author: "홍길동",
        authorId: "1",
        category: "공지",
        isImportant: true,
        viewCount: 89,
        createdAt: "2024-11-28T16:45:00Z",
        updatedAt: "2024-11-28T16:45:00Z"
    },
    {
        id: "5",
        title: "사내 체육대회 개최 안내",
        content: "2024년 사내 체육대회가 개최됩니다.\n\n일시: 2024년 12월 20일(금) 오후 2시\n장소: 회사 강당 및 운동장\n종목: 축구, 배드민턴, 탁구, 볼링\n\n참가 희망자는 12월 18일까지 신청해 주시기 바랍니다.",
        author: "김철수",
        authorId: "2",
        category: "소식",
        isImportant: false,
        viewCount: 34,
        createdAt: "2024-12-12T10:20:00Z",
        updatedAt: "2024-12-12T10:20:00Z"
    }
];

// 공지사항 추가 함수
export function addNotice(notice: Notice) {
    notices.push(notice);
}

// 공지사항 찾기 함수
export function findNoticeById(id: string): Notice | undefined {
    return notices.find(notice => notice.id === id);
}

// 공지사항 업데이트 함수
export function updateNotice(id: string, updates: Partial<Notice>): Notice | undefined {
    const index = notices.findIndex(notice => notice.id === id);
    if (index !== -1) {
        notices[index] = { ...notices[index], ...updates, updatedAt: new Date().toISOString() };
        return notices[index];
    }
    return undefined;
}

// 공지사항 삭제 함수
export function deleteNotice(id: string): boolean {
    const index = notices.findIndex(notice => notice.id === id);
    if (index !== -1) {
        notices.splice(index, 1);
        return true;
    }
    return false;
}

// 조회수 증가 함수
export function incrementViewCount(id: string): boolean {
    const notice = findNoticeById(id);
    if (notice) {
        notice.viewCount += 1;
        return true;
    }
    return false;
}
