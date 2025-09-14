import { Employee } from '@/app/lib/types/hr';

// 임시 데이터 저장소 (실제 환경에서는 데이터베이스 사용)
export let employees: Employee[] = [
    {
        id: "1",
        name: "홍길동",
        email: "hong@company.com",
        password: "0000", // 초기 비밀번호
        gender: "남",
        position: "대표이사",
        project: "Fit Team Library",
        startDate: "2024-01-01",
        endDate: undefined,
        grade: "최고관리자",
        isFirstLogin: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
    },
    {
        id: "2",
        name: "김철수",
        email: "kim@company.com",
        password: "0000", // 초기 비밀번호
        gender: "남",
        position: "부장",
        project: "이양사무소",
        startDate: "2024-02-01",
        endDate: "2024-12-31",
        grade: "리더",
        isFirstLogin: true,
        createdAt: "2024-02-01T00:00:00Z",
        updatedAt: "2024-02-01T00:00:00Z"
    },
    {
        id: "3",
        name: "이영희",
        email: "lee@company.com",
        password: "0000", // 초기 비밀번호
        gender: "여",
        position: "과장",
        project: "대국민포털관리",
        startDate: "2024-03-01",
        endDate: undefined,
        grade: "일반직원",
        isFirstLogin: true,
        createdAt: "2024-03-01T00:00:00Z",
        updatedAt: "2024-03-01T00:00:00Z"
    }
];

// 직원 추가 함수
export function addEmployee(employee: Employee) {
    employees.push(employee);
}

// 직원 찾기 함수
export function findEmployeeByEmail(email: string): Employee | undefined {
    return employees.find(emp => emp.email === email);
}

// 직원 업데이트 함수
export function updateEmployee(id: string, updates: Partial<Employee>): Employee | undefined {
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
        employees[index] = { ...employees[index], ...updates, updatedAt: new Date().toISOString() };
        return employees[index];
    }
    return undefined;
}

// 직원 삭제 함수
export function deleteEmployee(id: string): boolean {
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
        employees.splice(index, 1);
        return true;
    }
    return false;
}
