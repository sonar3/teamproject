import { NextRequest, NextResponse } from "next/server";
import { BlogPost, BlogResponse, BlogFormData } from "@/app/lib/types/blog";

// 임시 데이터 저장소 (실제 환경에서는 데이터베이스 사용)
let blogPosts: BlogPost[] = [
    {
        id: "1",
        title: "Next.js 14 새로운 기능 소개",
        content: "# Next.js 14 새로운 기능 소개\n\nNext.js 14가 출시되면서 많은 새로운 기능들이 추가되었습니다.\n\n## 주요 변경사항\n\n- **App Router 안정화**: App Router가 이제 안정 버전으로 제공됩니다.\n- **Turbopack**: 개발 서버의 성능이 크게 향상되었습니다.\n- **Server Components**: 서버 컴포넌트의 성능이 개선되었습니다.\n\n## 마이그레이션 가이드\n\n기존 프로젝트를 Next.js 14로 업그레이드하는 방법에 대해 알아보겠습니다.",
        excerpt: "Next.js 14의 새로운 기능들과 마이그레이션 가이드를 소개합니다.",
        authorId: "1",
        authorName: "홍길동",
        authorGrade: "최고관리자",
        source: "editor",
        tags: ["개발", "Next.js", "기술"],
        isPublished: true,
        viewCount: 125,
        createdAt: "2024-01-15T09:00:00Z",
        updatedAt: "2024-01-15T09:00:00Z",
        publishedAt: "2024-01-15T09:00:00Z"
    },
    {
        id: "2",
        title: "팀 프로젝트 회고록",
        content: "# 팀 프로젝트 회고록\n\n지난 3개월간 진행한 프로젝트에 대한 회고를 작성합니다.\n\n## 프로젝트 개요\n\n- **프로젝트명**: Fit Team Library\n- **기간**: 2024.03 ~ 2024.10\n- **팀원**: 5명\n\n## 성과\n\n- 모든 기능이 예정대로 완료되었습니다.\n- 팀원들의 협업이 원활했습니다.\n\n## 개선점\n\n- 초기 기획 단계에서 더 많은 시간을 투자해야 합니다.\n- 코드 리뷰 프로세스를 개선할 필요가 있습니다.",
        excerpt: "3개월간 진행한 팀 프로젝트의 성과와 개선점을 정리했습니다.",
        authorId: "2",
        authorName: "김철수",
        authorGrade: "리더",
        source: "editor",
        tags: ["프로젝트", "회고", "팀워크"],
        isPublished: true,
        viewCount: 89,
        createdAt: "2024-01-12T14:30:00Z",
        updatedAt: "2024-01-12T14:30:00Z",
        publishedAt: "2024-01-12T14:30:00Z"
    },
    {
        id: "3",
        title: "마크다운 사용법 가이드",
        content: "# 마크다운 사용법 가이드\n\n마크다운 문법에 대해 알아보겠습니다.\n\n## 제목\n\n```markdown\n# H1 제목\n## H2 제목\n### H3 제목\n```\n\n## 텍스트 스타일\n\n- **굵게**: `**텍스트**`\n- *기울임*: `*텍스트*`\n- `코드`: `\\`코드\\``\n\n## 리스트\n\n```markdown\n- 항목 1\n- 항목 2\n  - 하위 항목\n```\n\n## 링크와 이미지\n\n[링크](https://example.com)\n![이미지](image-url)",
        excerpt: "마크다운 문법을 쉽게 배울 수 있는 가이드입니다.",
        authorId: "3",
        authorName: "이영희",
        authorGrade: "일반직원",
        source: "file",
        fileName: "markdown-guide.md",
        tags: ["학습", "마크다운", "기술"],
        isPublished: true,
        viewCount: 67,
        createdAt: "2024-01-10T11:20:00Z",
        updatedAt: "2024-01-10T11:20:00Z",
        publishedAt: "2024-01-10T11:20:00Z"
    }
];

// GET: 특정 블로그 포스트 조회
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const post = blogPosts.find(p => p.id === id);

        if (!post) {
            return NextResponse.json(
                { success: false, message: "블로그 포스트를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        // 발행되지 않은 포스트는 작성자만 볼 수 있도록 체크 (실제로는 인증 체크 필요)
        if (!post.isPublished) {
            // 여기서는 단순히 에러를 반환하지만, 실제로는 JWT 토큰으로 인증 체크
            return NextResponse.json(
                { success: false, message: "발행되지 않은 포스트입니다." },
                { status: 403 }
            );
        }

        // 조회수 증가
        const postIndex = blogPosts.findIndex(p => p.id === id);
        if (postIndex !== -1) {
            blogPosts[postIndex].viewCount += 1;
        }

        const response: BlogResponse = {
            success: true,
            message: "블로그 포스트를 성공적으로 조회했습니다.",
            data: blogPosts[postIndex]
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Get blog post error:', error);
        return NextResponse.json(
            { success: false, message: "블로그 포스트 조회 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

// PUT: 블로그 포스트 수정
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body: BlogFormData = await request.json();
        const { title, content, excerpt, tags, isPublished } = body;

        // 입력 검증
        if (!title || !content || !excerpt) {
            return NextResponse.json(
                { success: false, message: "필수 항목을 모두 입력해주세요." },
                { status: 400 }
            );
        }

        const postIndex = blogPosts.findIndex(p => p.id === id);
        if (postIndex === -1) {
            return NextResponse.json(
                { success: false, message: "블로그 포스트를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        // 제목 중복 체크 (자신 제외)
        const existingPost = blogPosts.find(p => p.title === title && p.id !== id);
        if (existingPost) {
            return NextResponse.json(
                { success: false, message: "이미 존재하는 제목입니다." },
                { status: 400 }
            );
        }

        // 블로그 포스트 업데이트
        const updatedPost: BlogPost = {
            ...blogPosts[postIndex],
            title,
            content,
            excerpt,
            tags: tags || [],
            isPublished: isPublished || false,
            updatedAt: new Date().toISOString(),
            publishedAt: isPublished && !blogPosts[postIndex].isPublished 
                ? new Date().toISOString() 
                : blogPosts[postIndex].publishedAt
        };

        blogPosts[postIndex] = updatedPost;

        const response: BlogResponse = {
            success: true,
            message: "블로그 포스트가 성공적으로 수정되었습니다.",
            data: updatedPost
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Update blog post error:', error);
        return NextResponse.json(
            { success: false, message: "블로그 포스트 수정 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

// DELETE: 블로그 포스트 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const postIndex = blogPosts.findIndex(p => p.id === id);

        if (postIndex === -1) {
            return NextResponse.json(
                { success: false, message: "블로그 포스트를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        const deletedPost = blogPosts[postIndex];
        blogPosts.splice(postIndex, 1);

        const response: BlogResponse = {
            success: true,
            message: "블로그 포스트가 성공적으로 삭제되었습니다.",
            data: deletedPost
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Delete blog post error:', error);
        return NextResponse.json(
            { success: false, message: "블로그 포스트 삭제 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
