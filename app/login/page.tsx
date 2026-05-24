"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] px-6 py-10">
      <div className="w-full max-w-md space-y-10">
        
        {/* 서비스 소개 영역 */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Somedays</h1>
          <p className="text-base text-neutral-600 leading-relaxed">
            오늘의 마음을 기록하는 일기부터,<br />
            미래의 나에게 보내는 편지까지.
          </p>
        </div>

        {/* 핵심 기능 강조 */}
        <div className="grid grid-cols-2 gap-3 text-xs text-neutral-500">
          <div className="rounded-2xl border border-neutral-200 p-4 bg-white">
            <p className="font-semibold text-black mb-1">미래 편지</p>
            나에게 마음을 전하세요.
          </div>
          <div className="rounded-2xl border border-neutral-200 p-4 bg-white">
            <p className="font-semibold text-black mb-1">일기 기록</p>
            조용한 기록을 쌓아가세요.
          </div>
          <div className="rounded-2xl border border-neutral-200 p-4 bg-white col-span-2">
            <p className="font-semibold text-black mb-1">공개 범위 설정</p>
            비공개, 팔로워 공개, 전체 공개로 제어하세요.
          </div>
        </div>

        {/* 로그인/가입 버튼 */}
        <div className="space-y-3">
          {/* Google: 가장 강조되는 메인 버튼 */}
          <button className="w-full rounded-2xl bg-black py-3.5 font-medium text-white transition hover:bg-neutral-800 text-sm shadow-md">
            Google로 시작하기
          </button>
          
          {/* Kakao: 브랜드 컬러 배경 적용 */}
          <button className="w-full rounded-2xl bg-[#FEE500] py-3.5 font-medium text-black transition hover:opacity-90 text-sm">
            Kakao로 시작하기
          </button>
          
          {/* Naver: 브랜드 컬러 배경 적용 */}
          <button className="w-full rounded-2xl bg-[#03C75A] py-3.5 font-medium text-white transition hover:opacity-90 text-sm">
            Naver로 시작하기
          </button>
          
          <p className="text-center text-[10px] text-neutral-400 pt-2">
            가입 시 Somedays의 이용약관 및 개인정보처리방침에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </main>
  );
}