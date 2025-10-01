// components/Navbar.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore, checkAuthStatus } from "@/app/lib/authStore";
import { getFilteredMenus } from "@/app/lib/types/menu";

interface IaSubItem {
    name: string;
    screenId: string;
    path: string;
    fileName: string;
}

interface IaItem {
    link: string;
    id: number;
    Level1: string;
    screenId: string;
    path: string;
    fileName: string;
    Level2?: IaSubItem[];
}

interface IaData {
    siteName: string;
    IaList: IaItem[];
}

const Navbar = () => {
    const [iaData, setIaData] = useState<IaData | null>(null);
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuthStore();

    useEffect(() => {
        fetch("/ia.json")
        .then((response) => response.json())
        .then((data: IaData) => setIaData(data))
        .catch((error) => console.error("Error fetching IA data:", error));
        
        // 인증 상태 확인
        checkAuthStatus();
    }, []);

    if (pathname === "/" || pathname === "/admin/login") return null;

    return (
        <header className="w-full flex justify-between items-center guide-header__wrap">
        <h1 className="text-xl font-semibold Slate-50">
            <Link href="/">{iaData?.siteName || "Site Title"}</Link>
        </h1>
        <nav className="navi">
            <button></button>
            <ul>
            {getFilteredMenus(user?.grade, iaData).map((item: IaItem) => (
                <li key={item.id}>
                    <Link href={`${item.path}${item.link}`}>
                        {item.Level1}
                    </Link>
                </li>
            ))}
            </ul>
            
            {/* 인증 상태에 따른 사용자 메뉴 */}
            <div className="flex items-center gap-4 ml-8">
                {isAuthenticated && user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-white text-sm">
                            안녕하세요, {user.name}님 ({user.grade || '일반직원'})
                        </span>
                        <button
                            onClick={logout}
                            className="text-white text-sm hover:text-gray-200 transition-colors"
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <Link 
                        href="/admin/login"
                        className="text-white text-sm hover:text-gray-200 transition-colors"
                    >
                        로그인
                    </Link>
                )}
            </div>
        </nav>
        </header>
    );
};

export default Navbar;