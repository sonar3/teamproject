import { NextRequest, NextResponse } from "next/server";
import { CollaborationTool, CollaborationFormData, CollaborationResponse, CollaborationListResponse } from "@/app/lib/types/collaboration";

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 합니다)
let collaborationTools: CollaborationTool[] = [
  {
    id: "1",
    name: "팀 슬랙",
    tool: "slack",
    loginInfo: "team-slack.slack.com\n아이디: admin@company.com\n비밀번호: ********",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z"
  },
  {
    id: "2",
    name: "프로젝트 노션",
    tool: "notion",
    loginInfo: "https://notion.so/company\n공유 링크: https://notion.so/team-workspace",
    createdAt: "2024-01-16T10:30:00Z",
    updatedAt: "2024-01-16T10:30:00Z"
  },
  {
    id: "3",
    name: "디자인 피그마",
    tool: "figma",
    loginInfo: "figma.com/company\n팀 링크: https://figma.com/design-system",
    createdAt: "2024-01-17T14:20:00Z",
    updatedAt: "2024-01-17T14:20:00Z"
  }
];

// GET: 협업툴 목록 조회
export async function GET(request: NextRequest) {
  try {
    const response: CollaborationListResponse = {
      success: true,
      data: collaborationTools
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch collaboration tools:', error);
    const response: CollaborationListResponse = {
      success: false,
      message: '협업툴 목록을 불러오는데 실패했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST: 새로운 협업툴 등록
export async function POST(request: NextRequest) {
  try {
    const body: CollaborationFormData = await request.json();

    // 입력 데이터 검증
    if (!body.name || !body.tool || !body.loginInfo) {
      const response: CollaborationResponse = {
        success: false,
        message: '모든 필드를 입력해주세요.'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 새 협업툴 생성
    const newTool: CollaborationTool = {
      id: Date.now().toString(),
      name: body.name.trim(),
      tool: body.tool,
      loginInfo: body.loginInfo.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    collaborationTools.push(newTool);

    const response: CollaborationResponse = {
      success: true,
      data: newTool,
      message: '협업툴이 성공적으로 등록되었습니다.'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Failed to create collaboration tool:', error);
    const response: CollaborationResponse = {
      success: false,
      message: '협업툴 등록에 실패했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
