import { NextRequest, NextResponse } from "next/server";
import { Equipment, EquipmentFormData, EquipmentResponse } from "@/app/lib/types/equipment";

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 합니다)
let equipments: Equipment[] = [
  {
    id: "1",
    category: "laptop",
    assigneeName: "홍길동",
    equipmentInfo: "MacBook Pro 16-inch (2023)\n시리얼: C02XK0XXXXXX\nM2 Pro, 16GB RAM, 512GB SSD",
    status: "good",
    isInUse: true,
    assignedDate: "2024-01-15T00:00:00Z",
    notes: "개발용 노트북",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z"
  },
  {
    id: "2",
    category: "monitor",
    assigneeName: "김철수",
    equipmentInfo: "LG 27인치 4K 모니터\n모델: 27UN850-W\n시리얼: 2024LG001",
    status: "new",
    isInUse: true,
    assignedDate: "2024-02-01T00:00:00Z",
    notes: "디자인 작업용",
    createdAt: "2024-02-01T10:30:00Z",
    updatedAt: "2024-02-01T10:30:00Z"
  },
  {
    id: "3",
    category: "desktop",
    assigneeName: "이영희",
    equipmentInfo: "Dell OptiPlex 7090\nIntel i7-11700, 32GB RAM, 1TB SSD\n시리얼: DL2024001",
    status: "good",
    isInUse: false,
    assignedDate: "2024-01-20T00:00:00Z",
    returnedDate: "2024-11-30T00:00:00Z",
    notes: "프로젝트 완료로 반납",
    createdAt: "2024-01-20T14:20:00Z",
    updatedAt: "2024-11-30T14:20:00Z"
  },
  {
    id: "4",
    category: "other",
    customCategory: "태블릿",
    assigneeName: "박민수",
    equipmentInfo: "iPad Pro 12.9-inch (6세대)\nWi-Fi + Cellular, 256GB\n시리얼: F2LXXXXXXXXX",
    status: "good",
    isInUse: true,
    assignedDate: "2024-03-10T00:00:00Z",
    notes: "현장 작업용",
    createdAt: "2024-03-10T09:15:00Z",
    updatedAt: "2024-03-10T09:15:00Z"
  },
  {
    id: "5",
    category: "laptop",
    assigneeName: "정수진",
    equipmentInfo: "Dell XPS 13 (2024)\nIntel i5-1340P, 16GB RAM, 512GB SSD\n시리얼: DL2024002",
    status: "repair",
    isInUse: false,
    assignedDate: "2024-04-05T00:00:00Z",
    notes: "화면 깨짐으로 수리 중",
    createdAt: "2024-04-05T11:45:00Z",
    updatedAt: "2024-12-01T11:45:00Z"
  }
];

// PUT: 장비 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: EquipmentFormData = await request.json();

    // 입력 데이터 검증
    if (!body.category || !body.assigneeName || !body.equipmentInfo || !body.status || !body.assignedDate) {
      const response: EquipmentResponse = {
        success: false,
        message: '모든 필수 필드를 입력해주세요.'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 기타 카테고리인 경우 customCategory 필수
    if (body.category === 'other' && !body.customCategory?.trim()) {
      const response: EquipmentResponse = {
        success: false,
        message: '기타 장비의 경우 장비명을 입력해주세요.'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 날짜 유효성 검사
    if (body.returnedDate && body.assignedDate && new Date(body.returnedDate) < new Date(body.assignedDate)) {
      const response: EquipmentResponse = {
        success: false,
        message: '반납일은 지급일보다 늦어야 합니다.'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 해당 ID의 장비 찾기
    const equipmentIndex = equipments.findIndex(equipment => equipment.id === id);
    
    if (equipmentIndex === -1) {
      const response: EquipmentResponse = {
        success: false,
        message: '해당 장비를 찾을 수 없습니다.'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 장비 수정
    const updatedEquipment: Equipment = {
      ...equipments[equipmentIndex],
      category: body.category,
      customCategory: body.category === 'other' ? body.customCategory : undefined,
      assigneeName: body.assigneeName.trim(),
      equipmentInfo: body.equipmentInfo.trim(),
      status: body.status,
      isInUse: body.isInUse,
      assignedDate: body.assignedDate,
      returnedDate: body.returnedDate || undefined,
      notes: body.notes?.trim() || undefined,
      updatedAt: new Date().toISOString()
    };

    equipments[equipmentIndex] = updatedEquipment;

    const response: EquipmentResponse = {
      success: true,
      data: updatedEquipment,
      message: '장비가 성공적으로 수정되었습니다.'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to update equipment:', error);
    const response: EquipmentResponse = {
      success: false,
      message: '장비 수정에 실패했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE: 장비 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 해당 ID의 장비 찾기
    const equipmentIndex = equipments.findIndex(equipment => equipment.id === id);
    
    if (equipmentIndex === -1) {
      const response: EquipmentResponse = {
        success: false,
        message: '해당 장비를 찾을 수 없습니다.'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 장비 삭제
    const deletedEquipment = equipments[equipmentIndex];
    equipments.splice(equipmentIndex, 1);

    const response: EquipmentResponse = {
      success: true,
      data: deletedEquipment,
      message: '장비가 성공적으로 삭제되었습니다.'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to delete equipment:', error);
    const response: EquipmentResponse = {
      success: false,
      message: '장비 삭제에 실패했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
