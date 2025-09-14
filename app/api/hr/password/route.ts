import { NextRequest, NextResponse } from "next/server";
import { PasswordChangeData } from "@/app/lib/types/hr";
import { updateEmployee } from "@/app/lib/data/employees";

// PUT: 비밀번호 변경
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { employeeId, currentPassword, newPassword } = body;

        // 입력 검증
        if (!employeeId || !currentPassword || !newPassword) {
            return NextResponse.json(
                { success: false, message: "필수 정보를 모두 입력해주세요." },
                { status: 400 }
            );
        }

        if (newPassword.length < 4) {
            return NextResponse.json(
                { success: false, message: "새 비밀번호는 최소 4자리 이상이어야 합니다." },
                { status: 400 }
            );
        }

        // 직원 정보 업데이트
        const updatedEmployee = updateEmployee(employeeId, {
            password: newPassword,
            isFirstLogin: false // 비밀번호 변경 후 첫 로그인 상태 해제
        });

        if (!updatedEmployee) {
            return NextResponse.json(
                { success: false, message: "직원 정보를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        const response = {
            success: true,
            message: "비밀번호가 성공적으로 변경되었습니다.",
            data: {
                id: updatedEmployee.id,
                name: updatedEmployee.name,
                email: updatedEmployee.email
            }
        };

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json(
            { success: false, message: "비밀번호 변경 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
