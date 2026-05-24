"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type JournalStatus = "draft" | "saved";
type CommentVisibility = "public" | "followers" | "private" | "owner";

type Journal = {
  id: number;
  diaryDate: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  status: JournalStatus;
  likes: number;
  views: number;
};

type Comment = {
  id: number;
  author: string;
  isMine: boolean;
  emotion: string;
  content: string;
  visibility: CommentVisibility;
  createdAt: string;
  parentId?: number;
};

const journals: Journal[] = [
  {
    id: 1,
    diaryDate: "2025-05-27",
    createdAt: "2025.05.27 오후 10:45",
    updatedAt: "2025.05.27 오후 10:45",
    title: "조금 괜찮았던 하루",
    content:
      "오늘은 생각보다 마음이 조용했다.\n아침에 일어나서 날씨가 좋길래 기분이 좋았다. 커피도 맛있었고, 해야 할 일도 수월하게 끝났다.",
    status: "saved",
    likes: 13,
    views: 42,
  },
  {
    id: 2,
    diaryDate: "2025-05-22",
    createdAt: "2025.05.22 오후 9:20",
    updatedAt: "2025.05.22 오후 9:20",
    title: "해야 할 말",
    content: "계속 미뤄둔 말을 적어봤다.",
    status: "draft",
    likes: 0,
    views: 0,
  },
  {
    id: 3,
    diaryDate: "2025-05-18",
    createdAt: "2025.05.18 오후 11:02",
    updatedAt: "2025.05.18 오후 11:02",
    title: "불안했지만",
    content: "불안한 마음도 기록해두면 조금 멀어진다.",
    status: "saved",
    likes: 8,
    views: 21,
  },
];

const emotions = ["🙂", "🥲", "🖤", "🌿", "✨"];

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

function visibilityLabel(v: CommentVisibility) {
  if (v === "private") return "비공개";
  if (v === "followers") return "팔로워 공개";
  if (v === "owner") return "작성자에게만";
  return "전체 공개";
}

export default function JournalDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const id = Number(params.id);
  const journal = journals.find((item) => item.id === id);

  const from = searchParams.get("from");
  const backHref = from === "journal" ? "/journal" : "/journal/list";
  const backLabel =
    from === "journal" ? "← Journal로 돌아가기" : "← 보관함으로 돌아가기";

  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const [diaryDate, setDiaryDate] = useState(journal?.diaryDate ?? "");
  const [createdAt] = useState(journal?.createdAt ?? "");
  const [updatedAt, setUpdatedAt] = useState(journal?.updatedAt ?? "");
  const [status, setStatus] = useState<JournalStatus>(journal?.status ?? "saved");
  const [title, setTitle] = useState(journal?.title ?? "");
  const [content, setContent] = useState(journal?.content ?? "");
  const [images, setImages] = useState<string[]>([]);

  const [selectedEmotion, setSelectedEmotion] = useState("🙂");
  const [comment, setComment] = useState("");
  const [commentVisibility, setCommentVisibility] =
    useState<CommentVisibility>("private");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  if (!journal) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] px-12 py-8 text-[#111]">
        <Link href="/journal/list" className="text-sm text-neutral-500">
          ← 보관함으로 돌아가기
        </Link>
        <p className="mt-8 text-neutral-500">일기를 찾을 수 없어요.</p>
      </main>
    );
  }

  const isDraft = status === "draft";
  const timeLabel = updatedAt !== createdAt ? `수정 ${updatedAt}` : `작성 ${createdAt}`;

  function addImageFiles(files: FileList | null) {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      setImages((prev) => [...prev, URL.createObjectURL(file)]);
    });
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    if (e.clipboardData.files.length > 0) {
      addImageFiles(e.clipboardData.files);
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function nowText() {
    return new Date().toLocaleString("ko-KR");
  }

  function saveJournal(nextStatus: JournalStatus) {
    setStatus(nextStatus);
    setUpdatedAt(nowText());
    alert(nextStatus === "draft" ? "임시저장 되었어요." : "저장되었어요.");
  }

  function deleteJournal() {
    alert("일기가 완전히 삭제되었어요. 댓글, 공감, 조회 기록도 함께 삭제돼요.");
  }

  function resetCommentForm() {
    setReplyTo(null);
    setEditingId(null);
    setComment("");
    setCommentVisibility("private");
    setSelectedEmotion("🙂");
  }

  function saveComment() {
    if (isDraft || !comment.trim()) return;

    if (editingId) {
      setComments((prev) =>
        prev.map((item) =>
          item.id === editingId && item.isMine
            ? {
                ...item,
                emotion: selectedEmotion,
                content: comment,
                visibility: commentVisibility,
              }
            : item
        )
      );
    } else {
      setComments((prev) => [
        {
          id: Date.now(),
          author: "나",
          isMine: true,
          emotion: selectedEmotion,
          content: comment,
          visibility:
            replyTo?.visibility === "private" ? "owner" : commentVisibility,
          createdAt: nowText(),
          parentId: replyTo?.id,
        },
        ...prev,
      ]);
    }

    resetCommentForm();
  }

  function editComment(item: Comment) {
    if (!item.isMine || isDraft) return;

    setEditingId(item.id);
    setReplyTo(null);
    setSelectedEmotion(item.emotion);
    setCommentVisibility(item.visibility);
    setComment(item.content);
  }

  function deleteComment(id: number) {
    if (isDraft) return;
    setComments((prev) => prev.filter((item) => item.id !== id));
  }

  function startReply(item: Comment) {
    if (isDraft) return;

    setEditingId(null);
    setReplyTo(item);
    setComment("");
    setSelectedEmotion("🙂");
    setCommentVisibility(item.visibility === "private" ? "owner" : "public");
  }

  const isPrivateReply = replyTo?.visibility === "private";

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-12 py-8 text-[#111]">
      <div className="mx-auto max-w-[980px]">
        <Link href={backHref} className="text-sm text-neutral-500">
          {backLabel}
        </Link>

        <section className="mt-8 rounded-2xl bg-white p-7 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-xl font-medium text-neutral-500">
                  {formatDate(diaryDate)}
                </p>

                <button
                  type="button"
                  onClick={() => dateInputRef.current?.showPicker()}
                  className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-500"
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

                {isDraft && (
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-500">
                    임시저장
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-neutral-400">{timeLabel}</p>
            </div>

            {!isDraft && (
              <div className="text-right text-xs text-neutral-400">
                <p>공감 {journal.likes}개</p>
                <p className="mt-1">조회 {journal.views}회</p>
              </div>
            )}
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-6 w-full rounded-xl border border-neutral-200 p-4 outline-none"
            placeholder="제목"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onPaste={handlePaste}
            className="mt-4 h-[320px] w-full resize-none rounded-2xl border border-neutral-200 p-5 leading-7 outline-none"
            placeholder="내용"
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
            <label className="cursor-pointer text-sm text-neutral-500 hover:text-black">
              이미지
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addImageFiles(e.target.files)}
              />
            </label>

            <div className="flex gap-3">
              <button
                onClick={deleteJournal}
                className="rounded-xl border border-red-200 px-5 py-3 text-sm text-red-500"
              >
                삭제
              </button>

              {isDraft && (
                <button
                  onClick={() => saveJournal("draft")}
                  className="rounded-xl border border-neutral-300 px-5 py-3 text-sm"
                >
                  임시저장
                </button>
              )}

              <button
                onClick={() => saveJournal("saved")}
                className="rounded-xl bg-black px-5 py-3 text-sm text-white"
              >
                저장
              </button>
            </div>
          </div>

          {!isDraft && (
            <div className="mt-8 border-t border-neutral-100 pt-6">
              <h2 className="text-base font-semibold">코멘트</h2>

              <div className="mt-5 space-y-3">
                {comments.length === 0 ? (
                  <p className="rounded-2xl bg-[#FAFAFA] p-5 text-sm text-neutral-400">
                    아직 코멘트가 없어요.
                  </p>
                ) : (
                  comments.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-2xl bg-[#FAFAFA] p-5 text-sm ${
                        item.parentId ? "ml-8" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.emotion}</span>
                          <span className="font-medium">{item.author}</span>
                          <span className="text-xs text-neutral-400">
                            {item.createdAt}
                          </span>

                          {item.parentId && (
                            <span className="text-xs text-neutral-400">
                              답장
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-neutral-400">
                            {visibilityLabel(item.visibility)}
                          </span>

                          {item.isMine ? (
                            <>
                              <button
                                onClick={() => editComment(item)}
                                className="text-neutral-400"
                              >
                                수정
                              </button>

                              <button
                                onClick={() => deleteComment(item.id)}
                                className="text-neutral-400"
                              >
                                삭제
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => startReply(item)}
                              className="text-neutral-400"
                            >
                              답장
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="mt-3 leading-7 text-neutral-700">
                        {item.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {(replyTo || editingId) && (
                <div className="mt-5 flex items-center justify-between rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-500">
                  <span>
                    {editingId
                      ? "코멘트 수정 중"
                      : `${replyTo?.author}님의 댓글에 답장 중`}
                  </span>

                  <button
                    onClick={resetCommentForm}
                    className="text-neutral-400 hover:text-black"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  {emotions.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedEmotion(item)}
                      className={`h-9 w-9 rounded-full text-base ${
                        selectedEmotion === item
                          ? "bg-black text-white"
                          : "border border-neutral-200"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  {replyTo ? (
                    <>
                      <button
                        onClick={() => setCommentVisibility("public")}
                        disabled={isPrivateReply}
                        className={`rounded-full px-3 py-1 text-xs ${
                          commentVisibility === "public" && !isPrivateReply
                            ? "bg-black text-white"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        공개
                      </button>

                      <button
                        onClick={() => setCommentVisibility("owner")}
                        className={`rounded-full px-3 py-1 text-xs ${
                          commentVisibility === "owner"
                            ? "bg-black text-white"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        작성자에게만
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setCommentVisibility("private")}
                        className={`rounded-full px-3 py-1 text-xs ${
                          commentVisibility === "private"
                            ? "bg-black text-white"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        비공개
                      </button>

                      <button
                        onClick={() => setCommentVisibility("followers")}
                        className={`rounded-full px-3 py-1 text-xs ${
                          commentVisibility === "followers"
                            ? "bg-black text-white"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        팔로워 공개
                      </button>

                      <button
                        onClick={() => setCommentVisibility("public")}
                        className={`rounded-full px-3 py-1 text-xs ${
                          commentVisibility === "public"
                            ? "bg-black text-white"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        전체 공개
                      </button>
                    </>
                  )}

                  <button
                    onClick={saveComment}
                    className="rounded-xl bg-black px-4 py-2 text-sm text-white"
                  >
                    {editingId ? "수정" : "저장"}
                  </button>
                </div>
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-3 h-24 w-full resize-none rounded-2xl border border-neutral-200 p-4 text-sm outline-none"
                placeholder="코멘트를 남겨보세요."
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}