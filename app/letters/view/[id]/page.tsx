
"use client";

import { useState } from "react";

interface Letter {
  title: string;
  content: string;
}

export default function LetterViewPage({ params }: { params: { id: string } }) {
  const [password, setPassword] = useState("");
  const [letterData, setLetterData] = useState<Letter | null>(null); 
  const [error, setError] = useState("");

  const handleVerify = async () => {
    // 실제로는 여기서 API 호출을 합니다. 예: /api/verify-letter
    // fetch(`/api/verify-letter?id=${params.id}&password=${password}`)
    
    // [예시 로직]
    if (password === "설정해둔비밀번호") {
      setLetterData({ title: "도착한 편지", content: "편지 본문 내용입니다..." });
      setError("");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  if (!letterData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="w-full max-w-sm p-8 bg-white rounded-3xl border border-neutral-100 text-center">
          <h2 className="text-xl font-bold mb-6">편지 열람 비밀번호</h2>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-neutral-200 rounded-xl mb-4"
            placeholder="비밀번호를 입력하세요"
          />
          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
          <button onClick={handleVerify} className="w-full py-3 bg-black text-white rounded-xl">
            열람하기
          </button>
        </div>
      </div>
    );
  }

  // 인증 성공 시 실제 편지 내용 표시
  return (
    <div className="max-w-2xl mx-auto p-10">
      <h1 className="text-2xl font-bold">{letterData.title}</h1>
      <p className="mt-4">{letterData.content}</p>
    </div>
  );
}