// 대시보드 관련 타입 정의

export interface NewsItem {
    id: string;
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    source: string;
    imageUrl?: string;
    keywords: string[];
}

export interface WeatherInfo {
    location: string;
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
}

export interface Restaurant {
    id: string;
    name: string;
    category: string;
    rating: number;
    distance: string;
    address: string;
    phone?: string;
    imageUrl?: string;
    priceRange: string;
    description: string;
}

export interface VacationEmployee {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    reason: string;
    type: string; // 연차, 병가, 출산휴가 등
}

export interface BirthdayEmployee {
    id: string;
    name: string;
    birthday: string;
    age: number;
    position: string;
    department: string;
    profileImage?: string;
}

export interface DashboardData {
    news: NewsItem[];
    weather: WeatherInfo;
    restaurants: Restaurant[];
    vacationEmployees: VacationEmployee[];
    birthdayEmployees: BirthdayEmployee[];
    userInterests: string[];
    adminKeywords: string[];
}

export interface DashboardResponse {
    success: boolean;
    message: string;
    data?: DashboardData;
}

// 관리자 키워드 설정
export interface AdminKeywordSettings {
    keywords: string[];
    location: string;
    newsCount: number;
}

export interface AdminSettingsResponse {
    success: boolean;
    message: string;
    data?: AdminKeywordSettings;
}

// 뉴스 카테고리
export const NEWS_CATEGORIES = [
    '기술',
    '비즈니스',
    '정치',
    '경제',
    '스포츠',
    '문화',
    '사회',
    '국제',
    'IT',
    '과학'
] as const;

// 날씨 조건
export const WEATHER_CONDITIONS = [
    '맑음',
    '흐림',
    '비',
    '눈',
    '구름많음',
    '소나기',
    '안개',
    '황사'
] as const;

// 맛집 카테고리
export const RESTAURANT_CATEGORIES = [
    '한식',
    '중식',
    '일식',
    '양식',
    '카페',
    '베이커리',
    '패스트푸드',
    '분식',
    '치킨',
    '피자'
] as const;

// 휴가 타입
export const VACATION_TYPES = [
    '연차',
    '병가',
    '경조사',
    '출산휴가',
    '육아휴가',
    '교육휴가',
    '기타'
] as const;
