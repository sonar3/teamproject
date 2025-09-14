import { NextRequest, NextResponse } from "next/server";
import { Employee, EmployeeFormData, EmployeeResponse } from "@/app/lib/types/hr";

// 임시 데이터 저장소 (실제 환경에서는 데이터베이스 사용)
// 이 데이터는 /api/hr/employees/route.ts와 공유되어야 함
let employees: Employee[] = [
    {
        id: "1",
        name: "홍길동",
        email: "hong@company.com",
        gender: "남",
        position: "대표이사",
        project: "Fit Team Library",
        startDate: "2024-01-01",
        endDate: undefined,
        grade: "최고관리자",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
    },
    {
        id: "2",
        name: "김철수",
        email: "kim@company.com",
        gender: "남",
        position: "부장",
        project: "이양사무소",
        startDate: "2024-02-01",
        endDate: "2024-12-31",
        grade: "리더",
        createdAt: "2024-02-01T00:00:00Z",
        updatedAt: "2024-02-01T00:00:00Z"
    },
    {
        id: "3",
        name: "이영희",
        email: "lee@company.com",
        gender: "여",
        position: "과장",
        project: "대국민포털관리",
        startDate: "2024-03-01",
        endDate: undefined,
        grade: "일반직원",
        createdAt: "2024-03-01T00:00:00Z",
        updatedAt: "2024-03-01T00:00:00Z"
    }
];

// GET: 특정 직원 정보 조회
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const employee = employees.find(emp => emp.id === id);

        if (!employee) {
            return NextResponse.json(
                { success: false, message: "직원 정보를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        const response: EmployeeResponse = {
            success: true,
            message: "직원 정보를 성공적으로 조회했습니다.",
            data: employee
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Get employee error:', error);
        return NextResponse.json(
            { success: false, message: "직원 정보 조회 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

// PUT: 직원 정보 수정
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body: EmployeeFormData = await request.json();
        const { name, gender, position, project, startDate, endDate, grade } = body;

        // 입력 검증
        if (!name || !gender || !position || !project || !startDate || !grade) {
            return NextResponse.json(
                { success: false, message: "필수 항목을 모두 입력해주세요." },
                { status: 400 }
            );
        }

        const employeeIndex = employees.findIndex(emp => emp.id === id);
        if (employeeIndex === -1) {
            return NextResponse.json(
                { success: false, message: "직원 정보를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        // 중복 이름 체크 (자신 제외)
        const existingEmployee = employees.find(emp => emp.name === name && emp.id !== id);
        if (existingEmployee) {
            return NextResponse.json(
                { success: false, message: "이미 등록된 직원입니다." },
                { status: 400 }
            );
        }

        // 직원 정보 업데이트
        const updatedEmployee: Employee = {
            ...employees[employeeIndex],
            name,
            gender,
            position,
            project,
            startDate,
            endDate: endDate || undefined,
            grade,
            updatedAt: new Date().toISOString()
        };

        employees[employeeIndex] = updatedEmployee;

        const response: EmployeeResponse = {
            success: true,
            message: "직원 정보가 성공적으로 수정되었습니다.",
            data: updatedEmployee
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Update employee error:', error);
        return NextResponse.json(
            { success: false, message: "직원 정보 수정 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

// DELETE: 직원 정보 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const employeeIndex = employees.findIndex(emp => emp.id === id);

        if (employeeIndex === -1) {
            return NextResponse.json(
                { success: false, message: "직원 정보를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        const deletedEmployee = employees[employeeIndex];
        employees.splice(employeeIndex, 1);

        const response: EmployeeResponse = {
            success: true,
            message: "직원 정보가 성공적으로 삭제되었습니다.",
            data: deletedEmployee
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Delete employee error:', error);
        return NextResponse.json(
            { success: false, message: "직원 정보 삭제 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
