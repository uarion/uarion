import Link from "next/link";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("ko-KR").format(price);
}

function statusStyles(status: string) {
  if (status === "검증됨") {
    return "bg-accent/15 text-accent ring-accent/30";
  }
  return "bg-slate-500/15 text-slate-400 ring-slate-500/30";
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/market/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-navy-700 bg-navy-900 transition-colors hover:border-accent/40 hover:bg-navy-800"
    >
      <div className="flex h-36 items-center justify-center bg-navy-800/80">
        <span className="text-4xl text-navy-700 transition-colors group-hover:text-accent/30">
          ◆
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-label rounded-md bg-navy-800 px-2 py-0.5 font-semibold text-accent ring-1 ring-accent/25">
            검증점수 {product.verificationScore}
          </span>
          <span
            className={`text-label rounded-md px-2 py-0.5 font-medium ring-1 ${statusStyles(product.certificationStatus)}`}
          >
            {product.certificationStatus}
          </span>
        </div>
        <h2 className="text-lg font-semibold text-white group-hover:text-accent lg:text-xl">
          {product.title}
        </h2>
        <p className="text-body-card line-clamp-2 flex-1 text-slate-400">
          {product.description}
        </p>
        <p className="text-body mt-2 font-semibold text-slate-300">
          ₩{formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
