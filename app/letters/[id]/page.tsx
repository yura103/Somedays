"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Letter = {
  id: number;
  title: string;
  target: string;
  targets: string[];
  shareMethods: string[];
  sender: string;
  targetType: "me" | "someone";
  arriveDate: string;
  writtenDate: string;
  status: "임시저장" | "대기 중" | "도착 완료" | "읽음" | "미읽음";
  body: string;
  box: "sent" | "received" | "saved";
  isBookmarked: boolean;
  canRead: boolean;
  isToMyself: boolean;
};

const letters: Letter[] = [
  {
    id: 1,
    title: "1년 뒤의 나에게",
    target: "나에게",
    targets: ["나"],
    shareMethods: ["me@example.com"],
    sender: "나",
    targetType: "me",
    arriveDate: "2026.05.27",
    writtenDate: "2025.05.27",
    status: "대기 중",
    body: "1년 뒤의 나는 어떤 모습일까?\n지금보다 조금 더 단단해져 있기를.",
    box: "sent",
    isBookmarked: false,
    canRead: false,
    isToMyself: true,
  },
  {
    id: 2,
    title: "졸업하는 너에게",
    target: "민지에게",
    targets: ["민지"],
    shareMethods: ["minji@example.com"],
    sender: "나",
    targetType: "someone",
    arriveDate: "2025.12.31",
    writtenDate: "2025.05.27",
    status: "대기 중",
    body: "졸업하는 날의 너에게 꼭 전하고 싶은 말이 있어.",
    box: "sent",
    isBookmarked: false,
    canRead: true,
    isToMyself: false,
  },
  {
    id: 3,
    title: "생일 축하해",
    target: "수빈에게",
    targets: ["수빈"],
    shareMethods: ["subin@example.com"],
    sender: "유라",
    targetType: "someone",
    arriveDate: "2025.08.10",
    writtenDate: "2025.05.18",
    status: "임시저장",
    body: "생일 축하해. 그날 네가 꼭 웃었으면 좋겠어.",
    box: "sent",
    isBookmarked: false,
    canRead: true,
    isToMyself: false,
  },
  {
    id: 4,
    title: "26살의 나에게",
    target: "나에게",
    targets: ["나"],
    shareMethods: ["me@example.com"],
    sender: "나",
    targetType: "me",
    arriveDate: "2025.05.18",
    writtenDate: "2024.05.18",
    status: "미읽음",
    body: "지금의 너는 이 편지를 읽고 어떤 생각을 하고 있을까?",
    box: "received",
    isBookmarked: false,
    canRead: true,
    isToMyself: true,
  },
  {
    id: 5,
    title: "네가 잊지 않았으면 하는 말",
    target: "나에게",
    targets: ["나"],
    shareMethods: ["me@example.com"],
    sender: "민지",
    targetType: "someone",
    arriveDate: "2025.05.20",
    writtenDate: "2024.05.20",
    status: "읽음",
    body: "네가 이 말을 꼭 기억했으면 좋겠어. 너는 충분히 잘하고 있어.",
    box: "received",
    isBookmarked: true,
    canRead: true,
    isToMyself: false,
  },
  {
    id: 7,
    title: "지난 생일의 편지",
    target: "수빈에게",
    targets: ["수빈"],
    shareMethods: ["subin@example.com"],
    sender: "나",
    targetType: "someone",
    arriveDate: "2025.05.28",
    writtenDate: "2025.03.12",
    status: "도착 완료",
    body: "작년 생일에도 네가 행복했으면 좋겠다고 생각했어.",
    box: "sent",
    isBookmarked: false,
    canRead: true,
    isToMyself: false,
  },
];

type CommentVisibility = "me" | "sender";

type Comment = {
  id: number;
  author: string;
  content: string;
  emotion: string;
  visibility: CommentVisibility;
  createdAt: string;
  parentId?: number;
};

const emotions = ["🙂", "🥲", "🖤", "🌿", "✨"];

export default function LetterDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const letter = letters.find((item) => item.id === id);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comment, setComment] = useState("");
  const [emotion, setEmotion] = useState("🙂");
  const [visibility, setVisibility] = useState<CommentVisibility>("me");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftTargets, setDraftTargets] = useState<string[]>([""]);
  const [draftShareMethods, setDraftShareMethods] = useState<string[]>([""]);
  const [draftSender, setDraftSender] = useState("나");
  const [draftArriveDate, setDraftArriveDate] = useState("");
  const [draftImages, setDraftImages] = useState<string[]>([]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "나",
      content: "이 편지는 오래 기억하고 싶다.",
      emotion: "🖤",
      visibility: "me",
      createdAt: "2025.05.20 오후 9:10",
    },
  ]);

  useEffect(() => {
    if (!letter) return;

    const saved = JSON.parse(localStorage.getItem("savedLetters") || "[]");
    setIsBookmarked(letter.isBookmarked || saved.includes(letter.id));

    setDraftTitle(letter.title);
    setDraftBody(letter.body);
    setDraftTargets(letter.targets);
    setDraftShareMethods(letter.shareMethods);
    setDraftSender(letter.sender);

    if (letter.box === "received") {
      const read = JSON.parse(localStorage.getItem("readLetters") || "[]");

      if (!read.includes(letter.id)) {
        localStorage.setItem("readLetters", JSON.stringify([...read, letter.id]));
      }
    }
  }, [letter]);

  if (!letter) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] px-12 py-8 text-[#111]">
        <div className="mx-auto max-w-[900px]">
          <Link href="/letters" className="text-sm text-neutral-500">
            ← Letters로 돌아가기
          </Link>

          <p className="mt-8 text-neutral-500">편지를 찾을 수 없어요.</p>
        </div>
      </main>
    );
  }

  const currentLetter = letter;
  const isDraft = currentLetter.status === "임시저장";
  const isBeforeArrival =
    currentLetter.status === "대기 중" || currentLetter.status === "임시저장";

  function addDraftImageFiles(files: FileList | null) {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      setDraftImages((prev) => [...prev, URL.createObjectURL(file)]);
    });
  }

  function handleDraftPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    if (e.clipboardData.files.length > 0) {
      addDraftImageFiles(e.clipboardData.files);
    }
  }

  function removeDraftImage(index: number) {
    setDraftImages((prev) => prev.filter((_, i) => i !== index));
  }

  function updateDraftTarget(index: number, value: string) {
    setDraftTargets((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  }

  function updateDraftShareMethod(index: number, value: string) {
    setDraftShareMethods((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  }

  function addDraftTarget() {
    setDraftTargets((prev) => [...prev, ""]);
    setDraftShareMethods((prev) => [...prev, ""]);
  }

  function removeDraftTarget(index: number) {
    if (draftTargets.length === 1) return;

    setDraftTargets((prev) => prev.filter((_, i) => i !== index));
    setDraftShareMethods((prev) => prev.filter((_, i) => i !== index));
  }

  function deleteLetter() {
    if (isBeforeArrival) {
      alert("편지가 삭제되었어요. 도착 전이라 나와 상대방 모두에게 전달되지 않아요.");
      return;
    }

    alert(
      "내 보관함에서만 삭제되었어요. 이미 받은 사람은 편지와 코멘트를 계속 볼 수 있어요."
    );
  }

  function toggleBookmark() {
    if (isDraft) return;

    const next = !isBookmarked;
    setIsBookmarked(next);

    const saved = JSON.parse(localStorage.getItem("savedLetters") || "[]");

    const updated = next
      ? Array.from(new Set([...saved, currentLetter.id]))
      : saved.filter((savedId: number) => savedId !== currentLetter.id);

    localStorage.setItem("savedLetters", JSON.stringify(updated));
  }

  function saveComment() {
    if (!comment.trim() || isDraft) return;

    setComments((prev) => [
      {
        id: Date.now(),
        author: "나",
        content: comment,
        emotion,
        visibility,
        createdAt: new Date().toLocaleString("ko-KR"),
        parentId: replyTo?.id,
      },
      ...prev,
    ]);

    setComment("");
    setReplyTo(null);
    setVisibility("me");
    setEmotion("🙂");
  }

  function saveDraftLetter(nextStatus: "draft" | "saved") {
    if (nextStatus === "saved") {
      const hasTitle = draftTitle.trim() !== "";
      const hasBody = draftBody.trim() !== "";
      const hasDate = draftArriveDate.trim() !== "";

      const hasTarget =
        currentLetter.isToMyself ||
        draftTargets.every((item) => item.trim() !== "");

      const hasShareMethod = draftShareMethods.every(
        (item) => item.trim() !== ""
      );

      const hasSender = currentLetter.isToMyself || draftSender.trim() !== "";

      if (
        !hasTitle ||
        !hasBody ||
        !hasDate ||
        !hasTarget ||
        !hasShareMethod ||
        !hasSender
      ) {
        alert("모든 항목을 입력해야 저장할 수 있어요.");
        return;
      }
    }

    alert(nextStatus === "draft" ? "임시저장 되었어요." : "저장되었어요.");
  }

  const canChooseVisibility = !currentLetter.isToMyself;

  const canEdit =
    currentLetter.box === "sent" &&
    currentLetter.status !== "읽음" &&
    !(currentLetter.isToMyself && !currentLetter.canRead);

  if (isDraft) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] px-12 py-8 text-[#111]">
        <div className="mx-auto max-w-[900px]">
          <Link href="/letters" className="text-sm text-neutral-500">
            ← Letters로 돌아가기
          </Link>

          <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold">미래 편지 수정하기</h1>

                <p className="mt-2 text-sm text-neutral-500">
                  아직 임시저장 상태인 편지예요.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[11px] text-white">
                  !
                </span>
                임시저장
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {!currentLetter.isToMyself && (
                <div className="space-y-3">
                  {draftTargets.map((target, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-5 py-4"
                    >
                      <span className="text-sm text-neutral-400">
                        {index + 1}.
                      </span>

                      <input
                        value={target}
                        onChange={(e) =>
                          updateDraftTarget(index, e.target.value)
                        }
                        className="flex-1 outline-none"
                        placeholder="누구에게"
                      />

                      {index === draftTargets.length - 1 && (
                        <button
                          type="button"
                          onClick={addDraftTarget}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-500"
                        >
                          +
                        </button>
                      )}

                      {draftTargets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDraftTarget(index)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-500"
                        >
                          -
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <input
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 px-5 py-4 outline-none"
                placeholder="편지 제목"
              />

              <textarea
                value={draftBody}
                onChange={(e) => setDraftBody(e.target.value)}
                onPaste={handleDraftPaste}
                className="h-[320px] w-full resize-none rounded-2xl border border-neutral-200 p-5 leading-7 outline-none"
                placeholder="편지 내용"
              />

              {draftImages.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {draftImages.map((src, index) => (
                    <div key={src} className="relative">
                      <img
                        src={src}
                        alt=""
                        className="h-24 w-24 rounded-xl object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeDraftImage(index)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="cursor-pointer text-sm text-neutral-500 hover:text-black">
                이미지
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => addDraftImageFiles(e.target.files)}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                {!currentLetter.isToMyself && (
                  <div>
                    <p className="mb-2 text-xs text-neutral-400">From.</p>

                    <input
                      value={draftSender}
                      onChange={(e) => setDraftSender(e.target.value)}
                      className="h-[58px] w-full rounded-2xl border border-neutral-200 px-5 outline-none"
                      placeholder="상대에게 보일 이름"
                    />
                  </div>
                )}

                {currentLetter.isToMyself && (
                  <div>
                    <p className="mb-2 text-xs text-neutral-400">
                      보내는 사람
                    </p>

                    <input
                      value="나"
                      readOnly
                      className="h-[58px] w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-5 text-neutral-500 outline-none"
                    />
                  </div>
                )}

                <div>
                  <p className="mb-2 text-xs text-neutral-400">보낼 날짜</p>

                  <input
                    type="datetime-local"
                    value={draftArriveDate}
                    onChange={(e) => setDraftArriveDate(e.target.value)}
                    className="h-[58px] w-full rounded-2xl border border-neutral-200 px-5 outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-6">
                <p className="text-sm font-medium">공유 방법</p>

                <div className="mt-4 space-y-3">
                  {draftShareMethods.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3"
                    >
                      {!currentLetter.isToMyself && (
                        <span className="text-sm text-neutral-400">
                          {index + 1}.
                        </span>
                      )}

                      <span className="text-neutral-400">✉️</span>

                      <input
                        value={email}
                        onChange={(e) =>
                          updateDraftShareMethod(index, e.target.value)
                        }
                        className="flex-1 outline-none"
                        placeholder="example@email.com"
                      />
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-xs leading-6 text-neutral-400">
                  {currentLetter.isToMyself
                    ? "내가 나에게 보내는 편지는 공유 방법이 하나로 고정돼요."
                    : "누구에게와 공유 방법의 개수를 맞춰주세요."}
                </p>
              </div>
            </div>

            <div className="mt-10 flex justify-between border-t border-neutral-100 pt-6">
              <button
                onClick={deleteLetter}
                className="rounded-xl border border-red-200 px-5 py-3 text-sm text-red-500"
              >
                삭제
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => saveDraftLetter("draft")}
                  className="rounded-xl border border-neutral-200 px-5 py-3 text-sm"
                >
                  임시저장
                </button>

                <button
                  onClick={() => saveDraftLetter("saved")}
                  className="rounded-xl bg-black px-5 py-3 text-sm text-white"
                >
                  저장하기
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-12 py-8 text-[#111]">
      <div className="mx-auto max-w-[900px]">
        <Link href="/letters" className="text-sm text-neutral-500">
          ← Letters로 돌아가기
        </Link>

        <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between text-sm text-neutral-400">
            <span>
              {currentLetter.sender} · 작성 {currentLetter.writtenDate}
            </span>

            <button
              type="button"
              onClick={toggleBookmark}
              className={`cursor-pointer text-4xl leading-none transition ${
                isBookmarked
                  ? "scale-110 text-yellow-400"
                  : "text-neutral-300 hover:text-neutral-500"
              }`}
            >
              ★
            </button>
          </div>

          <h1 className="mt-5 text-3xl font-semibold">{currentLetter.title}</h1>

          <p className="mt-2 text-sm text-neutral-500">
            도착일 {currentLetter.arriveDate} · {currentLetter.status}
          </p>

          {currentLetter.canRead ? (
            <div className="mt-8 whitespace-pre-line rounded-2xl bg-[#FAFAFA] p-7 leading-8 text-neutral-700">
              {currentLetter.body}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-[#FAFAFA] p-10 text-center">
              <p className="text-5xl">🔒</p>

              <h2 className="mt-5 text-xl font-semibold">
                아직 도착하지 않은 편지예요
              </h2>

              <p className="mt-3 text-sm leading-7 text-neutral-500">
                이 편지는 도착 날짜 전까지 다시 읽을 수 없어요.
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-between border-t border-neutral-100 pt-6">
            <button
              onClick={deleteLetter}
              className="rounded-xl border border-red-200 px-5 py-3 text-sm text-red-500"
            >
              삭제
            </button>

            {canEdit && (
              <button className="rounded-xl bg-black px-5 py-3 text-sm text-white">
                수정하기
              </button>
            )}
          </div>

          {currentLetter.canRead && (
            <div className="mt-8 border-t border-neutral-100 pt-6">
              <h2 className="font-semibold">코멘트</h2>

              <div className="mt-5 space-y-3">
                {comments.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl bg-[#FAFAFA] p-5 text-sm ${
                      item.parentId ? "ml-8" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{item.emotion}</span>

                        <span className="font-medium">{item.author}</span>

                        <span className="text-xs text-neutral-400">
                          {item.createdAt}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-neutral-400">
                        {canChooseVisibility && (
                          <span>
                            {item.visibility === "me"
                              ? "나에게만"
                              : "작성자에게"}
                          </span>
                        )}

                        <button onClick={() => setReplyTo(item)}>답장</button>
                      </div>
                    </div>

                    <p className="mt-3 leading-7 text-neutral-700">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>

              {replyTo && (
                <div className="mt-5 rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-500">
                  {replyTo.author}님의 코멘트에 답장 중

                  <button
                    onClick={() => setReplyTo(null)}
                    className="ml-3 text-neutral-400"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  {emotions.map((item) => (
                    <button
                      key={item}
                      onClick={() => setEmotion(item)}
                      className={`h-9 w-9 rounded-full text-base ${
                        emotion === item
                          ? "bg-black text-white"
                          : "border border-neutral-200"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  {canChooseVisibility && (
                    <>
                      <button
                        onClick={() => setVisibility("me")}
                        className={`rounded-full px-3 py-1 text-xs ${
                          visibility === "me"
                            ? "bg-black text-white"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        나에게만
                      </button>

                      <button
                        onClick={() => setVisibility("sender")}
                        className={`rounded-full px-3 py-1 text-xs ${
                          visibility === "sender"
                            ? "bg-black text-white"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        작성자에게
                      </button>
                    </>
                  )}

                  <button
                    onClick={saveComment}
                    className="rounded-xl bg-black px-4 py-2 text-sm text-white"
                  >
                    저장
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