import { NextRequest, NextResponse } from "next/server";
import { DashboardData, DashboardResponse, NewsItem, WeatherInfo, Restaurant, VacationEmployee, BirthdayEmployee } from "@/app/lib/types/dashboard";
import { Employee } from "@/app/lib/types/hr";

// 임시 데이터 저장소
let adminKeywords = ['IT', '기술', '비즈니스', '스타트업', '인공지능'];
let adminLocation = '서울시 강남구';

// GET: 대시보드 데이터 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const userInterests = searchParams.get('interests')?.split(',') || [];

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "사용자 ID가 필요합니다." },
                { status: 400 }
            );
        }

        // 사용자 관심사와 관리자 키워드를 결합한 키워드 생성
        const allKeywords = [...new Set([...adminKeywords, ...userInterests])];

        // 뉴스 데이터 생성 (실제로는 뉴스 API 호출)
        const news: NewsItem[] = [
            {
                id: "1",
                title: "AI 기술 발전으로 업무 효율성 크게 향상",
                description: "최근 인공지능 기술의 발전으로 기업들의 업무 효율성이 크게 향상되고 있다는 보고서가 발표되었습니다.",
                url: "https://example.com/news/1",
                publishedAt: new Date().toISOString(),
                source: "테크뉴스",
                imageUrl: "https://via.placeholder.com/300x200",
                keywords: ["AI", "기술", "비즈니스"]
            },
            {
                id: "2",
                title: "스타트업 투자 규모 전년 대비 20% 증가",
                description: "올해 스타트업 투자 규모가 전년 대비 20% 증가한 것으로 나타났습니다.",
                url: "https://example.com/news/2",
                publishedAt: new Date(Date.now() - 3600000).toISOString(),
                source: "비즈니스뉴스",
                imageUrl: "https://via.placeholder.com/300x200",
                keywords: ["스타트업", "투자", "비즈니스"]
            },
            {
                id: "3",
                title: "클라우드 컴퓨팅 시장 급성장",
                description: "클라우드 컴퓨팅 시장이 예상보다 빠른 속도로 성장하고 있습니다.",
                url: "https://example.com/news/3",
                publishedAt: new Date(Date.now() - 7200000).toISOString(),
                source: "IT뉴스",
                imageUrl: "https://via.placeholder.com/300x200",
                keywords: ["클라우드", "IT", "기술"]
            },
            {
                id: "4",
                title: "원격근무 문화 확산으로 생산성 향상",
                description: "원격근무 문화가 확산되면서 오히려 생산성이 향상되는 결과가 나타났습니다.",
                url: "https://example.com/news/4",
                publishedAt: new Date(Date.now() - 10800000).toISOString(),
                source: "워크플레이스뉴스",
                imageUrl: "https://via.placeholder.com/300x200",
                keywords: ["원격근무", "생산성", "비즈니스"]
            },
            {
                id: "5",
                title: "데이터 사이언스 인력 수요 급증",
                description: "데이터 사이언스 분야의 인력 수요가 급증하고 있어 관련 교육 프로그램이 주목받고 있습니다.",
                url: "https://example.com/news/5",
                publishedAt: new Date(Date.now() - 14400000).toISOString(),
                source: "데이터뉴스",
                imageUrl: "https://via.placeholder.com/300x200",
                keywords: ["데이터", "AI", "교육"]
            }
        ].slice(0, 10);

        // 날씨 정보 생성 (실제로는 날씨 API 호출)
        const weather: WeatherInfo = {
            location: adminLocation,
            temperature: 22,
            condition: "맑음",
            humidity: 65,
            windSpeed: 3.2,
            description: "오늘은 맑은 날씨가 예상됩니다.",
            icon: "☀️"
        };

        // 맛집 정보 생성 (실제로는 맛집 API 호출)
        const restaurants: Restaurant[] = [
            {
                id: "1",
                name: "맛있는 한식당",
                category: "한식",
                rating: 4.5,
                distance: "200m",
                address: "서울시 강남구 테헤란로 123",
                phone: "02-1234-5678",
                imageUrl: "https://via.placeholder.com/200x150",
                priceRange: "1만원 이하",
                description: "정통 한식 요리를 맛볼 수 있는 가게입니다."
            },
            {
                id: "2",
                name: "이탈리안 파스타",
                category: "양식",
                rating: 4.3,
                distance: "350m",
                address: "서울시 강남구 테헤란로 456",
                phone: "02-2345-6789",
                imageUrl: "https://via.placeholder.com/200x150",
                priceRange: "1-2만원",
                description: "정통 이탈리안 파스타와 피자를 제공합니다."
            },
            {
                id: "3",
                name: "스시 마스터",
                category: "일식",
                rating: 4.7,
                distance: "500m",
                address: "서울시 강남구 테헤란로 789",
                phone: "02-3456-7890",
                imageUrl: "https://via.placeholder.com/200x150",
                priceRange: "2-3만원",
                description: "신선한 생선으로 만드는 정통 스시집입니다."
            },
            {
                id: "4",
                name: "카페 드 프랑스",
                category: "카페",
                rating: 4.2,
                distance: "150m",
                address: "서울시 강남구 테헤란로 101",
                phone: "02-4567-8901",
                imageUrl: "https://via.placeholder.com/200x150",
                priceRange: "5천원 이하",
                description: "분위기 좋은 프랑스 스타일 카페입니다."
            }
        ];

        // 휴가자 정보 생성 (실제로는 데이터베이스에서 조회)
        const vacationEmployees: VacationEmployee[] = [
            {
                id: "2",
                name: "김철수",
                startDate: "2024-01-20",
                endDate: "2024-01-22",
                reason: "가족여행",
                type: "연차"
            },
            {
                id: "3",
                name: "이영희",
                startDate: "2024-01-21",
                endDate: "2024-01-21",
                reason: "개인사정",
                type: "연차"
            }
        ];

        // 생일자 정보 생성 (실제로는 데이터베이스에서 조회)
        const today = new Date();
        const birthdayEmployees: BirthdayEmployee[] = [
            {
                id: "1",
                name: "홍길동",
                birthday: "1990-01-20",
                age: 34,
                position: "대표이사",
                department: "경영진",
                profileImage: "https://via.placeholder.com/100x100"
            },
            {
                id: "4",
                name: "박민수",
                birthday: "1985-01-20",
                age: 39,
                position: "과장",
                department: "개발팀",
                profileImage: "https://via.placeholder.com/100x100"
            }
        ];

        const dashboardData: DashboardData = {
            news,
            weather,
            restaurants,
            vacationEmployees,
            birthdayEmployees,
            userInterests,
            adminKeywords
        };

        const response: DashboardResponse = {
            success: true,
            message: "대시보드 데이터를 성공적으로 조회했습니다.",
            data: dashboardData
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Get dashboard data error:', error);
        return NextResponse.json(
            { success: false, message: "대시보드 데이터 조회 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
