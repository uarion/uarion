"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_LIMITS,
  validateProductForm,
  type ProductFormValues,
} from "@/lib/products";
import { getSupabase } from "@/lib/supabaseClient";

const inputClassName =
  "w-full rounded-lg border border-navy-700 bg-navy-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

const initialForm: ProductFormValues = {
  title: "",
  description: "",
  price: "",
  category: "",
};

export default function SellPageClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [form, setForm] = useState<ProductFormValues>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data } = await getSupabase().auth.getSession();
      if (mounted) {
        setUser(data.session?.user ?? null);
        setAuthLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  function updateField<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFeedback(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);

    const validationError = validateProductForm(form);
    if (validationError) {
      setFeedback({ type: "error", text: validationError });
      return;
    }

    const {
      data: { user: currentUser },
    } = await getSupabase().auth.getUser();

    if (!currentUser) {
      setFeedback({ type: "error", text: "로그인이 필요합니다." });
      return;
    }

    setSubmitting(true);

    const { error } = await getSupabase().from("products").insert({
      title: form.title.trim(),
      description: form.description,
      price: Number(form.price.trim()),
      category: form.category,
    });

    setSubmitting(false);

    if (error) {
      setFeedback({
        type: "error",
        text: error.message || "등록에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      });
      return;
    }

    setForm(initialForm);
    setFeedback({
      type: "success",
      text: "등록 완료, 관리자 승인 후 공개됩니다.",
    });
    router.refresh();
  }

  if (authLoading) {
    return (
      <div className="page-container py-12">
        <div className="mx-auto max-w-xl animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-navy-800" />
          <div className="h-64 rounded-xl bg-navy-900" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container py-12">
        <div className="mx-auto max-w-xl rounded-xl border border-navy-700 bg-navy-900 p-8 text-center">
          <h1 className="text-2xl font-bold text-white">상품 등록</h1>
          <p className="text-body mt-3 text-slate-400">
            상품을 등록하려면 로그인이 필요합니다.
          </p>
          <Link
            href="/login?next=/sell"
            className="mt-6 inline-flex rounded-lg bg-accent px-6 py-3 text-base font-semibold text-navy-950 transition-colors hover:bg-accent-hover"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">상품 등록</h1>
          <p className="text-body mt-2 text-slate-400">
            제목·설명·가격·카테고리를 입력하면 관리자 검토 후 마켓에 공개됩니다.
          </p>
        </div>

        {feedback && (
          <div
            className={`mb-6 rounded-lg px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border border-accent/30 bg-accent/10 text-accent"
                : "border border-red-500/30 bg-red-500/10 text-red-300"
            }`}
            role="alert"
          >
            {feedback.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-navy-700 bg-navy-900 p-8"
          noValidate
        >
          <div>
            <label htmlFor="title" className="text-label mb-2 block">
              제목 <span className="text-slate-500">(필수, 최대 {PRODUCT_LIMITS.titleMax}자)</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={PRODUCT_LIMITS.titleMax}
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="상품 제목을 입력하세요"
              className={inputClassName}
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="description" className="text-label mb-2 block">
              설명 <span className="text-slate-500">(최대 {PRODUCT_LIMITS.descriptionMax}자)</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              maxLength={PRODUCT_LIMITS.descriptionMax}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="상품에 대한 설명을 입력하세요"
              className={`${inputClassName} resize-y`}
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="price" className="text-label mb-2 block">
              가격 (원){" "}
              <span className="text-slate-500">
                (0 ~ {PRODUCT_LIMITS.priceMax.toLocaleString()})
              </span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min={PRODUCT_LIMITS.priceMin}
              max={PRODUCT_LIMITS.priceMax}
              step={1}
              required
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="0"
              className={inputClassName}
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="category" className="text-label mb-2 block">
              카테고리 <span className="text-slate-500">(필수)</span>
            </label>
            <select
              id="category"
              name="category"
              required
              value={form.category}
              onChange={(e) =>
                updateField("category", e.target.value as ProductFormValues["category"])
              }
              className={inputClassName}
              disabled={submitting}
            >
              <option value="" disabled>
                카테고리를 선택하세요
              </option>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent px-6 py-3 text-base font-semibold text-navy-950 transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "등록 중…" : "등록하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
