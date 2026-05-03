import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Database types ─────────────────────────────────────────────────────────────

export interface DbFabric {
  id: string;
  name: string;
  color: string;
  color_hex: string;
  image_url: string | null;
  price: number;
  unit: string;
  in_stock: boolean;
  available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbService {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ── Fabric helpers ─────────────────────────────────────────────────────────────

export async function getFabrics(): Promise<DbFabric[]> {
  const { data, error } = await supabase
    .from("fabrics")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function upsertFabric(
  fabric: Partial<DbFabric> & { name: string; color: string; price: number; unit: string }
): Promise<DbFabric> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("fabrics")
    .upsert({ ...fabric, updated_at: now })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteFabric(id: string): Promise<void> {
  const { error } = await supabase.from("fabrics").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadFabricImage(
  file: File,
  fabricId: string
): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${fabricId}.${ext}`;
  const { error } = await supabase.storage
    .from("fabrics")
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("fabrics").getPublicUrl(path);
  return data.publicUrl;
}

// ── Design helpers ─────────────────────────────────────────────────────────────

export interface DbDesign {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price_surcharge: number;
  available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function getDesigns(): Promise<DbDesign[]> {
  const { data, error } = await supabase
    .from("designs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function upsertDesign(
  design: Partial<DbDesign> & { name: string; price_surcharge: number }
): Promise<DbDesign> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("designs")
    .upsert({ ...design, updated_at: now })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDesign(id: string): Promise<void> {
  const { error } = await supabase.from("designs").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadDesignImage(
  file: File,
  designId: string
): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${designId}.${ext}`;
  const { error } = await supabase.storage
    .from("designs")
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("designs").getPublicUrl(path);
  return data.publicUrl;
}

// ── Service helpers ────────────────────────────────────────────────────────────

export async function getServices(): Promise<DbService[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function upsertService(
  service: Partial<DbService> & { name: string; price: number; unit: string }
): Promise<DbService> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("services")
    .upsert({ ...service, updated_at: now })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}
