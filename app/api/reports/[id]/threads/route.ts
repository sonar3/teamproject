import { NextRequest, NextResponse } from "next/server";
import { ThreadFormData, ThreadResponse, ReportThread } from "@/app/lib/types/report";

// 임시 데이터 저장소 (실제 환경에서는 데이터베이스 사용)
let reports: any[] = [
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
    }
];

// POST: 스레드 추가
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body: ThreadFormData & { authorId: string; authorName: string; authorGrade: string } = await request.json();
        const { content, authorId, authorName, authorGrade } = body;

        // 입력 검증
        if (!content) {
            return NextResponse.json(
                { success: false, message: "내용을 입력해주세요." },
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

        const report = reports[reportIndex];
        
        // 주간보고가 아닌 경우 스레드 추가 불가
        if (report.type !== '주간보고') {
            return NextResponse.json(
                { success: false, message: "주간보고에만 스레드를 추가할 수 있습니다." },
                { status: 400 }
            );
        }

        // 새 스레드 생성
        const newThread: ReportThread = {
            id: `${id}-${Date.now()}`,
            authorId,
            authorName,
            authorGrade: authorGrade as '일반직원' | '리더' | '최고관리자',
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // 스레드 배열 초기화 (없는 경우)
        if (!report.threads) {
            report.threads = [];
        }

        // 스레드 추가
        report.threads.push(newThread);
        report.updatedAt = new Date().toISOString();

        const response: ThreadResponse = {
            success: true,
            message: "스레드가 성공적으로 추가되었습니다.",
            data: newThread
        };

        return NextResponse.json(response, { status: 201 });

    } catch (error) {
        console.error('Add thread error:', error);
        return NextResponse.json(
            { success: false, message: "스레드 추가 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
