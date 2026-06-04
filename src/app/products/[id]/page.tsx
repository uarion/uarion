import Link from "next/link";
import { notFound } from "next/navigation";
import { getDummyProductById } from "@/lib/dummy-products";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("ko-KR").format(price);
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = getDummyProductById(id);

  if (!product) {
    notFound();
  }

  const { verificationReport } = product;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/products"
        className="mb-8 inline-block text-sm text-slate-400 transition-colors hover:text-accent"
      >
        ← 검증 등록물 목록으로
      </Link>

      <article className="overflow-hidden rounded-xl border border-navy-700 bg-navy-900">
        <div className="flex h-48 items-center justify-center bg-navy-800">
          <span className="text-6xl text-navy-700">◆</span>
        </div>
        <div className="p-8">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-md bg-navy-800 px-2.5 py-1 text-sm font-semibold text-accent ring-1 ring-accent/25">
              검증점수 {product.verificationScore}
            </span>
            <span className="rounded-md bg-navy-800 px-2.5 py-1 text-sm text-slate-400 ring-1 ring-navy-600">
              {product.certificationStatus}
            </span>
          </div>
          <p className="mb-2 text-sm text-slate-500">등록물 ID: {product.id}</p>
          <h1 className="mb-4 text-3xl font-bold text-white">{product.title}</h1>
          <p className="mb-8 text-2xl font-semibold text-slate-300">
            ₩{formatPrice(product.price)}
          </p>
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">
            등록물 설명
          </h2>
          <p className="leading-relaxed text-slate-300">{product.description}</p>

          <section className="mt-10 rounded-lg border border-navy-700 bg-navy-950/60 p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">검증 리포트</h2>

            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-accent">
                {product.verificationScore}
              </span>
              <span className="text-slate-500">/ 100</span>
              <span className="ml-2 text-sm text-slate-500">검증 점수</span>
            </div>

            <ul className="mb-6 space-y-4">
              {verificationReport.criteria.map((criterion) => (
                <li
                  key={criterion.label}
                  className="border-b border-navy-700/80 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-300">
                      {criterion.label}
                    </span>
                    <span className="text-sm font-semibold text-accent">
                      {criterion.score}점
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{criterion.note}</p>
                </li>
              ))}
            </ul>

            <p className="mb-2 text-sm text-slate-400">
              {verificationReport.certificationLabel}
            </p>
            <p className="text-sm text-slate-500">
              등록 시점: {product.registeredAt} (기록됨)
            </p>
          </section>

          <button
            type="button"
            disabled
            className="mt-10 w-full cursor-not-allowed rounded-lg bg-navy-700 px-6 py-3 text-base font-semibold text-slate-500"
          >
            구매하기 (준비 중)
          </button>
        </div>
      </article>
    </div>
  );
}
