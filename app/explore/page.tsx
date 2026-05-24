"use client";

import { useState } from "react";

type Visibility = "public" | "owner" | "private" | "followers";

type Comment = {
  id: number;
  author: string;
  content: string;
  visibility: Visibility;
  parentId?: number;
};

type Post = {
  id: number;
  author: string;
  title: string;
  date: string;
  body: string;
  reactions: number;
  isFollowing: boolean;
  comments: Comment[];
};

const followingPosts: Post[] = [
  {
    id: 1,
    author: "민지",
    title: "조금 괜찮았던 하루",
    date: "2025.05.27",
    body: "오늘은 생각보다 마음이 조용했다. 아침에 일어나서 햇빛이 좋았고, 커피도 맛있었다. 큰일은 없었지만 그래서 더 괜찮았던 하루였다.",
    reactions: 12,
    isFollowing: true,
    comments: [
      {
        id: 1,
        author: "수빈",
        content: "이런 날 좋다.",
        visibility: "public",
      },
      {
        id: 2,
        author: "나",
        content: "나도 오늘 비슷했어.",
        visibility: "public",
      },
    ],
  },
];

const publicPosts: Post[] = [
  {
    id: 2,
    author: "익명",
    title: "햇빛이 좋았던 날",
    date: "2025.05.26",
    body: "오랜만에 마음이 가벼웠다. 해야 할 일은 여전히 많았지만, 오늘은 이상하게 조급하지 않았다. 이런 마음을 오래 기억하고 싶다.",
    reactions: 34,
    isFollowing: false,
    comments: [
      {
        id: 1,
        author: "지윤",
        content: "문장이 너무 좋네요.",
        visibility: "public",
      },
    ],
  },
];

function visibilityLabel(visibility: Visibility) {
  if (visibility === "public") return "전체 공개";
  if (visibility === "owner") return "작성자에게만";
  if (visibility === "followers") return "팔로워 공개";
  return "비공개";
}

export default function ExplorePage() {
  const [tab, setTab] = useState<"following" | "public">("following");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [commentVisibility, setCommentVisibility] =
    useState<Visibility>("public");
  const [selectedReaction, setSelectedReaction] = useState("🙂");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  const posts = tab === "following" ? followingPosts : publicPosts;

  function addComment() {
    if (!selectedPost || !comment.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      author: "나",
      content: comment,
      visibility: replyTo?.visibility === "owner" ? "owner" : commentVisibility,
      parentId: replyTo?.id,
    };

    setSelectedPost({
      ...selectedPost,
      comments: [newComment, ...selectedPost.comments],
    });

    setComment("");
    setReplyTo(null);
    setCommentVisibility("public");
  }

  function startReply(item: Comment) {
    setReplyTo(item);
    setComment("");
    setCommentVisibility(item.visibility === "owner" ? "owner" : "public");
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-12 py-8 text-[#111]">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="text-3xl font-semibold">Explore</h1>
        <p className="mt-1 text-neutral-500">
          사람들이 공개한 기록을 둘러보세요.
        </p>

        <div className="mt-8 flex gap-2">
          <button
            onClick={() => setTab("following")}
            className={`rounded-full px-4 py-2 text-sm ${
              tab === "following"
                ? "bg-black text-white"
                : "border border-neutral-200 bg-white"
            }`}
          >
            팔로잉
          </button>

          <button
            onClick={() => setTab("public")}
            className={`rounded-full px-4 py-2 text-sm ${
              tab === "public"
                ? "bg-black text-white"
                : "border border-neutral-200 bg-white"
            }`}
          >
            전체 공개
          </button>
        </div>

        <section className="mt-6 space-y-4">
          {posts.map((post) => (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="block w-full rounded-2xl bg-white p-6 text-left shadow-sm hover:ring-1 hover:ring-black"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-sm text-neutral-500">
                    {post.author} · {post.date}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
                </div>

                {!post.isFollowing && (
                  <span className="h-fit rounded-full border border-neutral-300 px-3 py-1 text-xs">
                    Follow
                  </span>
                )}
              </div>

              <p className="mt-4 line-clamp-2 leading-7 text-neutral-600">
                {post.body}
              </p>

              <div className="mt-5 flex gap-4 text-sm text-neutral-500">
                <span>🙂 {post.reactions}</span>
                <span>댓글 {post.comments.length}</span>
              </div>
            </button>
          ))}
        </section>
      </div>

      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6">
          <section className="max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-7 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-400">
                  {selectedPost.author} · {selectedPost.date}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {selectedPost.title}
                </h2>
              </div>

              <button
                onClick={() => {
                  setSelectedPost(null);
                  setReplyTo(null);
                  setComment("");
                }}
                className="rounded-full border border-neutral-200 px-3 py-1 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="mt-6 whitespace-pre-line leading-8 text-neutral-700">
              {selectedPost.body}
            </p>

            <div className="mt-6 border-t border-neutral-100 pt-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">공감</h3>
                <p className="text-sm text-neutral-500">
                  총 {selectedPost.reactions + 1}명
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                {["🙂", "🥲", "🖤", "🌿", "✨"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedReaction(emoji)}
                    className={`h-10 w-10 rounded-full text-lg ${
                      selectedReaction === emoji
                        ? "bg-black text-white"
                        : "border border-neutral-200"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-neutral-100 pt-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">댓글</h3>
                <p className="text-sm text-neutral-500">
                  총 {selectedPost.comments.length}개
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {selectedPost.comments.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl bg-[#FAFAFA] p-4 ${
                      item.parentId ? "ml-8" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.author}</span>

                      <div className="flex gap-3 text-xs text-neutral-400">
                        <span>{visibilityLabel(item.visibility)}</span>

                        <button onClick={() => startReply(item)}>답장</button>
                      </div>
                    </div>

                    <p className="mt-2 text-sm leading-7 text-neutral-700">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>

              {replyTo && (
                <div className="mt-4 rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-500">
                  {replyTo.author}님에게 답장 중
                  <button
                    onClick={() => {
                      setReplyTo(null);
                      setComment("");
                      setCommentVisibility("public");
                    }}
                    className="ml-3 text-neutral-400"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setCommentVisibility("public")}
                  disabled={replyTo?.visibility === "owner"}
                  className={`rounded-full px-3 py-1 text-xs ${
                    commentVisibility === "public" &&
                    replyTo?.visibility !== "owner"
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  전체 공개
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
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-3 h-24 w-full resize-none rounded-2xl border border-neutral-200 p-4 text-sm outline-none"
                placeholder="가벼운 코멘트를 남겨보세요."
              />

              <div className="mt-3 flex justify-end">
                <button
                  onClick={addComment}
                  className="rounded-xl bg-black px-5 py-3 text-sm text-white"
                >
                  댓글 남기기
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}