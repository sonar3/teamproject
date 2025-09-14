"use client";
import { useState } from 'react';

export default function DebugPage() {
    const [testEmail, setTestEmail] = useState('lee@company.com');
    const [testPassword, setTestPassword] = useState('0000');
    const [result, setResult] = useState<any>(null);

    const testLogin = async () => {
        try {
            const response = await fetch('/api/hr/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: testEmail,
                    password: testPassword
                })
            });

            const data = await response.json();
            setResult(data);
            console.log('Test login result:', data);
        } catch (error) {
            console.error('Test login error:', error);
            setResult({ error: error.message });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">로그인 테스트 페이지</h1>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">이메일:</label>
                            <input
                                type="email"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">비밀번호:</label>
                            <input
                                type="password"
                                value={testPassword}
                                onChange={(e) => setTestPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        
                        <button
                            onClick={testLogin}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            로그인 테스트
                        </button>
                    </div>
                </div>

                {result && (
                    <div className="mt-6 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">결과:</h2>
                        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}

                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">테스트 계정:</h3>
                    <ul className="space-y-1 text-sm">
                        <li>• hong@company.com / 0000</li>
                        <li>• kim@company.com / 0000</li>
                        <li>• lee@company.com / 0000</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
