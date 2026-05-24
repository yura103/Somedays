"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Tab = "sent" | "received" | "saved";
type SentSort = "arrive" | "written" | "pendingFirst";
type ReceivedSort = "recent" | "oldest";

type Letter = {
  id: number;
  title: string;
  target: string;
  targetType: "me" | "someone";
  arriveDate: string;
  writtenDate: string;
  status: "임시저장" | "대기 중" | "도착 완료" | "읽음" | "미읽음";
  box: "sent" | "received";
  isBookmarked?: boolean;
};

const initialLetters: Letter[] = [
  {
    id: 1,
    title: "1년 뒤의 나에게",
    target: "나에게",
    targetType: "me",
    arriveDate: "2026.05.27",
    writtenDate: "2025.05.27",
    status: "대기 중",
    box: "sent",
  },
  {
    id: 2,
    title: "졸업하는 너에게",
    target: "민지에게",
    targetType: "someone",
    arriveDate: "2025.12.31",
    writtenDate: "2025.05.27",
    status: "대기 중",
    box: "sent",
  },
  {
    id: 3,
    title: "생일 축하해",
    target: "수빈에게",
    targetType: "someone",
    arriveDate: "2025.08.10",
    writtenDate: "2025.05.18",
    status: "임시저장",
    box: "sent",
    isBookmarked: true,
  },
  {
    id: 4,
    title: "26살의 나에게",
    target: "나에게",
    targetType: "me",
    arriveDate: "2025.05.18",
    writtenDate: "2024.05.18",
    status: "미읽음",
    box: "received",
  },
  {
    id: 5,
    title: "네가 잊지 않았으면 하는 말",
    target: "민지에게서",
    targetType: "someone",
    arriveDate: "2025.05.20",
    writtenDate: "2024.05.20",
    status: "읽음",
    box: "received",
    isBookmarked: true,
  },
];

function icon(type: "me" | "someone") {
  return type === "me" ? "✉️" : "🪽";
}

function dateValue(date: string) {
  return new Date(date.replaceAll(".", "-")).getTime();
}

export default function LettersPage() {
  const [letters, setLetters] = useState(initialLetters);
  const [tab, setTab] = useState<Tab>("sent");
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [readIds, setReadIds] = useState<number[]>([]);
  const [sentSort, setSentSort] = useState<SentSort>("pendingFirst");
  const [receivedSort, setReceivedSort] = useState<ReceivedSort>("recent");
  const [reverse, setReverse] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [page, setPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    setSavedIds(JSON.parse(localStorage.getItem("savedLetters") || "[]"));
    setReadIds(JSON.parse(localStorage.getItem("readLetters") || "[]"));
  }, []);

  const upcoming = letters
    .filter((letter) => letter.box === "sent" && letter.status !== "임시저장")
    .sort((a, b) => dateValue(a.arriveDate) - dateValue(b.arriveDate))
    .slice(0, 5);

  const filteredLetters = useMemo(() => {
    let list =
      tab === "saved"
        ? letters.filter(
            (letter) => savedIds.includes(letter.id) || letter.isBookmarked
          )
        : letters.filter((letter) => letter.box === tab);

    const keyword = search.toLowerCase();

    list = list.filter((letter) =>
      `${letter.title} ${letter.target} ${letter.arriveDate} ${letter.writtenDate}`
        .toLowerCase()
        .includes(keyword)
    );

    if (tab === "received") {
      list.sort((a, b) =>
        receivedSort === "recent"
          ? dateValue(b.arriveDate) - dateValue(a.arriveDate)
          : dateValue(a.arriveDate) - dateValue(b.arriveDate)
      );
    } else {
      list.sort((a, b) => {
        if (sentSort === "pendingFirst" && tab === "sent") {
          const aPending = a.status === "대기 중" || a.status === "임시저장";
          const bPending = b.status === "대기 중" || b.status === "임시저장";

          if (aPending && !bPending) return -1;
          if (!aPending && bPending) return 1;

          return dateValue(a.arriveDate) - dateValue(b.arriveDate);
        }

        if (sentSort === "arrive") {
          return dateValue(a.arriveDate) - dateValue(b.arriveDate);
        }

        return dateValue(b.writtenDate) - dateValue(a.writtenDate);
      });

      if (reverse) list.reverse();
    }

    return list;
  }, [letters, tab, search, sentSort, receivedSort, reverse, savedIds]);

  const totalPages = Math.max(1, Math.ceil(filteredLetters.length / itemsPerPage));
  const paginatedLetters = filteredLetters.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  function changeTab(nextTab: Tab) {
    setTab(nextTab);
    setPage(1);
    setSearch("");
    setSelectedIds([]);
    setSelectionMode(false);
  }

  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function deleteSelected() {
    setLetters((prev) => prev.filter((letter) => !selectedIds.includes(letter.id)));
    setSelectedIds([]);
    setSelectionMode(false);
  }

  function markSelectedAsRead() {
    const updated = Array.from(new Set([...readIds, ...selectedIds]));
    setReadIds(updated);
    localStorage.setItem("readLetters", JSON.stringify(updated));
    setSelectedIds([]);
    setSelectionMode(false);
  }

  function displayStatus(letter: Letter) {
    if (letter.box === "received" && readIds.includes(letter.id)) {
      return "읽음";
    }

    return letter.status;
  }

  function isSaved(letter: Letter) {
    return savedIds.includes(letter.id) || letter.isBookmarked;
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-12 py-8 text-[#111]">
      <div className="mx-auto max-w-[1080px]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Letters</h1>
            <p className="mt-1 text-neutral-500">
              미래의 나와 누군가에게 남긴 편지를 확인해요.
            </p>
          </div>

          <Link
            href="/letters/write"
            className="rounded-xl bg-black px-5 py-3 text-sm text-white"
          >
            새 편지 쓰기
          </Link>
        </div>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">다가오는 편지</h2>
              <p className="mt-1 text-sm text-neutral-500">
                곧 도착 예정인 미래 편지들이에요.
              </p>
            </div>

            <div className="flex gap-4 text-xs text-neutral-500">
              <span>✉️ 나에게</span>
              <span>🪽 누군가에게</span>
            </div>
          </div>

          <div className="mt-7 border-t border-neutral-100 pt-6">
            <div className="flex justify-between">
            {upcoming.map((letter, index) => (
                <div key={letter.id} className="relative flex flex-1 flex-col items-center">
                {/* 아이콘 사이의 연결선 */}
                {index !== 0 && (
                    <div className="absolute left-0 top-6 h-px w-full -translate-x-1/2 bg-neutral-200" />
                )}

                <Link
                    href={`/letters/${letter.id}`}
                    className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-xl shadow-sm"
                >
                    {icon(letter.targetType)}
                </Link>
                <p className="mt-3 text-xs text-neutral-400">{letter.arriveDate}</p>
                <p className="mt-1 max-w-[120px] truncate text-center text-sm font-medium">
                    {letter.target}
                </p>
                </div>
            ))}
            </div>

            {/* 주의 문구는 이제 맨 아래에 하나로 합쳐짐 */}
            <div className="mt-8 border-t border-neutral-100 pt-4 text-xs text-neutral-400">
            <p>* 편지는 도착 전에 삭제하면 예약이 취소되어 나와 상대방 모두에게 도착하지 않아요.</p>
            <p>* 도착 후 삭제하면 내 기록에서만 사라지고, 이미 받은 사람은 계속 볼 수 있어요.</p>
            </div>
        </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              {[
                ["sent", "보낸 편지"],
                ["received", "받은 편지"],
                ["saved", "기억한 편지"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => changeTab(value as Tab)}
                  className={`rounded-full px-4 py-2 text-sm ${
                    tab === value
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

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
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-3">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-72 rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none"
                placeholder="제목, 날짜, 대상 검색"
              />

              {tab === "received" ? (
                <select
                  value={receivedSort}
                  onChange={(e) => setReceivedSort(e.target.value as ReceivedSort)}
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="recent">최근 도착순</option>
                  <option value="oldest">오래된 도착순</option>
                </select>
              ) : (
                <>
                  <select
                    value={sentSort}
                    onChange={(e) => setSentSort(e.target.value as SentSort)}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none"
                  >
                    {tab === "sent" && (
                      <option value="pendingFirst">미도착 우선</option>
                    )}
                    <option value="arrive">도착순</option>
                    <option value="written">작성순</option>
                  </select>

                  <button
                    onClick={() => setReverse((prev) => !prev)}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border text-lg transition ${
                      reverse
                        ? "border-black bg-black text-white"
                        : "border-neutral-200 text-neutral-400"
                    }`}
                  >
                    {reverse ? "↓" : "↑"}
                  </button>
                </>
              )}
            </div>

            {selectionMode && selectedIds.length > 0 && (
              <div className="flex gap-2">
                {tab === "received" && (
                  <button
                    onClick={markSelectedAsRead}
                    className="rounded-xl border border-neutral-200 px-4 py-2 text-sm"
                  >
                    읽음 처리
                  </button>
                )}

                <button
                  onClick={deleteSelected}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-500"
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 divide-y divide-neutral-100">
            {paginatedLetters.map((letter) => (
              <div
                key={letter.id}
                className={`grid items-center py-5 text-sm ${
                selectionMode
                    ? "grid-cols-[36px_1fr_130px_130px_150px_24px]"
                    : "grid-cols-[1fr_130px_130px_150px_24px]"
                }`}
              >
                {selectionMode && (
                  <button
                    onClick={() => toggleSelect(letter.id)}
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      selectedIds.includes(letter.id)
                        ? "border-black bg-black text-white"
                        : "border-neutral-300"
                    }`}
                >
                    {selectedIds.includes(letter.id) && "✓"}
                  </button>
                )}

                <Link href={`/letters/${letter.id}`}>
                  <div className="flex items-center gap-2">
                    <span>{icon(letter.targetType)}</span>
                    <h2 className="whitespace-nowrap text-base font-semibold">
                      {letter.title}
                    </h2>

                    {isSaved(letter) && (
                      <span className="text-yellow-400">★</span>
                    )}
                  </div>

                  <p className="mt-1 text-neutral-400">{letter.target}</p>
                </Link>

                <span className="text-neutral-500">도착 {letter.arriveDate}</span>
                <span className="text-neutral-400">작성 {letter.writtenDate}</span>

                <span className="flex items-center gap-1 text-neutral-500">
                  {displayStatus(letter) === "임시저장" && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white">
                      !
                    </span>
                  )}
                  {displayStatus(letter)}
                </span>

                <Link href={`/letters/${letter.id}`} className="text-right text-neutral-400">
                  ›
                </Link>
              </div>
            ))}

            {paginatedLetters.length === 0 && (
              <div className="py-16 text-center text-sm text-neutral-400">
                편지가 없어요.
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="h-9 w-9 rounded-full border border-neutral-200 text-sm text-neutral-500"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => setPage(number)}
                className={`h-9 w-9 rounded-full text-sm ${
                  page === number
                    ? "bg-black text-white"
                    : "border border-neutral-200 text-neutral-500"
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="h-9 w-9 rounded-full border border-neutral-200 text-sm text-neutral-500"
            >
              ›
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}