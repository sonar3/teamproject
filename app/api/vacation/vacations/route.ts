import { NextRequest, NextResponse } from "next/server";
import { Vacation, VacationFormData, VacationResponse, VacationListResponse } from "@/app/lib/types/vacation";

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

// GET: 휴가 목록 조회 (월별 필터링)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    let filteredVacations = vacations;

    // 년도와 월로 필터링
    if (year && month) {
      const targetYear = parseInt(year);
      const targetMonth = parseInt(month);
      
      filteredVacations = vacations.filter(vacation => {
        const startDate = new Date(vacation.startDate);
        const endDate = new Date(vacation.endDate);
        
        // 시작일이나 종료일이 해당 월에 포함되는 경우
        return (startDate.getFullYear() === targetYear && startDate.getMonth() + 1 === targetMonth) ||
               (endDate.getFullYear() === targetYear && endDate.getMonth() + 1 === targetMonth) ||
               (startDate <= new Date(targetYear, targetMonth - 1, 1) && endDate >= new Date(targetYear, targetMonth, 0));
      });
    }

    const response: VacationListResponse = {
      success: true,
      data: filteredVacations
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch vacations:', error);
    const response: VacationListResponse = {
      success: false,
      message: '휴가 목록을 불러오는데 실패했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST: 새로운 휴가 등록
export async function POST(request: NextRequest) {
  try {
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

    // 중복 휴가 검사 (같은 직원의 같은 기간)
    const hasConflict = vacations.some(vacation => {
      if (vacation.employeeId !== body.employeeId) return false;
      
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

    // 새 휴가 생성
    const newVacation: Vacation = {
      id: Date.now().toString(),
      employeeId: body.employeeId,
      employeeName: body.employeeName,
      startDate: body.startDate,
      endDate: body.endDate,
      type: body.type,
      reason: body.reason || '',
      status: 'approved', // 기본값으로 승인 상태
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    vacations.push(newVacation);

    const response: VacationResponse = {
      success: true,
      data: newVacation,
      message: '휴가가 성공적으로 등록되었습니다.'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Failed to create vacation:', error);
    const response: VacationResponse = {
      success: false,
      message: '휴가 등록에 실패했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
