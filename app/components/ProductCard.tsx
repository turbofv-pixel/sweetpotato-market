"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { getImageUrl, getCategoryEmoji } from "@/lib/getProductImage";

const statusStyle: Record<Product["status"], string> = {
  판매중: "bg-green-100 text-green-800 border border-green-300",
  예약중: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  판매완료: "bg-gray-100 text-gray-500 border border-gray-300",
};

function formatPrice(price: number) {
  return `₩${price.toLocaleString("ko-KR")}`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

export default function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const imageUrl = getImageUrl(product.id);
  const emoji = getCategoryEmoji(product.title);

  return (
    <Link
      href={`/products/${product.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block bg-white rounded-sm overflow-hidden cursor-pointer group
        border-2 border-[#2E7D32]
        shadow-md hover:shadow-xl
        transition-all duration-300 ease-out
        hover:-translate-y-2"
    >
      <div className="relative aspect-square bg-green-50 overflow-hidden">
        {!imgError ? (
          <img
            src={imageUrl}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-50">
            <span
              className="text-5xl"
              style={{ animation: hovered ? "spin 0.6s linear infinite" : "none" }}
            >
              🍠
            </span>
          </div>
        )}

        {/* 카테고리 이모지 뱃지 */}
        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-base shadow">
          {emoji}
        </div>

        <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-sm ${statusStyle[product.status]}`}>
          {product.status}
        </span>
      </div>

      <div className="h-1 bg-[#FFD600]" />

      <div className="p-3">
        <h3 className="font-bold text-[#1B5E20] text-sm leading-snug line-clamp-2 mb-1">
          {product.title}
        </h3>
        <p className="font-bold text-base text-[#2E7D32]">
          {formatPrice(product.price)}
        </p>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-green-200">
          <span className="text-xs text-gray-500">🧑‍🌾 {product.seller_name}</span>
          <span className="text-xs text-gray-400">{formatDate(product.created_at)}</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Link>
  );
}
