import { NextRequest, NextResponse } from "next/server";
import { FileUploadResponse } from "@/app/lib/types/blog";

// POST: 마크다운 파일 업로드
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, message: "파일을 선택해주세요." },
                { status: 400 }
            );
        }

        // 파일 타입 검증
        if (!file.name.endsWith('.md')) {
            return NextResponse.json(
                { success: false, message: "마크다운 파일(.md)만 업로드 가능합니다." },
                { status: 400 }
            );
        }

        // 파일 크기 제한 (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, message: "파일 크기는 5MB를 초과할 수 없습니다." },
                { status: 400 }
            );
        }

        // 파일 내용 읽기
        const content = await file.text();
        
        // 마크다운 파싱 (간단한 파싱)
        const lines = content.split('\n');
        let title = '';
        let excerpt = '';
        
        // 첫 번째 H1 제목을 제목으로 사용
        for (const line of lines) {
            if (line.startsWith('# ')) {
                title = line.replace('# ', '').trim();
                break;
            }
        }
        
        // 제목이 없으면 파일명을 제목으로 사용
        if (!title) {
            title = file.name.replace('.md', '');
        }
        
        // 첫 번째 문단을 요약으로 사용
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && !line.startsWith('#') && !line.startsWith('```') && !line.startsWith('-')) {
                excerpt = line.length > 100 ? line.substring(0, 100) + '...' : line;
                break;
            }
        }
        
        // 요약이 없으면 기본값 사용
        if (!excerpt) {
            excerpt = '마크다운 파일로 작성된 블로그 포스트입니다.';
        }

        const response: FileUploadResponse = {
            success: true,
            message: "파일이 성공적으로 업로드되었습니다.",
            fileName: file.name,
            content: content
        };

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json(
            { success: false, message: "파일 업로드 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
