import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import { notFound } from "next/navigation";
import DeleteButton from "./DeleteButton";
import ActionButtons from "./ActionButtons";
import { getImageUrl, getCategoryEmoji } from "@/lib/getProductImage";

async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

const statusStyle: Record<Product["status"], string> = {
  판매중: "bg-green-100 text-green-800 border border-green-300",
  예약중: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  판매완료: "bg-gray-100 text-gray-500 border border-gray-300",
};

function formatPrice(price: number) {
  return `₩${price.toLocaleString("ko-KR")}`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const imageUrl = getImageUrl(product.id, 600);
  const emoji = getCategoryEmoji(product.title);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <a
        href="/"
        className="inline-flex items-center gap-1 text-sm text-[#2E7D32] font-bold mb-6 hover:underline"
      >
        ← 목록으로 돌아가기
      </a>

      <div className="bg-white border-2 border-[#2E7D32] rounded-sm shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* 이미지 */}
          <div className="aspect-square bg-green-50 relative">
            <img
              src={imageUrl}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center text-xl shadow">
              {emoji}
            </div>
            <span className={`absolute top-3 left-3 text-sm font-bold px-3 py-1 rounded-sm ${statusStyle[product.status]}`}>
              {product.status}
            </span>
          </div>

          {/* 상세 정보 */}
          <div className="p-6 flex flex-col gap-4">
            <div className="border-b-2 border-dashed border-[#FFD600] pb-4">
              <h1 className="text-2xl font-bold text-[#1B5E20] leading-snug">
                {product.title}
              </h1>
              <p className="text-3xl font-bold text-[#2E7D32] mt-2">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-base">🧑‍🌾</span>
                <span className="font-bold text-[#1B5E20]">{product.seller_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">📅</span>
                <span>{formatDate(product.created_at)}</span>
              </div>
            </div>

            {product.description && (
              <div className="bg-green-50 border border-green-200 rounded-sm p-4">
                <p className="text-sm font-bold text-[#1B5E20] mb-1">상품 설명</p>
                <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            <ActionButtons productId={product.id} productStatus={product.status} />
            <div className="pt-2">
              <DeleteButton productId={product.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
