export default function PremiumPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] p-10">
      <h1 className="text-3xl font-semibold">Premium</h1>

      <div className="mt-8 rounded-3xl bg-white p-10 shadow-sm">
        <h2 className="text-2xl font-semibold">
          30일 무료 체험 시작하기
        </h2>

        <p className="mt-4 text-neutral-500">
          더 많은 기록과 영구 보관 기능을 이용해보세요.
        </p>

        <button className="mt-8 rounded-xl bg-black px-6 py-4 text-white">
          Premium 시작하기
        </button>
      </div>
    </main>
  );
}