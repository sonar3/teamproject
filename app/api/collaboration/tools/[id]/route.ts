import { NextRequest, NextResponse } from "next/server";
import { CollaborationTool, CollaborationFormData, CollaborationResponse } from "@/app/lib/types/collaboration";

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 합니다)
// 이 부분은 실제로는 별도의 데이터베이스나 공유 저장소를 사용해야 합니다
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

// PUT: 협업툴 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: CollaborationFormData = await request.json();

    // 입력 데이터 검증
    if (!body.name || !body.tool || !body.loginInfo) {
      const response: CollaborationResponse = {
        success: false,
        message: '모든 필드를 입력해주세요.'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 해당 ID의 협업툴 찾기
    const toolIndex = collaborationTools.findIndex(tool => tool.id === id);
    
    if (toolIndex === -1) {
      const response: CollaborationResponse = {
        success: false,
        message: '해당 협업툴을 찾을 수 없습니다.'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 협업툴 수정
    const updatedTool: CollaborationTool = {
      ...collaborationTools[toolIndex],
      name: body.name.trim(),
      tool: body.tool,
      loginInfo: body.loginInfo.trim(),
      updatedAt: new Date().toISOString()
    };

    collaborationTools[toolIndex] = updatedTool;

    const response: CollaborationResponse = {
      success: true,
      data: updatedTool,
      message: '협업툴이 성공적으로 수정되었습니다.'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to update collaboration tool:', error);
    const response: CollaborationResponse = {
      success: false,
      message: '협업툴 수정에 실패했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE: 협업툴 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 해당 ID의 협업툴 찾기
    const toolIndex = collaborationTools.findIndex(tool => tool.id === id);
    
    if (toolIndex === -1) {
      const response: CollaborationResponse = {
        success: false,
        message: '해당 협업툴을 찾을 수 없습니다.'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 협업툴 삭제
    const deletedTool = collaborationTools[toolIndex];
    collaborationTools.splice(toolIndex, 1);

    const response: CollaborationResponse = {
      success: true,
      data: deletedTool,
      message: '협업툴이 성공적으로 삭제되었습니다.'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to delete collaboration tool:', error);
    const response: CollaborationResponse = {
      success: false,
      message: '협업툴 삭제에 실패했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
