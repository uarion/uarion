import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type ProductStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "BLOCKED";

export type PendingProduct = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: ProductStatus;
  created_at: string;
  registrant_email: string | null;
};

/** 서버 전용 — PENDING_REVIEW 목록 (service_role) */
export async function fetchPendingProducts(): Promise<{
  products: PendingProduct[];
  error: string | null;
}> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("products")
    .select("id, user_id, title, description, price, category, status, created_at")
    .eq("status", "PENDING_REVIEW")
    .order("created_at", { ascending: true });

  if (error) {
    return { products: [], error: error.message };
  }

  const rows = data ?? [];
  const products: PendingProduct[] = await Promise.all(
    rows.map(async (row) => {
      let registrant_email: string | null = null;
      const { data: userData } = await supabase.auth.admin.getUserById(row.user_id);
      registrant_email = userData.user?.email ?? null;

      return {
        ...row,
        status: row.status as ProductStatus,
        registrant_email,
      };
    }),
  );

  return { products, error: null };
}

/** 서버 전용 — 승인 (status → APPROVED) */
export async function approveProduct(id: string): Promise<{ error: string | null }> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("products")
    .update({ status: "APPROVED" })
    .eq("id", id)
    .eq("status", "PENDING_REVIEW");

  return { error: error?.message ?? null };
}

/** 서버 전용 — 거절 (status → REJECTED) */
export async function rejectProduct(id: string): Promise<{ error: string | null }> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("products")
    .update({ status: "REJECTED" })
    .eq("id", id)
    .eq("status", "PENDING_REVIEW");

  return { error: error?.message ?? null };
}
