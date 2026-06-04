import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-white">상품을 찾을 수 없습니다</h1>
      <p className="mt-2 text-slate-400">요청하신 상품이 존재하지 않습니다.</p>
      <Link
        href="/products"
        className="mt-8 inline-block text-accent hover:text-accent-hover"
      >
        상품 목록으로
      </Link>
    </div>
  );
}
