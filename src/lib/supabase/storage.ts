import { createClient } from "./client";

const BUCKET_NAME = "submissions";

export async function uploadFile(file: File, path: string) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;
  return data;
}

export function getPublicUrl(path: string) {
  const supabase = createClient();
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFile(path: string) {
  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
  if (error) throw error;
}
