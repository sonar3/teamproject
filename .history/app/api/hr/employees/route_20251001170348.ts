import { NextRequest, NextResponse } from "next/server";
import { EmployeeFormData, EmployeeResponse } from "@/app/lib/types/hr";
import { supabase } from "@/app/lib/supabase";

// GET: 인사정보 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        // Supabase query 시작
        let query = supabase
            .from('employees')
            .select('*', { count: 'exact' });

        // 검색 기능
        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,position.ilike.%${search}%,project.ilike.%${search}%`);
        }

        // 최신순 정렬
        query = query.order('created_at', { ascending: false });

        // 페이지네이션
        const startIndex = (page - 1) * limit;
        query = query.range(startIndex, startIndex + limit - 1);

        const { data: employeesData, error, count } = await query;

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { success: false, message: "데이터베이스 조회 중 오류가 발생했습니다." },
                { status: 500 }
            );
        }

        // 데이터 형식 변환 (Supabase 컬럼명 -> 프론트엔드 형식)
        const formattedEmployees = employeesData?.map(emp => ({
            id: emp.id,
            name: emp.name,
            email: emp.email,
            gender: emp.gender,
            position: emp.position,
            project: emp.project,
            startDate: emp.start_date,
            endDate: emp.end_date,
            grade: emp.grade,
            isFirstLogin: emp.is_first_login,
            createdAt: emp.created_at,
            updatedAt: emp.updated_at
        })) || [];

        const response: EmployeeResponse = {
            success: true,
            message: "인사정보 목록을 성공적으로 조회했습니다.",
            data: formattedEmployees,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            }
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Get employees error:', error);
        return NextResponse.json(
            { success: false, message: "인사정보 목록 조회 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

// POST: 인사정보 등록
export async function POST(request: NextRequest) {
    try {
        const body: EmployeeFormData = await request.json();
        const { name, email, gender, position, project, startDate, endDate, grade } = body;

        // 입력 검증
        if (!name || !email || !gender || !position || !project || !startDate || !grade) {
            return NextResponse.json(
                { success: false, message: "필수 항목을 모두 입력해주세요." },
                { status: 400 }
            );
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: "올바른 이메일 형식을 입력해주세요." },
                { status: 400 }
            );
        }

        // 중복 이메일 체크
        const existingEmployee = employees.find(emp => emp.email === email);
        if (existingEmployee) {
            return NextResponse.json(
                { success: false, message: "이미 등록된 이메일입니다." },
                { status: 400 }
            );
        }

        // 새 직원 생성 (비밀번호는 0000으로 설정, 첫 로그인 여부는 true)
        const newEmployee = {
            id: (employees.length + 1).toString(),
            name,
            email,
            password: "0000", // 초기 비밀번호는 항상 0000
            gender,
            position,
            project,
            startDate,
            endDate: endDate || undefined,
            grade,
            isFirstLogin: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        addEmployee(newEmployee);

        const response: EmployeeResponse = {
            success: true,
            message: "인사정보가 성공적으로 등록되었습니다. 초기 비밀번호는 0000입니다.",
            data: newEmployee
        };

        return NextResponse.json(response, { status: 201 });

    } catch (error) {
        console.error('Create employee error:', error);
        return NextResponse.json(
            { success: false, message: "인사정보 등록 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
