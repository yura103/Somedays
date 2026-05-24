"use client";

import Link from "next/link";
import { useState } from "react";

const initialJournals = [
  {
    id: 1,
    date: "2025.05.27",
    createdAt: "2025.05.27 오후 10:45",
    title: "조금 괜찮았던 하루",
    content: "오늘은 생각보다 마음이 조용했다.",
    status: "saved",
  },
  {
    id: 2,
    date: "2025.05.22",
    createdAt: "2025.05.22 오후 9:20",
    title: "해야 할 말",
    content: "계속 미뤄둔 말을 적어봤다.",
    status: "draft",
  },
  {
    id: 3,
    date: "2025.05.18",
    createdAt: "2025.05.18 오후 11:02",
    title: "불안했지만",
    content: "불안한 마음도 기록해두면 조금 멀어진다.",
    status: "saved",
  },
];

export default function JournalListPage() {
  const [journals, setJournals] = useState(initialJournals);
  const [search, setSearch] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filtered = journals.filter((journal) =>
    `${journal.date} ${journal.createdAt} ${journal.title}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function deleteSelected() {
    // 일기는 원본 삭제: 공개 피드, 댓글, 공감, 조회 기록도 DB에서는 같이 삭제되는 개념
    setJournals((prev) =>
      prev.filter((journal) => !selectedIds.includes(journal.id))
    );

    setSelectedIds([]);
    setSelectionMode(false);
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] p-10 text-[#111]">
      <Link href="/journal" className="text-sm text-neutral-500">
        ← Journal로
      </Link>

      <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">전체 기록</h1>
            <p className="mt-1 text-sm text-neutral-400">
              삭제하면 공개 여부와 관계없이 원본 기록이 완전히 삭제돼요.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none"
              placeholder="제목, 날짜, 작성일시 검색"
            />

            <button
              onClick={() => {
                setSelectionMode((prev) => !prev);
                setSelectedIds([]);
              }}
              className={`rounded-full px-4 py-2 text-sm ${
                selectionMode
                  ? "bg-black text-white"
                  : "border border-neutral-200 text-neutral-500"
              }`}
            >
              선택
            </button>

            {selectionMode && selectedIds.length > 0 && (
              <button
                onClick={deleteSelected}
                className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-500"
              >
                삭제
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {filtered.map((journal) => (
            <div
              key={journal.id}
              className={`grid items-center rounded-2xl border border-neutral-200 p-5 hover:border-black ${
                selectionMode
                  ? "grid-cols-[36px_150px_1fr_24px]"
                  : "grid-cols-[150px_1fr_24px]"
              }`}
            >
              {selectionMode && (
                <button
                  onClick={() => toggleSelect(journal.id)}
                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                    selectedIds.includes(journal.id)
                      ? "border-black bg-black text-white"
                      : "border-neutral-300"
                  }`}
                >
                  {selectedIds.includes(journal.id) && "✓"}
                </button>
              )}

              <div>
                <p className="text-base font-medium text-neutral-500">
                  {journal.date}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  작성 {journal.createdAt}
                </p>
              </div>

              <Link href={`/journal/${journal.id}?from=list`} className="block">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{journal.title}</p>

                  {journal.status === "draft" && (
                    <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-500">
                      임시저장
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-neutral-500">
                  {journal.content}
                </p>
              </Link>

              <Link
                href={`/journal/${journal.id}?from=list`}
                className="text-neutral-400"
              >
                ›
              </Link>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-16 text-center text-sm text-neutral-400">
              기록이 없어요.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}