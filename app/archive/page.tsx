export default function ArchivePage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] p-10">
      <h1 className="text-3xl font-semibold">Archive</h1>

      <div className="mt-8 grid grid-cols-2 gap-5">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-neutral-400">2025 Spring</p>

            <h2 className="mt-2 text-xl font-semibold">
              기억 #{item}
            </h2>

            <p className="mt-3 text-neutral-500">
              시간이 지나 다시 읽게 된 기록입니다.
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}