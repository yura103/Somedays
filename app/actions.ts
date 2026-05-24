"use server";

import { createAdminClient } from "@/lib/supabase"; // 여기를 수정하세요!

export async function saveJournal(data: { title: string; content: string; user_id: string }) {
  const supabase = await createAdminClient(); // 서버용 클라이언트 사용
  const { data: result, error } = await supabase
    .from("journals")
    .insert([data]);
  
  if (error) throw error;
  return result;
}

export async function getLetters() {
  const supabase = await createAdminClient(); // 서버용 클라이언트 사용
  const { data, error } = await supabase
    .from("letters")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data;
}