"use client";

import { useMemo, useState, useEffect } from "react";

// 프로필 아바타 컴포넌트
function ProfileAvatar({ name, className = "" }: { name: string; className?: string }) {
  const initial = name ? name.charAt(0) : "?";
  return (
    <div className={`flex items-center justify-center rounded-full bg-neutral-200 font-bold text-neutral-600 ${className}`}>
      {initial}
    </div>
  );
}

// 탭 카테고리
type TabCategory = "all" | "activity" | "follows" | "letters";
// 실제 알림 데이터 카테고리
type Category = "comments" | "likes" | "follows" | "letters";

type Notification = {
  id: number;
  category: Category;
  title: string;
  content: string;
  createdAt: string;
  senderName: string; // 프로필 생성을 위한 발신자 이름 추가
  isRead: boolean;    // 안 읽음(파란 점) 여부 추가
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    category: "comments",
    title: "새 코멘트",
    content: "민지가 내 일기에 코멘트를 남겼어요.",
    createdAt: "오늘 오후 2:10",
    senderName: "민지",
    isRead: false, // 새로운 알림 (파란 점 표시)
  },
  {
    id: 2,
    category: "likes",
    title: "새 공감",
    content: "수빈이 내 일기에 공감했어요.",
    createdAt: "오늘 오전 10:24",
    senderName: "수빈",
    isRead: false, // 새로운 알림
  },
  {
    id: 3,
    category: "follows",
    title: "새 팔로워",
    content: "은혜가 나를 팔로우했어요.",
    createdAt: "어제 오후 8:02",
    senderName: "은혜",
    isRead: true, // 읽은 알림 (파란 점 없음)
  },
  {
    id: 4,
    category: "letters",
    title: "편지 도착",
    content: "나에게 보낸 편지가 도착했어요.",
    createdAt: "3일 전",
    senderName: "나",
    isRead: true,
  },
  {
    id: 5,
    category: "comments",
    title: "새 코멘트",
    content: "준호가 내 일기에 코멘트를 남겼어요.",
    createdAt: "4일 전",
    senderName: "준호",
    isRead: true,
  },
  {
    id: 6,
    category: "likes",
    title: "새 공감",
    content: "하린이 내 일기에 공감했어요.",
    createdAt: "5일 전",
    senderName: "하린",
    isRead: true,
  },
];

const tabs: { label: string; value: TabCategory }[] = [
  { label: "전체", value: "all" },
  { label: "활동", value: "activity" },
  { label: "팔로우", value: "follows" },
  { label: "편지", value: "letters" },
];

const PER_PAGE = 5;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tab, setTab] = useState<TabCategory>("all");
  const [page, setPage] = useState(1);

  // 초기 데이터 로드 및 '다음에 들어왔을 때 읽음 처리' 로직
  useEffect(() => {
    const saved = localStorage.getItem("somedays_notifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(initialNotifications);
    }

    // 현재 접속했으므로(마운트), 백그라운드에서는 데이터를 '읽음(isRead: true)' 처리하여 저장
    const timer = setTimeout(() => {
      const currentSaved = localStorage.getItem("somedays_notifications");
      const dataToMark = currentSaved ? JSON.parse(currentSaved) : initialNotifications;
      const markedAsRead = dataToMark.map((n: Notification) => ({ ...n, isRead: true }));
      localStorage.setItem("somedays_notifications", JSON.stringify(markedAsRead));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    if (tab === "all") return notifications;
    if (tab === "activity") {
      return notifications.filter(
        (item) => item.category === "comments" || item.category === "likes"
      );
    }
    return notifications.filter((item) => item.category === tab);
  }, [notifications, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function changeTab(nextTab: TabCategory) {
    setTab(nextTab);
    setPage(1);
  }

  function deleteNotification(id: number) {
    const updated = notifications.filter((item) => item.id !== id);
    setNotifications(updated);
    localStorage.setItem("somedays_notifications", JSON.stringify(updated));
  }

  function deleteAllNotifications() {
    setNotifications([]);
    setPage(1);
    localStorage.setItem("somedays_notifications", JSON.stringify([]));
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-12 py-8 text-[#111]">
      <div className="mx-auto max-w-[980px]">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Notifications</h1>
            <p className="mt-1 text-neutral-500">
              활동, 팔로우, 편지 알림을 확인해요.
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={deleteAllNotifications}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
            >
              전체 삭제
            </button>
          )}
        </header>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex gap-2">
            {tabs.map((item) => (
              <button
                key={item.value}
                onClick={() => changeTab(item.value)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition ${
                  tab === item.value
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {paginated.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-neutral-100 bg-[#FAFAFA] p-5 transition hover:border-neutral-200"
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="flex items-start gap-4">
                    {/* 프로필 이미지 컴포넌트 */}
                    <ProfileAvatar name={item.senderName} className="h-10 w-10 text-sm shrink-0" />
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold">{item.title}</h2>

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-neutral-400">
                            {item.createdAt}
                          </span>
                          {/* 개별 알림 날짜/시간 옆 파란 점 표시 */}
                          {!item.isRead && (
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                          )}
                        </div>
                      </div>

                      <p className="mt-1 text-sm text-neutral-600">
                        {item.content}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteNotification(item.id)}
                    className="shrink-0 text-xs text-neutral-400 hover:text-red-500 transition"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-16 text-center text-sm text-neutral-400">
                알림이 없어요.
              </div>
            )}
          </div>

          {filtered.length > PER_PAGE && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className={`h-9 w-9 flex items-center justify-center rounded-full border text-sm transition ${
                  page === 1
                    ? "border-neutral-200 text-neutral-300"
                    : "border-neutral-300 text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`h-9 w-9 flex items-center justify-center rounded-full text-sm transition ${
                      page === pageNumber
                        ? "bg-black text-white"
                        : "border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                disabled={page === totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                className={`h-9 w-9 flex items-center justify-center rounded-full border text-sm transition ${
                  page === totalPages
                    ? "border-neutral-200 text-neutral-300"
                    : "border-neutral-300 text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                ›
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}