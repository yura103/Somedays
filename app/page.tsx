"use client";

import Link from "next/link";
import { useState } from "react";
import { Monitor } from "lucide-react";

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

function InitialAvatar({ label }: { label: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-sm font-medium">
      {label}
    </div>
  );
}

function FriendPreview({ members }: { members: Member[] }) {
  const visible =
    members.length > 3
      ? [{ id: "more", name: "..." }, ...members.slice(-2)]
      : members;

  return (
    <div className="flex -space-x-2">
      {visible.map((member) => (
        <InitialAvatar
          key={member.id}
          label={member.name === "..." ? "..." : member.name[0]}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isDesktopInstalled, setIsDesktopInstalled] = useState(false);
  const [friendModal, setFriendModal] = useState<FriendTab | null>(null);
  const [friendSearch, setFriendSearch] = useState("");
  const [followers, setFollowers] = useState<Member[]>(initialFollowers);
  const [following, setFollowing] = useState<Member[]>(initialFollowing);

  const followingIds = following.map((member) => member.id);

  const filteredAllMembers = somedayMembers.filter((member) =>
    `${member.name} ${member.id}`
      .toLowerCase()
      .includes(friendSearch.toLowerCase())
  );

  function followMember(member: Member) {
    if (followingIds.includes(member.id)) return;
    setFollowing((prev) => [...prev, member]);
  }

  function unfollowMember(id: string) {
    setFollowing((prev) => prev.filter((member) => member.id !== id));
  }

  function removeFollower(id: string) {
    setFollowers((prev) => prev.filter((member) => member.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-12 py-10 text-[#111]">
      <div className="mx-auto max-w-[1480px]">
        <header className="flex items-start justify-between gap-6">
          <div>
            <p className="text-neutral-500">Welcome back</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight">
              오늘의 마음과 미래의 편지를 남겨보세요.
            </h1>
          </div>

          <div className="flex gap-3">
            {!isDesktopInstalled && (
              <button
                onClick={() => setIsDesktopInstalled(true)}
                className="flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm text-white"
              >
                <Monitor size={18} />
                데스크탑앱
              </button>
            )}

            {isLoggedIn ? (
              <button
                onClick={() => setIsLoggedIn(false)}
                className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm"
              >
                로그아웃
              </button>
            ) : (
              <>
                <button className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm">
                  로그인
                </button>
                <button className="rounded-2xl bg-black px-5 py-3 text-sm text-white">
                  회원가입
                </button>
              </>
            )}
          </div>
        </header>

        <section className="mt-10 grid grid-cols-[0.9fr_1.1fr] gap-6">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-3xl border border-neutral-200 bg-white p-7">
                <p className="text-sm text-neutral-500">Journal</p>
                <h2 className="mt-5 text-4xl font-semibold">24개</h2>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-7">
                <p className="text-sm text-neutral-500">Letters</p>
                <h2 className="mt-5 text-4xl font-semibold">12개</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <button
                onClick={() => setFriendModal("followers")}
                className="rounded-3xl border border-neutral-200 bg-white p-7 text-left transition hover:-translate-y-0.5 hover:border-black hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-500">Followers</p>
                  <span className="text-sm text-neutral-400">→</span>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <h2 className="text-4xl font-semibold">{followers.length}</h2>
                  <FriendPreview members={followers} />
                </div>
              </button>

              <button
                onClick={() => setFriendModal("following")}
                className="rounded-3xl border border-neutral-200 bg-white p-7 text-left transition hover:-translate-y-0.5 hover:border-black hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-500">Following</p>
                  <span className="text-sm text-neutral-400">→</span>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <h2 className="text-4xl font-semibold">{following.length}</h2>
                  <FriendPreview members={following} />
                </div>
              </button>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-7">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-3xl font-semibold leading-tight">
                  Quick
                  <br />
                  Start
                </h2>

                <p className="rounded-full bg-neutral-100 px-5 py-3 text-sm text-neutral-500">
                  오늘 아직 기록 전
                </p>
              </div>

              <div className="mt-7 flex gap-3">
                <Link
                  href="/journal"
                  className="rounded-2xl border border-neutral-300 px-7 py-5 text-sm font-medium"
                >
                  Write
                  <br />
                  Journal
                </Link>

                <Link
                  href="/letters/write"
                  className="rounded-2xl bg-black px-7 py-5 text-sm font-medium text-white"
                >
                  Write
                  <br />
                  Letter
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold">이번 달 기록 흐름</h2>
              <span className="text-sm text-neutral-400">2025년 5월</span>
            </div>

            <div className="mt-8 grid grid-cols-7 gap-3 text-center text-xs text-neutral-400">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-7 gap-3 text-center text-sm">
              {Array.from({ length: 31 }, (_, index) => index + 1).map(
                (day) => (
                  <div
                    key={day}
                    className={`flex h-11 items-center justify-center rounded-full ${
                      isWritten(day)
                        ? "bg-black text-white"
                        : "bg-neutral-50 text-neutral-400"
                    }`}
                  >
                    {day}
                  </div>
                )
              )}
            </div>

            <div className="mt-8 grid grid-cols-3 divide-x divide-neutral-100 rounded-2xl bg-[#FAFAFA] p-5 text-center text-sm">
              <div>
                <p className="text-neutral-400">이번 달</p>
                <strong className="mt-1 block">{writtenDays.length}개</strong>
              </div>

              <div>
                <p className="text-neutral-400">연속 기록</p>
                <strong className="mt-1 block">12일</strong>
              </div>

              <div>
                <p className="text-neutral-400">최근 공감</p>
                <strong className="mt-1 block">13개</strong>
              </div>
            </div>
          </div>
        </section>

        {friendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <div className="w-[520px] rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {friendModal === "followers" ? "Followers" : "Following"}
                </h2>

                <button
                  onClick={() => {
                    setFriendModal(null);
                    setFriendSearch("");
                  }}
                  className="text-neutral-400"
                >
                  ✕
                </button>
              </div>

              {friendModal === "following" && (
                <input
                  value={friendSearch}
                  onChange={(e) => setFriendSearch(e.target.value)}
                  className="mt-5 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none"
                  placeholder="Someday 전체 회원을 ID 또는 닉네임으로 검색"
                />
              )}

              <div className="mt-5 space-y-3">
                {friendModal === "followers" &&
                  followers.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between rounded-2xl bg-neutral-50 px-5 py-4"
                    >
                      <div>
                        <p className="font-medium">{friend.name}</p>
                        <p className="text-sm text-neutral-400">{friend.id}</p>
                      </div>

                      <button
                        onClick={() => removeFollower(friend.id)}
                        className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500 hover:border-red-200 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                {friendModal === "following" &&
                  filteredAllMembers.map((member) => {
                    const isFollowing = followingIds.includes(member.id);

                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-2xl bg-neutral-50 px-5 py-4"
                      >
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-neutral-400">
                            {member.id}
                          </p>
                        </div>

                        {isFollowing ? (
                          <button
                            onClick={() => unfollowMember(member.id)}
                            className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500 hover:border-red-200 hover:text-red-500"
                          >
                            ✕
                          </button>
                        ) : (
                          <button
                            onClick={() => followMember(member)}
                            className="rounded-full bg-black px-3 py-1 text-xs text-white"
                          >
                            팔로잉
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}