import { NextRequest, NextResponse } from "next/server";

// 임시 사용자 데이터 (실제 환경에서는 데이터베이스에서 가져와야 함)
const TEMP_USERS = [
    {
        id: "1",
        email: "admin@fit-team.com",
        password: "admin123",
        name: "관리자",
        role: "admin"
    },
    {
        id: "2", 
        email: "test@test.com",
        password: "test123",
        name: "테스트 사용자",
        role: "user"
    }
];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // 입력 검증
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "이메일과 비밀번호를 입력해주세요." },
                { status: 400 }
            );
        }

        // 사용자 찾기
        const user = TEMP_USERS.find(u => u.email === email && u.password === password);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." },
                { status: 401 }
            );
        }

        // JWT 토큰 생성 (실제 환경에서는 더 안전한 방법 사용)
        const token = Buffer.from(JSON.stringify({
            userId: user.id,
            email: user.email,
            role: user.role,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24시간 후 만료
        })).toString('base64');

        // 사용자 정보에서 비밀번호 제거
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            message: "로그인 성공",
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
