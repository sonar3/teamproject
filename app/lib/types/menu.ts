// 메뉴 권한 관련 타입 정의

export type EmployeeGrade = '일반직원' | '리더' | '최고관리자';

// 메뉴 아이템 인터페이스
export interface MenuItem {
    id: number;
    name: string;
    path: string;
    requiredGrade?: EmployeeGrade; // 이 메뉴에 접근하기 위한 최소 등급
    subMenus?: MenuItem[];
}

// 메뉴별 권한 설정
export const MENU_PERMISSIONS: Record<string, EmployeeGrade | undefined> = {
    '/notices': undefined, // 공지사항 - 모든 사용자
    '/hr': '리더', // 인사정보 - 리더 이상
    '/vacation': undefined, // 휴가관리 - 모든 사용자  
    '/collaboration': undefined, // 협업툴관리 - 모든 사용자
    '/equipment': undefined, // 장비관리 - 모든 사용자
    '/reports': undefined, // 보고서 - 모든 사용자
    '/blog': undefined, // 블로그 - 모든 사용자
    '/admin': '최고관리자', // 관리자 - 최고관리자만
};

// 특정 경로에 대한 권한 확인 함수
export const hasMenuPermission = (path: string, userGrade?: EmployeeGrade): boolean => {
    const requiredGrade = MENU_PERMISSIONS[path];
    
    // 최고관리자는 모든 메뉴 접근 가능
    if (userGrade === '최고관리자') return true;
    
    // 권한 요구사항이 없으면 모든 사용자 허용
    if (!requiredGrade) return true;
    
    // 사용자 등급이 없으면 거부
    if (!userGrade) return false;
    
    const gradeOrder = { '일반직원': 1, '리더': 2, '최고관리자': 3 };
    const userGradeLevel = gradeOrder[userGrade];
    const requiredGradeLevel = gradeOrder[requiredGrade];
    
    return userGradeLevel >= requiredGradeLevel;
};

// 사용자 등급에 따라 필터링된 메뉴 목록 반환
export const getFilteredMenus = (userGrade?: EmployeeGrade, iaData?: any) => {
    if (!iaData?.IaList) return [];
    
    return iaData.IaList.filter((item: any) => {
        return hasMenuPermission(item.path, userGrade);
    });
};
