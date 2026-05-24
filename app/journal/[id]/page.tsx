"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/langHelper";

export default function JournalDetailPage() {
  const params = useParams<{ id: string }>();
  const { lang } = useLanguage(); // 현재 언어 (ko/en)
  const [journal, setJournal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJournal() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (data) setJournal(data);
      setLoading(false);
    }
    fetchJournal();
  }, [params.id]);

  if (loading) return <main className="p-12">로딩 중...</main>;
  if (!journal) return <main className="p-12">일기를 찾을 수 없어요.</main>;

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-12 py-8 text-[#111]">
      <div className="mx-auto max-w-[980px]">
        <Link href="/journal/list" className="text-sm text-neutral-500">
          ← 목록으로 돌아가기
        </Link>

        <section className="mt-8 rounded-2xl bg-white p-7 shadow-sm">
          {/* 다국어 데이터 출력 (jsonb -> t 함수) */}
          <h1 className="text-2xl font-bold">{t(journal.title, lang)}</h1>
          <p className="mt-6 whitespace-pre-wrap leading-7 text-neutral-700">
            {t(journal.content, lang)}
          </p>
          
          {journal.image_url && (
            <img src={journal.image_url} alt="journal-img" className="mt-4 rounded-xl" />
          )}
        </section>
      </div>
    </main>
  );
}