import { NextRequest, NextResponse } from "next/server";
import { Vacation, VacationFormData, VacationResponse } from "@/app/lib/types/vacation";

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 합니다)
let vacations: Vacation[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "홍길동",
    startDate: "2024-12-20T00:00:00Z",
    endDate: "2024-12-22T00:00:00Z",
    type: "annual",
    reason: "연말 휴가",
    status: "approved",
    createdAt: "2024-12-15T09:00:00Z",
    updatedAt: "2024-12-15T09:00:00Z"
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "김철수",
    startDate: "2024-12-25T00:00:00Z",
    endDate: "2024-12-25T00:00:00Z",
    type: "sick",
    reason: "감기",
    status: "approved",
    createdAt: "2024-12-20T10:30:00Z",
    updatedAt: "2024-12-20T10:30:00Z"
  },
  {
    id: "3",
    employeeId: "3",
    employeeName: "이영희",
    startDate: "2024-12-30T00:00:00Z",
    endDate: "2025-01-02T00:00:00Z",
    type: "annual",
    reason: "신정 연휴",
    status: "approved",
    createdAt: "2024-12-18T14:20:00Z",
    updatedAt: "2024-12-18T14:20:00Z"
  }
];

// PUT: 휴가 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: VacationFormData = await request.json();

    // 입력 데이터 검증
    if (!body.employeeId || !body.employeeName || !body.startDate || !body.endDate || !body.type) {
      const response: VacationResponse = {
        success: false,
        message: '모든 필수 필드를 입력해주세요.'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 날짜 유효성 검사
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    
    if (startDate > endDate) {
      const response: VacationResponse = {
        success: false,
        message: '시작일은 종료일보다 늦을 수 없습니다.'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 해당 ID의 휴가 찾기
    const vacationIndex = vacations.findIndex(vacation => vacation.id === id);
    
    if (vacationIndex === -1) {
      const response: VacationResponse = {
        success: false,
        message: '해당 휴가를 찾을 수 없습니다.'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 중복 휴가 검사 (같은 직원의 같은 기간, 수정 중인 휴가 제외)
    const hasConflict = vacations.some((vacation, index) => {
      if (index === vacationIndex || vacation.employeeId !== body.employeeId) return false;
      
      const existingStart = new Date(vacation.startDate);
      const existingEnd = new Date(vacation.endDate);
      
      return (startDate <= existingEnd && endDate >= existingStart);
    });

    if (hasConflict) {
      const response: VacationResponse = {
        success: false,
        message: '해당 기간에 이미 휴가가 등록되어 있습니다.'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 휴가 수정
    const updatedVacation: Vacation = {
      ...vacations[vacationIndex],
      employeeId: body.employeeId,
      employeeName: body.employeeName,
      startDate: body.startDate,
      endDate: body.endDate,
      type: body.type,
      reason: body.reason || '',
      updatedAt: new Date().toISOString()
    };

    vacations[vacationIndex] = updatedVacation;

    const response: VacationResponse = {
      success: true,
      data: updatedVacation,
      message: '휴가가 성공적으로 수정되었습니다.'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to update vacation:', error);
    const response: VacationResponse = {
      success: false,
      message: '휴가 수정에 실패했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE: 휴가 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 해당 ID의 휴가 찾기
    const vacationIndex = vacations.findIndex(vacation => vacation.id === id);
    
    if (vacationIndex === -1) {
      const response: VacationResponse = {
        success: false,
        message: '해당 휴가를 찾을 수 없습니다.'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 휴가 삭제
    const deletedVacation = vacations[vacationIndex];
    vacations.splice(vacationIndex, 1);

    const response: VacationResponse = {
      success: true,
      data: deletedVacation,
      message: '휴가가 성공적으로 삭제되었습니다.'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to delete vacation:', error);
    const response: VacationResponse = {
      success: false,
      message: '휴가 삭제에 실패했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
