import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import ProductCard from "./components/ProductCard";

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("상품 목록 조회 실패:", error);
    return [];
  }
  return data ?? [];
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      {/* 시골 감성 히어로 배너 */}
      <div className="bg-[#2E7D32] text-white py-8 px-4 text-center border-b-4 border-[#FFD600]">
        <div className="text-4xl mb-2">🌾🍠🌾</div>
        <h1 className="text-2xl font-bold mb-1">우리 동네 중고 직거래 장터</h1>
        <p className="text-green-200 text-sm">정직하고 따뜻한 거래, 고구마마켓에서 시작하세요</p>
        <div className="flex justify-center gap-6 mt-4 text-sm text-green-100">
          <span>🐄 믿을 수 있는 판매자</span>
          <span>🌽 다양한 상품</span>
          <span>🤝 직거래 문화</span>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* 섹션 제목 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-2 bg-[#2E7D32] rounded-full" />
          <h2 className="text-xl font-bold text-[#1B5E20]">전체 상품</h2>
          <span className="bg-[#FFD600] text-[#1B5E20] text-xs font-bold px-2 py-0.5 rounded-full border border-[#1B5E20]">
            총 {products.length}개
          </span>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <span className="text-5xl mb-4">🌾</span>
            <p className="text-lg font-medium">등록된 상품이 없어요</p>
            <p className="text-sm mt-1">첫 번째 판매자가 되어보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
