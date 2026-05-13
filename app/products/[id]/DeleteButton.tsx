"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DeleteButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { error } = await supabase.from("products").delete().eq("id", productId);
    setLoading(false);

    if (error) {
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
      return;
    }
    router.push("/");
  }

  return (
    <>
      {/* 삭제 버튼 */}
      <button
        onClick={() => setOpen(true)}
        className="w-full text-center bg-white text-red-500 font-bold py-3 rounded-sm
          hover:bg-red-50 active:scale-95 transition-all duration-150
          border-2 border-red-300"
      >
        🗑️ 상품 삭제
      </button>

      {/* 모달 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => !loading && setOpen(false)}
        >
          {/* 배경 오버레이 */}
          <div className="absolute inset-0 bg-black/30" />

          {/* 모달 박스 */}
          <div
            className="relative bg-white border-4 border-[#2E7D32] rounded-sm shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단 노란 띠 */}
            <div className="h-2 bg-[#FFD600]" />

            <div className="p-6 text-center">
              <div className="text-5xl mb-3">🗑️</div>
              <h2 className="text-xl font-bold text-[#1B5E20] mb-2">상품을 삭제할까요?</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                삭제된 상품은 복구할 수 없어요.<br />
                정말 삭제하시겠어요?
              </p>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-bold rounded-sm
                  hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-sm
                  hover:bg-red-600 active:scale-95 transition-all
                  border-2 border-red-700 shadow-md
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "삭제 중..." : "삭제 확인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
