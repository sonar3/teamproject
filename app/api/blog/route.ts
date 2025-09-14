import { NextRequest, NextResponse } from "next/server";
import { BlogFormData, BlogResponse, BlogPost, BlogSource } from "@/app/lib/types/blog";

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

// GET: 블로그 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const tag = searchParams.get('tag') || '';
        const search = searchParams.get('search') || '';
        const published = searchParams.get('published') || 'true';

        let filteredPosts = blogPosts;

        // 발행 여부 필터링
        if (published === 'true') {
            filteredPosts = filteredPosts.filter(post => post.isPublished);
        }

        // 태그 필터링
        if (tag) {
            filteredPosts = filteredPosts.filter(post => 
                post.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
            );
        }

        // 검색 기능
        if (search) {
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.content.toLowerCase().includes(search.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
                post.authorName.toLowerCase().includes(search.toLowerCase())
            );
        }

        // 최신순 정렬
        filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // 페이지네이션
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

        const response: BlogResponse = {
            success: true,
            message: "블로그 목록을 성공적으로 조회했습니다.",
            data: paginatedPosts
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Get blog posts error:', error);
        return NextResponse.json(
            { success: false, message: "블로그 목록 조회 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

// POST: 블로그 포스트 생성
export async function POST(request: NextRequest) {
    try {
        const body: BlogFormData & { 
            authorId: string; 
            authorName: string; 
            authorGrade: string;
            fileName?: string;
        } = await request.json();
        
        const { 
            title, 
            content, 
            excerpt, 
            source, 
            tags, 
            isPublished, 
            authorId, 
            authorName, 
            authorGrade,
            fileName 
        } = body;

        // 입력 검증
        if (!title || !content || !excerpt) {
            return NextResponse.json(
                { success: false, message: "필수 항목을 모두 입력해주세요." },
                { status: 400 }
            );
        }

        // 제목 중복 체크
        const existingPost = blogPosts.find(post => post.title === title);
        if (existingPost) {
            return NextResponse.json(
                { success: false, message: "이미 존재하는 제목입니다." },
                { status: 400 }
            );
        }

        // 새 블로그 포스트 생성
        const newPost: BlogPost = {
            id: (blogPosts.length + 1).toString(),
            title,
            content,
            excerpt,
            authorId,
            authorName,
            authorGrade: authorGrade as '일반직원' | '리더' | '최고관리자',
            source: source as BlogSource,
            fileName: fileName || undefined,
            tags: tags || [],
            isPublished: isPublished || false,
            viewCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: isPublished ? new Date().toISOString() : undefined
        };

        blogPosts.push(newPost);

        const response: BlogResponse = {
            success: true,
            message: "블로그 포스트가 성공적으로 생성되었습니다.",
            data: newPost
        };

        return NextResponse.json(response, { status: 201 });

    } catch (error) {
        console.error('Create blog post error:', error);
        return NextResponse.json(
            { success: false, message: "블로그 포스트 생성 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
