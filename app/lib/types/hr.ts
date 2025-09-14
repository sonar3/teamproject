// 인사정보 관련 타입 정의

// 직원 등급 타입
export type EmployeeGrade = '일반직원' | '리더' | '최고관리자';

// 직원 등급 옵션
export const EMPLOYEE_GRADE_OPTIONS = [
    { value: '일반직원', label: '일반직원' },
    { value: '리더', label: '리더' },
    { value: '최고관리자', label: '최고관리자' }
] as const;

export interface Employee {
    id: string;
    name: string;
    email: string; // 이메일
    password?: string; // 비밀번호 (필요시에만 포함)
    gender: '남' | '여';
    position: string; // 직급
    project: string; // 참여프로젝트
    startDate: string; // 투입일
    endDate?: string; // 철수일 (선택사항)
    grade: EmployeeGrade; // 등급 (일반직원, 리더, 최고관리자)
    isFirstLogin?: boolean; // 첫 로그인 여부
    surveyData?: SurveyData; // 설문조사 데이터
    createdAt: string;
    updatedAt: string;
}

export interface EmployeeFormData {
    name: string;
    email: string; // 이메일
    gender: '남' | '여';
    position: string;
    project: string;
    startDate: string;
    endDate?: string;
    grade: EmployeeGrade;
}

export interface EmployeeResponse {
    success: boolean;
    message: string;
    data?: Employee | Employee[];
}

// 직급 옵션
export const POSITION_OPTIONS = [
    '대표이사',
    '부사장',
    '상무',
    '이사',
    '부장',
    '차장',
    '과장',
    '대리',
    '주임',
    '사원',
    '인턴'
] as const;

// 성별 옵션
export const GENDER_OPTIONS = [
    { value: '남', label: '남' },
    { value: '여', label: '여' }
] as const;

// 프로젝트 옵션 (실제 환경에서는 API에서 가져와야 함)
export const PROJECT_OPTIONS = [
    'Fit Team Library',
    '이양사무소',
    '대국민포털관리',
    '신규 프로젝트 A',
    '신규 프로젝트 B',
    '유지보수 프로젝트'
] as const;

// 직원 로그인 관련 타입
export interface EmployeeLoginData {
    email: string;
    password: string;
}

export interface EmployeeLoginResponse {
    success: boolean;
    message: string;
    data?: {
        employee: Employee;
        token?: string;
        isFirstLogin?: boolean;
    };
}

// 설문조사 관련 타입
export interface SurveyData {
    favoriteFoods: string[]; // 체크박스로 여러 개 선택 가능
    interests: string[]; // 체크박스로 여러 개 선택 가능
}

export interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// 좋아하는 음식 옵션
export const FOOD_OPTIONS = [
    '김치찌개',
    '된장찌개',
    '불고기',
    '갈비',
    '삼겹살',
    '비빔밥',
    '김밥',
    '라면',
    '떡볶이',
    '순두부찌개',
    '닭갈비',
    '족발',
    '보쌈',
    '냉면',
    '파스타'
] as const;

// 관심분야 옵션
export const INTEREST_OPTIONS = [
    '경제',
    '주식',
    'AI',
    'IT',
    '스포츠',
    '영화',
    '음악',
    '여행',
    '요리',
    '독서'
] as const;
