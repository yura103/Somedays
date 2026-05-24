"use server";

// 수정된 부분: 서버 전용 클라이언트 사용
import { createClient } from "@/lib/supabase.server"; 

export async function saveJournal(data: { title: string; content: string; user_id: string }) {
  const supabase = await createClient(); // 서버용 클라이언트
  const { data: result, error } = await supabase
    .from("posts") // 우리가 정한 마스터 스키마는 'posts'입니다!
    .insert([data]);
  
  if (error) throw error;
  return result;
}

export async function getLetters() {
  const supabase = await createClient(); // 서버용 클라이언트
  const { data, error } = await supabase
    .from("posts") // 우리가 정한 마스터 스키마는 'posts'입니다!
    .select("*")
    .eq('type', 'letter') // 편지만 가져오기
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data;
}