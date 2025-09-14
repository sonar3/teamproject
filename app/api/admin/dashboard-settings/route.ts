import { NextRequest, NextResponse } from "next/server";
import { AdminKeywordSettings, AdminSettingsResponse } from "@/app/lib/types/dashboard";

// 임시 데이터 저장소 (실제 환경에서는 데이터베이스 사용)
let adminSettings: AdminKeywordSettings = {
    keywords: ['IT', '기술', '비즈니스', '스타트업', '인공지능'],
    location: '서울시 강남구',
    newsCount: 10
};

// GET: 관리자 대시보드 설정 조회
export async function GET(request: NextRequest) {
    try {
        const response: AdminSettingsResponse = {
            success: true,
            message: "관리자 설정을 성공적으로 조회했습니다.",
            data: adminSettings
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Get admin settings error:', error);
        return NextResponse.json(
            { success: false, message: "관리자 설정 조회 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

// PUT: 관리자 대시보드 설정 업데이트
export async function PUT(request: NextRequest) {
    try {
        const body: AdminKeywordSettings = await request.json();
        const { keywords, location, newsCount } = body;

        // 입력 검증
        if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
            return NextResponse.json(
                { success: false, message: "키워드를 입력해주세요." },
                { status: 400 }
            );
        }

        if (!location || location.trim() === '') {
            return NextResponse.json(
                { success: false, message: "위치를 입력해주세요." },
                { status: 400 }
            );
        }

        if (!newsCount || newsCount < 1 || newsCount > 20) {
            return NextResponse.json(
                { success: false, message: "뉴스 개수는 1-20개 사이여야 합니다." },
                { status: 400 }
            );
        }

        // 설정 업데이트
        adminSettings = {
            keywords: keywords.map(k => k.trim()).filter(k => k.length > 0),
            location: location.trim(),
            newsCount
        };

        const response: AdminSettingsResponse = {
            success: true,
            message: "관리자 설정이 성공적으로 업데이트되었습니다.",
            data: adminSettings
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Update admin settings error:', error);
        return NextResponse.json(
            { success: false, message: "관리자 설정 업데이트 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
