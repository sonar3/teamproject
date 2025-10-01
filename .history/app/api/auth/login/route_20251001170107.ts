import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

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

        // Supabase에서 사용자 찾기 (이메일과 비밀번호로 검증)
        const { data: user, error } = await supabase
            .from('employees')
            .select('id, name, email, grade, position, project')
            .eq('email', email)
            .eq('password', password) // 실제 환경에서는 해시된 비밀번호를 사용해야 함
            .single();

        if (error || !user) {
            return NextResponse.json(
                { success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." },
                { status: 401 }
            );
        }

        // 권한 등급을 role로 변환
        const role = user.grade === '최고관리자' ? 'admin' : 
                    user.grade === '리더' ? 'leader' : 'user';

        // JWT 토큰 생성 (실제 환경에서는 더 안전한 방법 사용)
        const token = Buffer.from(JSON.stringify({
            userId: user.id,
            email: user.email,
            role: role,
            grade: user.grade,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24시간 후 만료
        })).toString('base64');

        // 응답용 사용자 정보
        const userInfo = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: role,
            grade: user.grade,
            position: user.position,
            project: user.project
        };

        return NextResponse.json({
            success: true,
            message: "로그인 성공",
            token,
            user: userInfo
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
