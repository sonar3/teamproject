import { NextRequest, NextResponse } from "next/server";
import { ReportFormData, ReportResponse, Report, ReportType } from "@/app/lib/types/report";

// 임시 데이터 저장소 (실제 환경에서는 데이터베이스 사용)
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

// GET: 보고서 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const type = searchParams.get('type') as ReportType | null;
        const search = searchParams.get('search') || '';

        let filteredReports = reports;

        // 타입 필터링
        if (type) {
            filteredReports = filteredReports.filter(report => report.type === type);
        }

        // 검색 기능
        if (search) {
            filteredReports = filteredReports.filter(report => 
                report.title.includes(search) ||
                report.content.includes(search) ||
                report.authorName.includes(search)
            );
        }

        // 최신순 정렬
        filteredReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // 페이지네이션
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedReports = filteredReports.slice(startIndex, endIndex);

        const response: ReportResponse = {
            success: true,
            message: "보고서 목록을 성공적으로 조회했습니다.",
            data: paginatedReports
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Get reports error:', error);
        return NextResponse.json(
            { success: false, message: "보고서 목록 조회 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

// POST: 보고서 생성
export async function POST(request: NextRequest) {
    try {
        const body: ReportFormData & { authorId: string; authorName: string; authorGrade: string } = await request.json();
        const { title, type, content, authorId, authorName, authorGrade } = body;

        // 입력 검증
        if (!title || !type || !content) {
            return NextResponse.json(
                { success: false, message: "필수 항목을 모두 입력해주세요." },
                { status: 400 }
            );
        }

        // 제목 중복 체크
        const existingReport = reports.find(report => report.title === title);
        if (existingReport) {
            return NextResponse.json(
                { success: false, message: "이미 존재하는 제목입니다." },
                { status: 400 }
            );
        }

        // 새 보고서 생성
        const newReport: Report = {
            id: (reports.length + 1).toString(),
            title,
            type,
            authorId,
            authorName,
            authorGrade: authorGrade as '일반직원' | '리더' | '최고관리자',
            content,
            threads: type === '주간보고' ? [] : undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        reports.push(newReport);

        const response: ReportResponse = {
            success: true,
            message: "보고서가 성공적으로 생성되었습니다.",
            data: newReport
        };

        return NextResponse.json(response, { status: 201 });

    } catch (error) {
        console.error('Create report error:', error);
        return NextResponse.json(
            { success: false, message: "보고서 생성 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
