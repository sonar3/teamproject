import { NextRequest, NextResponse } from "next/server";
import { NoticeFormData, NoticeResponse } from "@/app/lib/types/notice";
import { supabase } from "@/app/lib/supabase";

// GET: 공지사항 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category') || '';
        const search = searchParams.get('search') || '';

        // Supabase query 시작
        let query = supabase
            .from('notices')
            .select('*', { count: 'exact' });

        // 카테고리 필터링
        if (category) {
            query = query.eq('category', category);
        }

        // 검색 기능
        if (search) {
            query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,author_name.ilike.%${search}%`);
        }

        // 중요 공지는 상단에 배치, 그 다음 최신순
        query = query.order('is_important', { ascending: false })
                    .order('created_at', { ascending: false });

        // 페이지네이션
        const startIndex = (page - 1) * limit;
        query = query.range(startIndex, startIndex + limit - 1);

        const { data: noticesData, error, count } = await query;

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { success: false, message: "데이터베이스 조회 중 오류가 발생했습니다." },
                { status: 500 }
            );
        }

        // 데이터 형식 변환 (Supabase 컬럼명 -> 프론트엔드 형식)
        const formattedNotices = noticesData?.map(notice => ({
            id: notice.id,
            title: notice.title,
            content: notice.content,
            author: notice.author_name,
            authorId: notice.author_id,
            category: notice.category || '공지',
            isImportant: notice.is_important,
            viewCount: notice.view_count,
            createdAt: notice.created_at,
            updatedAt: notice.updated_at
        })) || [];

        const total = count || 0;
        const totalPages = Math.ceil(total / limit);

        const response: NoticeResponse = {
            success: true,
            message: "공지사항 목록을 성공적으로 조회했습니다.",
            data: formattedNotices,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Get notices error:', error);
        return NextResponse.json(
            { success: false, message: "공지사항 목록 조회 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

// POST: 공지사항 등록
export async function POST(request: NextRequest) {
    try {
        const body: NoticeFormData & { authorId: string; authorName?: string } = await request.json();
        const { title, content, category, isImportant, authorId, authorName } = body;

        // 입력 검증
        if (!title || !content || !category || !authorId) {
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

        // Supabase에 새 공지사항 삽입
        const { data, error } = await supabase
            .from('notices')
            .insert([
                {
                    title: title.trim(),
                    content: content.trim(),
                    author_id: authorId,
                    author_name: authorName || "관리자",
                    category: category,
                    is_important: isImportant || false,
                    view_count: 0
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json(
                { success: false, message: "데이터베이스 등록 중 오류가 발생했습니다." },
                { status: 500 }
            );
        }

        // 응답 데이터 형식 변환
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
            message: "공지사항이 성공적으로 등록되었습니다.",
            data: formattedNotice
        };

        return NextResponse.json(response, { status: 201 });

    } catch (error) {
        console.error('Create notice error:', error);
        return NextResponse.json(
            { success: false, message: "공지사항 등록 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
