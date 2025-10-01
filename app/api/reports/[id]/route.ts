import { NextRequest, NextResponse } from "next/server";
import { Report, ReportResponse, ReportFormData } from "@/app/lib/types/report";

// 임시 데이터 저장소 (실제 환경에서는 데이터베이스 사용)
// 이 데이터는 /api/reports/route.ts와 공유되어야 함
let reports: Report[] = [
    {
        id: "1",
        title: "2024년 1월 첫째 주 주간보고",
        type: "주간보고",
        authorId: "1",
        authorName: "홍길동",
        authorGrade: "최고관리자",
        content: "이번 주 주요 업무 진행 상황을 공유드립니다.",
        threads: [
            {
                id: "1-1",
                authorId: "2",
                authorName: "김철수",
                authorGrade: "리더",
                content: "프로젝트 A의 개발이 예정대로 진행되고 있습니다.",
                createdAt: "2024-01-05T10:00:00Z",
                updatedAt: "2024-01-05T10:00:00Z"
            },
            {
                id: "1-2",
                authorId: "3",
                authorName: "이영희",
                authorGrade: "일반직원",
                content: "설계 문서 검토를 완료했습니다.",
                createdAt: "2024-01-05T14:30:00Z",
                updatedAt: "2024-01-05T14:30:00Z"
            }
        ],
        createdAt: "2024-01-05T09:00:00Z",
        updatedAt: "2024-01-05T14:30:00Z"
    },
    {
        id: "2",
        title: "월간 프로젝트 진행 회의록",
        type: "회의록",
        authorId: "2",
        authorName: "김철수",
        authorGrade: "리더",
        content: "# 월간 프로젝트 진행 회의록\n\n## 참석자\n- 홍길동 (대표이사)\n- 김철수 (부장)\n- 이영희 (과장)\n\n## 안건\n1. 프로젝트 A 진행 상황\n2. 프로젝트 B 계획 수립\n3. 다음 달 목표 설정\n\n## 결정 사항\n- 프로젝트 A는 2월 말까지 완료 예정\n- 프로젝트 B는 3월부터 시작\n- 팀원 교육 프로그램 도입 검토",
        createdAt: "2024-01-10T15:00:00Z",
        updatedAt: "2024-01-10T15:00:00Z"
    }
];

// GET: 특정 보고서 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const report = reports.find(r => r.id === id);

        if (!report) {
            return NextResponse.json(
                { success: false, message: "보고서를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        const response: ReportResponse = {
            success: true,
            message: "보고서를 성공적으로 조회했습니다.",
            data: report
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Get report error:', error);
        return NextResponse.json(
            { success: false, message: "보고서 조회 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

// PUT: 보고서 수정
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body: ReportFormData = await request.json();
        const { title, content } = body;

        // 입력 검증
        if (!title || !content) {
            return NextResponse.json(
                { success: false, message: "필수 항목을 모두 입력해주세요." },
                { status: 400 }
            );
        }

        const reportIndex = reports.findIndex(r => r.id === id);
        if (reportIndex === -1) {
            return NextResponse.json(
                { success: false, message: "보고서를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        // 제목 중복 체크 (자신 제외)
        const existingReport = reports.find(r => r.title === title && r.id !== id);
        if (existingReport) {
            return NextResponse.json(
                { success: false, message: "이미 존재하는 제목입니다." },
                { status: 400 }
            );
        }

        // 보고서 정보 업데이트
        const updatedReport: Report = {
            ...reports[reportIndex],
            title,
            content,
            updatedAt: new Date().toISOString()
        };

        reports[reportIndex] = updatedReport;

        const response: ReportResponse = {
            success: true,
            message: "보고서가 성공적으로 수정되었습니다.",
            data: updatedReport
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Update report error:', error);
        return NextResponse.json(
            { success: false, message: "보고서 수정 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

// DELETE: 보고서 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const reportIndex = reports.findIndex(r => r.id === id);

        if (reportIndex === -1) {
            return NextResponse.json(
                { success: false, message: "보고서를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        const deletedReport = reports[reportIndex];
        reports.splice(reportIndex, 1);

        const response: ReportResponse = {
            success: true,
            message: "보고서가 성공적으로 삭제되었습니다.",
            data: deletedReport
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Delete report error:', error);
        return NextResponse.json(
            { success: false, message: "보고서 삭제 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
