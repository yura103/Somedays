"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type Journal = {
  id: number;
  date: string;
  title: string;
  content: string;
  status: "draft" | "saved";
};

const initialJournals: Journal[] = [
  {
    id: 1,
    date: "2025-05-27",
    title: "조금 괜찮았던 하루",
    content: "오늘은 생각보다 마음이 조용했다.",
    status: "saved",
  },
  {
    id: 2,
    date: "2025-05-22",
    title: "해야 할 말",
    content: "계속 미뤄둔 말을 적어봤다.",
    status: "draft",
  },
  {
    id: 3,
    date: "2025-05-18",
    title: "불안했지만",
    content: "불안한 마음도 기록해두면 조금 멀어진다.",
    status: "saved",
  },
];

const writtenDays = [18, 22, 27];

const stats = {
  monthLikes: 128,
  monthViews: 436,
  totalLikes: 1204,
  totalViews: 5823,
};

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

export default function JournalPage() {
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const [journals, setJournals] = useState<Journal[]>(initialJournals);
  const [diaryDate, setDiaryDate] = useState("2025-05-27");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);

  function addImageFiles(files: FileList | null) {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const url = URL.createObjectURL(file);
      setImages((prev) => [...prev, url]);
    });
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const files = e.clipboardData.files;

    if (files.length > 0) {
      addImageFiles(files);
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function saveToday(status: "draft" | "saved") {
    if (!title.trim() && !content.trim() && images.length === 0) return;

    const newJournal: Journal = {
      id: Date.now(),
      date: diaryDate,
      title: title || "제목 없는 기록",
      content,
      status,
    };

    setJournals((prev) => [newJournal, ...prev]);
    setTitle("");
    setContent("");
    setImages([]);
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-12 py-8 text-[#111]">
      <div className="mx-auto max-w-[1080px]">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold">Journal</h1>
          <p className="mt-1 text-neutral-500">오늘의 마음을 기록해보세요.</p>
        </header>

        <section className="grid grid-cols-[1.35fr_0.65fr] gap-6">
          <section className="space-y-5">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">오늘의 기록</h2>

                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <span>{formatDate(diaryDate)}</span>

                  <button
                    type="button"
                    onClick={() => dateInputRef.current?.showPicker()}
                    className="rounded-full border border-neutral-200 px-3 py-1"
                  >
                    날짜 변경
                  </button>

                  <input
                    ref={dateInputRef}
                    type="date"
                    value={diaryDate}
                    onChange={(e) => setDiaryDate(e.target.value)}
                    className="sr-only"
                  />
                </div>
              </div>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-5 w-full rounded-xl border border-neutral-200 p-4 outline-none"
                placeholder="제목을 입력해주세요"
              />

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onPaste={handlePaste}
                className="mt-4 h-[260px] w-full resize-none rounded-2xl border border-neutral-200 p-5 leading-7 outline-none"
                placeholder="오늘은 어떤 마음이었나요?"
              />

              {images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {images.map((src, index) => (
                    <div key={src} className="relative">
                      <img
                        src={src}
                        alt=""
                        className="h-24 w-24 rounded-xl object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 flex items-center justify-between">
                <div className="flex gap-4 text-sm text-neutral-500">
                  <label className="cursor-pointer hover:text-black">
                    이미지
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => addImageFiles(e.target.files)}
                    />
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => saveToday("draft")}
                    className="rounded-xl border border-neutral-300 px-5 py-3 text-sm"
                  >
                    임시 저장
                  </button>

                  <button
                    onClick={() => saveToday("saved")}
                    className="rounded-xl bg-black px-5 py-3 text-sm text-white"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">보관함</h2>

                <Link href="/journal/list" className="text-sm text-neutral-500">
                  전체보기 →
                </Link>
              </div>

              <div className="mt-5 divide-y divide-neutral-100">
                {journals.slice(0, 3).map((journal) => (
                  <Link
                    key={journal.id}
                    href={`/journal/${journal.id}?from=journal`}
                    className="grid grid-cols-[110px_1fr_20px] items-center py-4 text-sm hover:text-black"
                  >
                    <span className="text-neutral-400">
                      {formatDate(journal.date)}
                    </span>

                    <span className="font-medium">
                      {journal.title}

                      {journal.status === "draft" && (
                        <span className="ml-2 rounded-full bg-neutral-100 px-2 py-1 text-xs font-normal text-neutral-500">
                          임시저장
                        </span>
                      )}
                    </span>

                    <span className="text-neutral-400">›</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <button className="text-neutral-400">‹</button>
                <h2 className="font-semibold">2025년 5월</h2>
                <button className="text-neutral-400">›</button>
              </div>

              <div className="mt-5 grid grid-cols-7 gap-1 text-center text-xs text-neutral-400">
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-7 gap-1 text-center text-sm">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    className={`h-8 rounded-full ${
                      writtenDays.includes(day)
                        ? "bg-black text-white"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="grid grid-cols-2 gap-y-5 text-center text-sm">
                <div>
                  <p className="text-neutral-400">총 기록</p>
                  <strong className="mt-2 block">{journals.length}개</strong>
                </div>

                <div>
                  <p className="text-neutral-400">연속 기록</p>
                  <strong className="mt-2 block">12일</strong>
                </div>

                <div>
                  <p className="text-neutral-400">이번 달 기록</p>
                  <strong className="mt-2 block">{writtenDays.length}개</strong>
                </div>

                <div>
                  <p className="text-neutral-400">이번 달 공감</p>
                  <strong className="mt-2 block">{stats.monthLikes}개</strong>
                </div>

                <div>
                  <p className="text-neutral-400">이번 달 조회</p>
                  <strong className="mt-2 block">{stats.monthViews}회</strong>
                </div>

                <div>
                  <p className="text-neutral-400">누적 공감</p>
                  <strong className="mt-2 block">{stats.totalLikes}개</strong>
                </div>

                <div className="col-span-2">
                  <p className="text-neutral-400">누적 조회</p>
                  <strong className="mt-2 block">{stats.totalViews}회</strong>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}