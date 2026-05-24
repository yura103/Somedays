"use client";

import { useMemo, useState } from "react";

type Category = "all" | "comments" | "likes" | "follows" | "letters";

type Notification = {
  id: number;
  category: Exclude<Category, "all">;
  title: string;
  content: string;
  createdAt: string;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    category: "comments",
    title: "새 코멘트",
    content: "민지가 내 일기에 코멘트를 남겼어요.",
    createdAt: "오늘 오후 2:10",
  },
  {
    id: 2,
    category: "likes",
    title: "새 공감",
    content: "수빈이 내 일기에 공감했어요.",
    createdAt: "오늘 오전 10:24",
  },
  {
    id: 3,
    category: "follows",
    title: "새 팔로워",
    content: "은혜가 나를 팔로우했어요.",
    createdAt: "어제 오후 8:02",
  },
  {
    id: 4,
    category: "letters",
    title: "도착한 편지 미확인",
    content: "도착한 지 3일이 지난 편지가 있어요.",
    createdAt: "3일 전",
  },
  {
    id: 5,
    category: "comments",
    title: "새 코멘트",
    content: "준호가 내 일기에 코멘트를 남겼어요.",
    createdAt: "4일 전",
  },
  {
    id: 6,
    category: "likes",
    title: "새 공감",
    content: "하린이 내 일기에 공감했어요.",
    createdAt: "5일 전",
  },
];

const tabs: { label: string; value: Category }[] = [
  { label: "전체", value: "all" },
  { label: "코멘트", value: "comments" },
  { label: "공감", value: "likes" },
  { label: "팔로우", value: "follows" },
  { label: "편지", value: "letters" },
];

const PER_PAGE = 5;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [tab, setTab] = useState<Category>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (tab === "all") return notifications;
    return notifications.filter((item) => item.category === tab);
  }, [notifications, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function changeTab(nextTab: Category) {
    setTab(nextTab);
    setPage(1);
  }

  function deleteNotification(id: number) {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }

  function deleteAllNotifications() {
    setNotifications([]);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-12 py-8 text-[#111]">
      <div className="mx-auto max-w-[980px]">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Notifications</h1>
            <p className="mt-1 text-neutral-500">
              코멘트, 공감, 팔로우, 편지 리마인드를 확인해요.
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={deleteAllNotifications}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-500"
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
                className={`rounded-full px-4 py-2 text-sm ${
                  tab === item.value
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-neutral-500"
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
                className="rounded-2xl border border-neutral-100 bg-[#FAFAFA] p-5"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">{item.title}</h2>

                      <span className="text-xs text-neutral-400">
                        {item.createdAt}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-neutral-600">
                      {item.content}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteNotification(item.id)}
                    className="shrink-0 text-xs text-neutral-400 hover:text-black"
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
                className={`h-9 w-9 rounded-full border text-sm ${
                  page === 1
                    ? "border-neutral-200 text-neutral-300"
                    : "border-neutral-300 text-neutral-500"
                }`}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`h-9 w-9 rounded-full text-sm ${
                      page === pageNumber
                        ? "bg-black text-white"
                        : "border border-neutral-200 text-neutral-500"
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
                className={`h-9 w-9 rounded-full border text-sm ${
                  page === totalPages
                    ? "border-neutral-200 text-neutral-300"
                    : "border-neutral-300 text-neutral-500"
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