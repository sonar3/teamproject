import { NextRequest, NextResponse } from "next/server";
import { EmployeeLoginData, EmployeeLoginResponse } from "@/app/lib/types/hr";
import { findEmployeeByEmail } from "@/app/lib/data/employees";

// POST: 직원 로그인
export async function POST(request: NextRequest) {
    try {
        const body: EmployeeLoginData = await request.json();
        const { email, password } = body;

        // 입력 검증
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "이메일과 비밀번호를 입력해주세요." },
                { status: 400 }
            );
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: "올바른 이메일 형식을 입력해주세요." },
                { status: 400 }
            );
        }

        // 데이터베이스에서 이메일로 직원을 찾기
        const employee = findEmployeeByEmail(email);
        console.log('Found employee:', employee);
        
        if (!employee) {
            return NextResponse.json(
                { success: false, message: "등록되지 않은 이메일입니다." },
                { status: 401 }
            );
        }

        // 비밀번호 확인 (실제 환경에서는 해시된 비밀번호를 비교해야 함)
        console.log('Password check:', { provided: password, stored: employee.password });
        
        if (employee.password !== password) {
            return NextResponse.json(
                { success: false, message: "비밀번호가 올바르지 않습니다." },
                { status: 401 }
            );
        }

        // 첫 로그인 여부 확인
        const isFirstLogin = employee.isFirstLogin === true;
        console.log('Is first login:', isFirstLogin);

        const response: EmployeeLoginResponse = {
            success: true,
            message: "로그인이 성공했습니다.",
            data: {
                employee: {
                    id: employee.id,
                    name: employee.name,
                    email: employee.email,
                    gender: employee.gender,
                    position: employee.position,
                    project: employee.project,
                    startDate: employee.startDate,
                    endDate: employee.endDate,
                    grade: employee.grade,
                    isFirstLogin: employee.isFirstLogin,
                    createdAt: employee.createdAt,
                    updatedAt: employee.updatedAt
                },
                isFirstLogin: isFirstLogin
            }
        };

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error('Employee login error:', error);
        return NextResponse.json(
            { success: false, message: "로그인 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
