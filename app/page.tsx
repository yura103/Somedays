"use client";

import Link from "next/link";
import { useState } from "react";
import { Monitor } from "lucide-react";

// 프로필 아바타 컴포넌트
function ProfileAvatar({ name, className = "" }: { name: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-neutral-200 font-bold text-neutral-600 ${className}`}>
      {name.charAt(0)}
    </div>
  );
}

type FriendTab = "followers" | "following";
type Member = { id: string; name: string };

const initialFollowers: Member[] = [
  { id: "@minji", name: "민지" },
  { id: "@eunhye", name: "은혜" },
  { id: "@subin", name: "수빈" },
  { id: "@yewon", name: "예원" },
];

const initialFollowing: Member[] = [
  { id: "@harin", name: "하린" },
  { id: "@junho", name: "준호" },
];

const somedayMembers: Member[] = [
  { id: "@minji", name: "민지" },
  { id: "@eunhye", name: "은혜" },
  { id: "@subin", name: "수빈" },
  { id: "@yewon", name: "예원" },
  { id: "@harin", name: "하린" },
  { id: "@junho", name: "준호" },
  { id: "@sua", name: "수아" },
];

const writtenDays = [3, 7, 8, 12, 18, 22, 27];

function isWritten(day: number) {
  return writtenDays.includes(day);
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isDesktopInstalled, setIsDesktopInstalled] = useState(false);
  const [friendModal, setFriendModal] = useState<FriendTab | null>(null);
  const [friendSearch, setFriendSearch] = useState("");
  const [followers, setFollowers] = useState<Member[]>(initialFollowers);
  const [following, setFollowing] = useState<Member[]>(initialFollowing);

  const followingIds = following.map((m) => m.id);

  const filteredAllMembers = somedayMembers.filter((m) =>
    `${m.name} ${m.id}`.toLowerCase().includes(friendSearch.toLowerCase())
  );

  function followMember(member: Member) {
    setFollowing((prev) => [...prev, member]);
  }

  function handleUnfollow(id: string) {
    if (confirm("정말 삭제하시겠습니까?")) {
      setFollowing((prev) => prev.filter((m) => m.id !== id));
    }
  }

  function handleRemoveFollower(id: string) {
    if (confirm("정말 삭제하시겠습니까?")) {
      setFollowers((prev) => prev.filter((m) => m.id !== id));
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-6 py-10 text-[#111]">
      <div className="mx-auto max-w-[1000px]">
        <header className="flex items-start justify-between mb-12">
          <div>
            <p className="text-neutral-500">Welcome back</p>
            <h1 className="mt-2 text-2xl font-semibold leading-tight">오늘의 마음과 미래의 편지를 남겨보세요.</h1>
          </div>
          <div className="flex gap-3">
            {!isDesktopInstalled && (
              <button onClick={() => setIsDesktopInstalled(true)} className="flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm text-white">
                <Monitor size={18} /> 데스크탑앱
              </button>
            )}
            {isLoggedIn ? (
              <button onClick={() => setIsLoggedIn(false)} className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm">로그아웃</button>
            ) : (
              <button className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm">로그인</button>
            )}
          </div>
        </header>

        <section className="grid grid-cols-[1fr_0.8fr] gap-10">
          <div className="space-y-6">
            {/* 통계 카드 */}
            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-3xl border border-neutral-200 bg-white p-7">
                <p className="text-sm text-neutral-500">Journal</p>
                <h2 className="mt-2 text-2xl font-semibold">24개</h2>
              </div>
              <div className="rounded-3xl border border-neutral-200 bg-white p-7">
                <p className="text-sm text-neutral-500">Letters</p>
                <h2 className="mt-2 text-2xl font-semibold">12개</h2>
              </div>
            </div>

            {/* 팔로워/팔로잉 카드 */}
            <div className="grid grid-cols-2 gap-5">
              <button onClick={() => setFriendModal("followers")} className="rounded-3xl border border-neutral-200 bg-white p-7 text-left">
                <p className="text-sm text-neutral-500">Followers</p>
                <h2 className="mt-2 text-2xl font-semibold">{followers.length}</h2>
              </button>
              <button onClick={() => setFriendModal("following")} className="rounded-3xl border border-neutral-200 bg-white p-7 text-left">
                <p className="text-sm text-neutral-500">Following</p>
                <h2 className="mt-2 text-2xl font-semibold">{following.length}</h2>
              </button>
            </div>

            {/* Quick Start */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-7">
              <h2 className="text-xl font-semibold mb-5">Quick Start</h2>
              <div className="flex gap-3">
                <Link href="/journal" className="flex-1 rounded-2xl border border-neutral-300 py-4 text-center text-sm">Write Journal</Link>
                <Link href="/letters/write" className="flex-1 rounded-2xl bg-black text-white py-4 text-center text-sm">Write Letter</Link>
              </div>
            </div>
          </div>

          {/* 달력 섹션 */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-8">
            <h2 className="text-lg font-semibold mb-6">이번 달 기록 흐름</h2>
            <div className="mb-8 grid grid-cols-3 divide-x divide-neutral-100 rounded-2xl bg-[#FAFAFA] p-5 text-center text-xs">
              <div><p className="text-neutral-400 mb-1">이번 달</p><strong>{writtenDays.length}개</strong></div>
              <div><p className="text-neutral-400 mb-1">연속 기록</p><strong>12일</strong></div>
              <div><p className="text-neutral-400 mb-1">최근 공감</p><strong>13개</strong></div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-neutral-400 mb-3">
              {["일", "월", "화", "수", "목", "금", "토"].map((d) => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <div key={d} className={`flex h-8 w-8 items-center justify-center rounded-full mx-auto ${isWritten(d) ? "bg-black text-white" : "bg-neutral-50 text-neutral-400"}`}>
                  {d}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 팔로워/팔로잉 모달 */}
        {friendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <div className="w-[450px] rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex justify-between mb-5">
                <h2 className="text-lg font-semibold">{friendModal === "followers" ? "Followers" : "Following"}</h2>
                <button onClick={() => { setFriendModal(null); setFriendSearch(""); }}>✕</button>
              </div>
              {friendModal === "following" && (
                <input value={friendSearch} onChange={(e) => setFriendSearch(e.target.value)} className="w-full rounded-xl border p-3 mb-4 text-sm" placeholder="ID 또는 닉네임 검색" />
              )}
              <div className="max-h-[350px] overflow-y-auto space-y-2">
                {friendModal === "followers" ? (
                  followers.map((f) => (
                    <div key={f.id} className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <ProfileAvatar name={f.name} className="h-9 w-9 text-xs" />
                        <div><p className="text-sm font-bold">{f.name}</p><p className="text-xs text-neutral-400">{f.id}</p></div>
                      </div>
                      <button onClick={() => handleRemoveFollower(f.id)} className="text-xs text-red-500 font-bold">삭제</button>
                    </div>
                  ))
                ) : (
                  (friendSearch === "" ? following : filteredAllMembers.sort((a, b) => followingIds.includes(a.id) === followingIds.includes(b.id) ? 0 : followingIds.includes(a.id) ? -1 : 1))
                  .map((m) => (
                    <div key={m.id} className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <ProfileAvatar name={m.name} className="h-9 w-9 text-xs" />
                        <div><p className="text-sm font-bold">{m.name}</p><p className="text-xs text-neutral-400">{m.id}</p></div>
                      </div>
                      {followingIds.includes(m.id) ? (
                        <button onClick={() => handleUnfollow(m.id)} className="text-xs text-red-500 font-bold">삭제</button>
                      ) : (
                        <button onClick={() => followMember(m)} className="text-xs bg-black text-white px-3 py-1 rounded-full">팔로우</button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}