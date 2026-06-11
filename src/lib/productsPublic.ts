import { createClient } from "@supabase/supabase-js";

type ProductMetaRow = {
  id: string;
  title: string;
  description: string;
};

type ProductSitemapRow = {
  id: string;
  updated_at: string;
};

function getPublicSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

/** SEO 메타용 — 승인된 공개 상품 1건 */
export async function fetchApprovedProductMeta(
  id: string,
): Promise<ProductMetaRow | null> {
  const supabase = getPublicSupabase();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, title, description")
    .eq("id", id)
    .eq("status", "APPROVED")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as ProductMetaRow;
}

/** sitemap용 — 승인된 공개 상품 목록 */
export async function fetchApprovedProductsForSitemap(): Promise<
  ProductSitemapRow[]
> {
  const supabase = getPublicSupabase();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, updated_at")
    .eq("status", "APPROVED")
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as ProductSitemapRow[];
}
