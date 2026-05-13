"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";

interface FormData {
  title: string;
  price: string;
  description: string;
  image_url: string;
  seller_name: string;
  status: Product["status"];
}

interface FormErrors {
  title?: string;
  price?: string;
  seller_name?: string;
}

export default function EditForm({ product }: { product: Product }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    title: product.title,
    price: String(product.price),
    description: product.description ?? "",
    image_url: product.image_url ?? "",
    seller_name: product.seller_name,
    status: product.status,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.title.trim()) newErrors.title = "상품명을 입력해주세요.";
    if (!form.price.trim()) {
      newErrors.price = "가격을 입력해주세요.";
    } else if (isNaN(Number(form.price)) || Number(form.price) < 0) {
      newErrors.price = "올바른 가격을 입력해주세요.";
    }
    if (!form.seller_name.trim()) newErrors.seller_name = "판매자 이름을 입력해주세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError("");

    const { error } = await supabase
      .from("products")
      .update({
        title: form.title.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        image_url: form.image_url.trim() || null,
        seller_name: form.seller_name.trim(),
        status: form.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id);

    setLoading(false);

    if (error) {
      setServerError("저장에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    router.push(`/products/${product.id}`);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="mb-6">
        <a
          href={`/products/${product.id}`}
          className="inline-flex items-center gap-1 text-sm text-[#2E7D32] font-bold mb-4 hover:underline"
        >
          ← 상세 페이지로 돌아가기
        </a>
        <div className="flex items-center gap-3">
          <div className="h-8 w-2 bg-[#2E7D32] rounded-full" />
          <h1 className="text-2xl font-bold text-[#1B5E20]">상품 수정</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1 ml-5">상품 정보를 수정해주세요 🌾</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-[#2E7D32] rounded-sm shadow-lg overflow-hidden"
      >
        <div className="h-2 bg-[#FFD600]" />

        <div className="p-6 space-y-5">
          {serverError && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-sm">
              ⚠️ {serverError}
            </div>
          )}

          {/* 상품명 */}
          <div>
            <label className="block text-sm font-bold text-[#1B5E20] mb-1">
              상품명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="예) 아이폰 13 프로 256GB"
              className={`w-full border-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors
                focus:border-[#2E7D32]
                ${errors.title ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">⚠️ {errors.title}</p>}
          </div>

          {/* 가격 */}
          <div>
            <label className="block text-sm font-bold text-[#1B5E20] mb-1">
              가격 (원) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">₩</span>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={`w-full border-2 rounded-sm pl-7 pr-3 py-2 text-sm outline-none transition-colors
                  focus:border-[#2E7D32]
                  ${errors.price ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"}`}
              />
            </div>
            {form.price && !errors.price && (
              <p className="text-xs text-[#2E7D32] mt-1">
                = ₩{Number(form.price).toLocaleString("ko-KR")}
              </p>
            )}
            {errors.price && <p className="text-red-500 text-xs mt-1">⚠️ {errors.price}</p>}
          </div>

          {/* 판매 상태 */}
          <div>
            <label className="block text-sm font-bold text-[#1B5E20] mb-1">
              판매 상태
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-sm px-3 py-2 text-sm outline-none
                focus:border-[#2E7D32] transition-colors bg-white"
            >
              <option value="판매중">판매중</option>
              <option value="예약중">예약중</option>
              <option value="판매완료">판매완료</option>
            </select>
          </div>

          {/* 판매자 이름 */}
          <div>
            <label className="block text-sm font-bold text-[#1B5E20] mb-1">
              판매자 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="seller_name"
              value={form.seller_name}
              onChange={handleChange}
              placeholder="예) 홍길동"
              className={`w-full border-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors
                focus:border-[#2E7D32]
                ${errors.seller_name ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"}`}
            />
            {errors.seller_name && <p className="text-red-500 text-xs mt-1">⚠️ {errors.seller_name}</p>}
          </div>

          {/* 상품 설명 */}
          <div>
            <label className="block text-sm font-bold text-[#1B5E20] mb-1">
              상품 설명
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="상품 상태, 구매 시기, 하자 여부 등을 자세히 적어주세요."
              rows={4}
              className="w-full border-2 border-gray-300 rounded-sm px-3 py-2 text-sm outline-none
                focus:border-[#2E7D32] transition-colors resize-none"
            />
          </div>

          {/* 이미지 URL */}
          <div>
            <label className="block text-sm font-bold text-[#1B5E20] mb-1">
              이미지 URL <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border-2 border-gray-300 rounded-sm px-3 py-2 text-sm outline-none
                focus:border-[#2E7D32] transition-colors"
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            type="button"
            onClick={() => router.push(`/products/${product.id}`)}
            className="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-bold rounded-sm
              hover:bg-gray-50 active:scale-95 transition-all duration-150"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] py-3 bg-[#2E7D32] text-white font-bold rounded-sm
              hover:bg-[#1B5E20] active:scale-95 transition-all duration-150
              border-2 border-[#1B5E20] shadow-md
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "저장 중..." : "✅ 수정 완료"}
          </button>
        </div>
      </form>
    </div>
  );
}
