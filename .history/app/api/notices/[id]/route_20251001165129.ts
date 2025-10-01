import { NextRequest, NextResponse } from "next/server";
import { NoticeResponse } from "@/app/lib/types/notice";
import { supabase } from "@/app/lib/supabase";

// GET: 공지사항 상세 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // 공지사항 조회
        const { data: notice, error } = await supabase
            .from('notices')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !notice) {
            return NextResponse.json(
                { success: false, message: "공지사항을 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        // 조회수 증가
        await supabase
            .from('notices')
            .update({ view_count: notice.view_count + 1 })
            .eq('id', id);

        // 데이터 형식 변환
        const formattedNotice = {
            id: notice.id,
            title: notice.title,
            content: notice.content,
            author: notice.author_name,
            authorId: notice.author_id,
            category: notice.category || '공지',
            isImportant: notice.is_important,
            viewCount: notice.view_count + 1, // 증가된 조회수 반영
            createdAt: notice.created_at,
            updatedAt: notice.updated_at
        };

        const response: NoticeResponse = {
            success: true,
            message: "공지사항을 성공적으로 조회했습니다.",
            data: formattedNotice
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

        // Supabase에서 공지사항 업데이트
        const { data, error } = await supabase
            .from('notices')
            .update({
                title: title.trim(),
                content: content.trim(),
                category: category,
                is_important: isImportant || false,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            return NextResponse.json(
                { success: false, message: "공지사항을 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        // 데이터 형식 변환
        const formattedNotice = {
            id: data.id,
            title: data.title,
            content: data.content,
            author: data.author_name,
            authorId: data.author_id,
            category: data.category,
            isImportant: data.is_important,
            viewCount: data.view_count,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        };

        const response: NoticeResponse = {
            success: true,
            message: "공지사항이 성공적으로 수정되었습니다.",
            data: formattedNotice
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
