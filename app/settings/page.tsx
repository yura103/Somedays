"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext"; // 언어 컨텍스트 추가

const faq = [
  {
    question: "편지는 상대방이 회원가입 안 해도 볼 수 있나요?",
    answer: "네. 이메일 링크와 비밀번호를 통해 로그인 없이도 읽을 수 있어요.",
  },
  {
    question: "편지를 삭제하면 상대방에게도 사라지나요?",
    answer:
      "도착 전에 삭제하면 전달되지 않지만, 도착 후 삭제하면 내 보관함에서만 사라져요.",
  },
  {
    question: "임시저장 편지는 공개되나요?",
    answer: "아니요. 임시저장 상태의 편지는 누구에게도 공개되지 않아요.",
  },
];

type NotificationKey = "activities" | "follows" | "letters";

export default function SettingsPage() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [nickname, setNickname] = useState("yura");

  const [userId, setUserId] = useState("yura");
  const [isIdChecked, setIsIdChecked] = useState(true);
  const [idMessage, setIdMessage] = useState("");

  const { lang, setLang } = useLanguage();

  const [notifications, setNotifications] = useState<
    Record<NotificationKey, boolean>
  >({
    activities: true,
    follows: true,
    letters: true,
  });

  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  function toggleNotification(key: NotificationKey) {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function selectProfileImage(files: FileList | null) {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setProfileImage(URL.createObjectURL(file));
    setShowProfileMenu(false);
  }

  function useDefaultProfileImage() {
    setProfileImage(null);
    setShowProfileMenu(false);
  }

  function handleIdChange(e: React.ChangeEvent<HTMLInputElement>) {
    const validId = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    setUserId(validId);
    setIsIdChecked(false);
    setIdMessage("");
  }

  function checkDuplicateId() {
    if (!userId) {
      setIdMessage("ID를 입력해주세요.");
      setIsIdChecked(false);
      return;
    }

    const existingIds = ["admin", "someday", "yura123"];

    if (existingIds.includes(userId)) {
      setIdMessage("이미 사용 중인 ID입니다. 다른 ID를 입력해주세요.");
      setIsIdChecked(false);
    } else {
      setIdMessage("사용 가능한 ID입니다.");
      setIsIdChecked(true);
    }
  }

  function saveProfile() {
    if (!userId) {
      alert("ID를 설정해야 저장이 가능합니다!");
      return;
    }

    if (!isIdChecked) {
      alert("ID 중복확인을 완료해야 저장이 가능합니다!");
      return;
    }

    alert("프로필이 저장되었어요.");
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-12 py-8 text-[#111]">
      <div className="mx-auto max-w-[980px]">
        <header>
          <h1 className="text-3xl font-semibold">Settings</h1>
          <p className="mt-1 text-neutral-500">
            계정, 프로필, 알림, 구독을 관리해요.
          </p>
        </header>

        <div className="mt-8 grid gap-6">
          <section className="rounded-2xl bg-white p-7 shadow-sm">
            <h2 className="text-xl font-semibold">Profile</h2>

            <div className="mt-6 flex items-start gap-6">
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-neutral-100 text-3xl"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-neutral-600">
                      {nickname ? nickname.charAt(0) : "?"}
                    </span>
                  )}

                  <div className="absolute inset-0 hidden items-center justify-center bg-black/40 text-xs text-white group-hover:flex">
                    변경
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute left-0 top-[110px] z-10 w-48 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg">
                    <button
                      type="button"
                      onClick={useDefaultProfileImage}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm hover:bg-neutral-100"
                    >
                      기본 이미지 선택
                    </button>

                    <label className="block cursor-pointer rounded-xl px-4 py-3 text-sm hover:bg-neutral-100">
                      이미지 가져오기
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => selectProfileImage(e.target.files)}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    defaultValue="김유라"
                    className="rounded-2xl border border-neutral-200 px-5 py-4 outline-none"
                    placeholder="성명"
                  />

                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="rounded-2xl border border-neutral-200 px-5 py-4 outline-none"
                    placeholder="닉네임"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex w-full items-center overflow-hidden rounded-2xl border border-neutral-200 px-5 focus-within:border-neutral-400">
                      <span className="font-medium text-neutral-400">@</span>
                      <input
                        value={userId}
                        onChange={handleIdChange}
                        className="w-full bg-transparent py-4 pl-1 outline-none"
                        placeholder="영문, 숫자만 입력 가능"
                      />
                    </div>

                    <button
                      onClick={checkDuplicateId}
                      className="shrink-0 rounded-2xl border border-neutral-200 px-5 py-4 text-sm font-medium transition hover:bg-neutral-50"
                    >
                      중복확인
                    </button>
                  </div>

                  {idMessage && (
                    <p
                      className={`ml-2 mt-2 text-xs ${
                        isIdChecked ? "text-blue-500" : "text-red-500"
                      }`}
                    >
                      {idMessage}
                    </p>
                  )}
                </div>

                <button
                  onClick={saveProfile}
                  className="rounded-xl bg-black px-5 py-3 text-sm text-white"
                >
                  저장
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-7 shadow-sm">
            <h2 className="text-xl font-semibold">Account</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-neutral-200 p-5">
                <p className="font-medium">연결된 계정</p>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Google</span>
                    <button className="rounded-full bg-black px-4 py-2 text-white">
                      연결됨
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Kakao</span>
                    <button className="rounded-full border border-neutral-200 px-4 py-2">
                      연결하기
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Naver</span>
                    <button className="rounded-full border border-neutral-200 px-4 py-2">
                      연결하기
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  defaultValue="2003.08.10"
                  className="rounded-2xl border border-neutral-200 px-5 py-4 outline-none"
                  placeholder="생년월일"
                />

                <select className="rounded-2xl border border-neutral-200 px-5 py-4 outline-none">
                  <option>여성</option>
                  <option>남성</option>
                  <option>선택 안 함</option>
                </select>
              </div>

              <div className="flex items-end gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-neutral-500 font-medium ml-1">언어 (Language)</span>
                  <select 
                    value={lang} 
                    onChange={(e) => setLang(e.target.value as 'ko' | 'en')}
                    className="rounded-2xl border border-neutral-200 px-5 py-[13px] outline-none bg-white cursor-pointer"
                  >
                    <option value="ko">한국어 (Korean)</option>
                    <option value="en">영어 (English)</option>
                  </select>
                </div>
                <button className="rounded-xl border border-neutral-200 px-5 py-3 text-sm h-[50px]">비밀번호 초기화</button>
                <button className="rounded-xl border border-red-200 px-5 py-3 text-sm text-red-500 h-[50px]">계정 삭제</button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-7 shadow-sm">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <p className="mt-2 text-sm text-neutral-500">
              여기서 알림을 꺼도 Notifications에는 계속 쌓여요.
              웹에서는 푸시 알림이 지원되지 않아요.
            </p>

            <div className="mt-6 space-y-3">
              {[
                ["activities", "활동 푸시"],
                ["follows", "팔로우 푸시"],
                ["letters", "편지 푸시"],
              ].map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 px-5 py-4"
                >
                  <span>{label}</span>

                  <button
                    onClick={() => toggleNotification(key as NotificationKey)}
                    className={`flex h-7 w-12 items-center rounded-full p-1 transition ${
                      notifications[key as NotificationKey]
                        ? "justify-end bg-black"
                        : "justify-start bg-neutral-200"
                    }`}
                  >
                    <div className="h-5 w-5 rounded-full bg-white" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-7 shadow-sm">
            <h2 className="text-xl font-semibold">Announcements</h2>

            <div className="mt-6 space-y-3">
              {[
                { title: "새로운 타임라인 기능 업데이트", date: "2025.05.28" },
                { title: "Letters 코멘트 기능 추가", date: "2025.05.21" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-neutral-200 p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{item.title}</p>
                    <span className="text-sm text-neutral-400">
                      {item.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-7 shadow-sm">
            <h2 className="text-xl font-semibold">Premium</h2>

            <div className="mt-6 rounded-2xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Premium 구독 중</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Mastercard •••• 2408
                  </p>
                </div>

                <button className="rounded-full bg-black px-4 py-2 text-sm text-white">
                  구독 중
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-2xl bg-[#FAFAFA] p-5">
                  무제한 미래 편지
                </div>
                <div className="rounded-2xl bg-[#FAFAFA] p-5">
                  고화질 이미지 보관
                </div>
                <div className="rounded-2xl bg-[#FAFAFA] p-5">
                  프라이빗 백업
                </div>
                <div className="rounded-2xl bg-[#FAFAFA] p-5">앱 동기화</div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="rounded-xl border border-neutral-200 px-5 py-3 text-sm">
                  자세히 보기
                </button>

                <button className="rounded-xl border border-red-200 px-5 py-3 text-sm text-red-500">
                  구독 해지
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-7 shadow-sm">
            <h2 className="text-xl font-semibold">Inquiry</h2>

            <div className="mt-6 space-y-3">
              {faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-neutral-200 p-5"
                >
                  <p className="font-medium">{item.question}</p>
                  <p className="mt-2 text-sm leading-7 text-neutral-500">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#FAFAFA] p-5 text-sm">
              <p className="font-medium">Contact</p>

              <a
                href="mailto:hello@somedays.net"
                className="mt-2 block text-neutral-500"
              >
                hello@somedays.net
              </a>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-7 shadow-sm">
            <h2 className="text-xl font-semibold">Sign out</h2>

            <p className="mt-2 text-sm text-neutral-500">
              현재 로그인 상태를 종료해요.
            </p>

            <button className="mt-6 rounded-xl border border-red-200 px-5 py-3 text-sm text-red-500">
              로그아웃
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}