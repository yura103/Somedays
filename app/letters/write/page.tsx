"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function WriteLetterPage() {
  const router = useRouter();

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetType, setTargetType] = useState<"me" | "someone">("me");

  const [targets, setTargets] = useState([""]);
  const [fromName, setFromName] = useState("");

  const [sendDate, setSendDate] = useState("");

  const [shareMethods, setShareMethods] = useState([""]);

  const [images, setImages] = useState<string[]>([]);

  function updateTarget(index: number, value: string) {
    setTargets((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function updateShare(index: number, value: string) {
    setShareMethods((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  }

  function addTarget() {
    setTargets((prev) => [...prev, ""]);
    setShareMethods((prev) => [...prev, ""]);
  }

  function removeTarget(index: number) {
    if (targets.length === 1) return;

    setTargets((prev) => prev.filter((_, i) => i !== index));
    setShareMethods((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  function addImageFiles(files: FileList | null) {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const url = URL.createObjectURL(file);

      setImages((prev) => [...prev, url]);
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

  function saveDraft() {
    alert("임시저장 되었어요.");
    router.push("/letters");
  }

  function saveLetter() {
    const hasTitle = title.trim() !== "";
    const hasContent = content.trim() !== "";
    const hasDate = sendDate.trim() !== "";

    const hasTargets =
      targetType === "me" ||
      targets.every((item) => item.trim() !== "");

    const hasShare =
      shareMethods.every((item) => item.trim() !== "");

    const hasFrom =
      targetType === "me" || fromName.trim() !== "";

    if (
      !hasTitle ||
      !hasContent ||
      !hasDate ||
      !hasTargets ||
      !hasShare ||
      !hasFrom
    ) {
      alert("모든 항목을 입력해야 저장할 수 있어요.");
      return;
    }

    alert("편지가 저장되었어요.");
    router.push("/letters");
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-12 py-8 text-[#111]">
      <div className="mx-auto max-w-[900px]">
        <button
          onClick={() => router.back()}
          className="text-sm text-neutral-500"
        >
          ← Letters로 돌아가기
        </button>

        <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold">
            미래 편지 쓰기
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            미래의 나 또는 누군가에게 편지를 남겨보세요.
          </p>

          <div className="mt-8 flex gap-2">
            <button
              onClick={() => setTargetType("me")}
              className={`rounded-full px-4 py-2 text-sm ${
                targetType === "me"
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-500"
              }`}
            >
              나에게
            </button>

            <button
              onClick={() => setTargetType("someone")}
              className={`rounded-full px-4 py-2 text-sm ${
                targetType === "someone"
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-500"
              }`}
            >
              누군가에게
            </button>
          </div>

          <div className="mt-8 space-y-4">
            {targetType === "someone" && (
              <div className="space-y-3">
                {targets.map((target, index) => (
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
                        updateTarget(index, e.target.value)
                      }
                      className="flex-1 outline-none"
                      placeholder="누구에게"
                    />

                    {index === targets.length - 1 && (
                      <button
                        type="button"
                        onClick={addTarget}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-500"
                      >
                        +
                      </button>
                    )}

                    {targets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTarget(index)}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-neutral-200 px-5 py-4 outline-none"
              placeholder="편지 제목"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
              className="h-[320px] w-full resize-none rounded-2xl border border-neutral-200 p-5 leading-7 outline-none"
              placeholder="편지 내용"
            />

            {images.length > 0 && (
              <div className="flex flex-wrap gap-3">
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

            <label className="cursor-pointer text-sm text-neutral-500 hover:text-black">
              이미지
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) =>
                  addImageFiles(e.target.files)
                }
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              {targetType === "someone" && (
                <div>
                  <p className="mb-2 text-xs text-neutral-400">
                    From.
                  </p>

                  <input
                    value={fromName}
                    onChange={(e) =>
                      setFromName(e.target.value)
                    }
                    className="h-[58px] w-full rounded-2xl border border-neutral-200 px-5 outline-none"
                    placeholder="상대에게 보일 이름"
                  />
                </div>
              )}

              <div
                className={
                  targetType === "me"
                    ? "col-span-2"
                    : ""
                }
              >
                <p className="mb-2 text-xs text-neutral-400">
                  보낼 날짜
                </p>

                <input
                  type="datetime-local"
                  value={sendDate}
                  onChange={(e) =>
                    setSendDate(e.target.value)
                  }
                  className="h-[58px] w-full rounded-2xl border border-neutral-200 px-5 outline-none"
                />
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-6">
              <p className="text-sm font-medium">
                공유 방법
              </p>

              <div className="mt-4 space-y-3">
                {shareMethods.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3"
                  >
                    {targetType === "someone" && (
                      <span className="text-sm text-neutral-400">
                        {index + 1}.
                      </span>
                    )}

                    <span className="text-neutral-400">
                      ✉️
                    </span>

                    <input
                      value={item}
                      onChange={(e) =>
                        updateShare(index, e.target.value)
                      }
                      className="flex-1 outline-none"
                      placeholder="example@email.com"
                    />
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs leading-6 text-neutral-400">
                {targetType === "me"
                  ? "내가 나에게 보내는 편지는 공유 방법이 하나로 고정돼요."
                  : "누구에게 칸을 추가하면 공유 이메일 칸도 같이 추가돼요."}
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-3 border-t border-neutral-100 pt-6">
            <button
              onClick={saveDraft}
              className="rounded-xl border border-neutral-200 px-5 py-3 text-sm"
            >
              임시저장
            </button>

            <button
              onClick={saveLetter}
              className="rounded-xl bg-black px-5 py-3 text-sm text-white"
            >
              저장하기
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}