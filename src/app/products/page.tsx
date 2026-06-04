import ProductCard from "@/components/ProductCard";
import { dummyProducts } from "@/lib/dummy-products";

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">검증 등록물 목록</h1>
        <p className="mt-2 text-slate-400">
          검증 점수와 인증 상태를 확인한 뒤, 상세 페이지에서 검증 리포트를
          살펴보세요.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dummyProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
