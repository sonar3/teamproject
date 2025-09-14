import { NextRequest, NextResponse } from "next/server";
import { SurveyData } from "@/app/lib/types/hr";
import { updateEmployee } from "@/app/lib/data/employees";

// POST: 설문조사 제출
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { employeeId, surveyData } = body;

        // 입력 검증
        if (!employeeId || !surveyData) {
            return NextResponse.json(
                { success: false, message: "필수 정보를 모두 입력해주세요." },
                { status: 400 }
            );
        }

        if (!surveyData.favoriteFoods || !surveyData.interests || 
            surveyData.favoriteFoods.length === 0 || surveyData.interests.length === 0) {
            return NextResponse.json(
                { success: false, message: "좋아하는 음식과 관심분야를 각각 최소 1개 이상 선택해주세요." },
                { status: 400 }
            );
        }

        // 직원 정보에 설문조사 데이터 추가 (실제로는 별도 테이블에 저장해야 함)
        const updatedEmployee = updateEmployee(employeeId, {
            surveyData: surveyData
        });

        if (!updatedEmployee) {
            return NextResponse.json(
                { success: false, message: "직원 정보를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        const response = {
            success: true,
            message: "설문조사가 성공적으로 제출되었습니다.",
            data: {
                id: updatedEmployee.id,
                name: updatedEmployee.name,
                email: updatedEmployee.email,
                surveyData: surveyData
            }
        };

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error('Survey submission error:', error);
        return NextResponse.json(
            { success: false, message: "설문조사 제출 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
