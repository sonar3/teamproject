import { NextRequest, NextResponse } from "next/server";
import { NoticeResponse } from "@/app/lib/types/notice";
import { findNoticeById, updateNotice, deleteNotice, incrementViewCount } from "@/app/lib/data/notices";

// GET: 공지사항 상세 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const notice = findNoticeById(id);
        if (!notice) {
            return NextResponse.json(
                { success: false, message: "공지사항을 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        // 조회수 증가
        incrementViewCount(id);

        const response: NoticeResponse = {
            success: true,
            message: "공지사항을 성공적으로 조회했습니다.",
            data: notice
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Get notice error:', error);
        return NextResponse.json(
            { success: false, message: "공지사항 조회 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

// PUT: 공지사항 수정
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, content, category, isImportant } = body;

        // 입력 검증
        if (!title || !content || !category) {
            return NextResponse.json(
                { success: false, message: "필수 항목을 모두 입력해주세요." },
                { status: 400 }
            );
        }

        if (title.trim().length < 2) {
            return NextResponse.json(
                { success: false, message: "제목은 2자 이상 입력해주세요." },
                { status: 400 }
            );
        }

        if (content.trim().length < 10) {
            return NextResponse.json(
                { success: false, message: "내용은 10자 이상 입력해주세요." },
                { status: 400 }
            );
        }

        // 공지사항 업데이트
        const updatedNotice = updateNotice(id, {
            title: title.trim(),
            content: content.trim(),
            category,
            isImportant: isImportant || false
        });

        if (!updatedNotice) {
            return NextResponse.json(
                { success: false, message: "공지사항을 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        const response: NoticeResponse = {
            success: true,
            message: "공지사항이 성공적으로 수정되었습니다.",
            data: updatedNotice
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Update notice error:', error);
        return NextResponse.json(
            { success: false, message: "공지사항 수정 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

// DELETE: 공지사항 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const deleted = deleteNotice(id);
        if (!deleted) {
            return NextResponse.json(
                { success: false, message: "공지사항을 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        const response: NoticeResponse = {
            success: true,
            message: "공지사항이 성공적으로 삭제되었습니다."
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Delete notice error:', error);
        return NextResponse.json(
            { success: false, message: "공지사항 삭제 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
