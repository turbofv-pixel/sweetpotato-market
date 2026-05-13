'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

interface Props {
  productId: string
  productStatus: '판매중' | '예약중' | '판매완료'
}

export default function ActionButtons({ productId, productStatus }: Props) {
  const router = useRouter()
  const [chatLoading, setChatLoading] = useState(false)
  const [wishLoading, setWishLoading] = useState(false)

  async function handleChat() {
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    setChatLoading(true)
    const res = await fetch('/api/chat/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId }),
    })
    const data = await res.json()
    setChatLoading(false)

    if (data.room_id) {
      router.push(`/chat/${data.room_id}`)
    }
  }

  async function handleWishlist() {
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    setWishLoading(true)
    await new Promise(r => setTimeout(r, 400))
    setWishLoading(false)
    alert('관심 목록에 추가되었습니다! ❤️')
  }

  return (
    <div className="flex flex-col gap-2 mt-auto pt-4">
      {productStatus === '판매중' && (
        <a
          href={`/checkout/${productId}`}
          className="w-full text-center bg-[#E67E22] text-white font-bold py-3 rounded-sm
            hover:bg-[#D35400] active:scale-95 transition-all duration-150
            border-2 border-[#D35400] shadow-md"
        >
          💳 바로 결제하기
        </a>
      )}
      <button
        onClick={handleChat}
        disabled={chatLoading}
        className="w-full bg-[#2E7D32] text-white font-bold py-3 rounded-sm
          hover:bg-[#1B5E20] active:scale-95 transition-all duration-150
          border-2 border-[#1B5E20] shadow-md
          disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {chatLoading ? '채팅방 만드는 중...' : '💬 채팅으로 거래하기'}
      </button>
      <button
        onClick={handleWishlist}
        disabled={wishLoading}
        className="w-full bg-[#FFD600] text-[#1B5E20] font-bold py-3 rounded-sm
          hover:bg-yellow-400 active:scale-95 transition-all duration-150
          border-2 border-[#1B5E20] shadow-md
          disabled:opacity-60"
      >
        {wishLoading ? '추가 중...' : '❤️ 관심 목록에 추가'}
      </button>
      <a
        href={`/products/${productId}/edit`}
        className="w-full text-center bg-white text-gray-600 font-bold py-3 rounded-sm
          hover:bg-gray-50 active:scale-95 transition-all duration-150
          border-2 border-gray-300"
      >
        ✏️ 상품 수정
      </a>
    </div>
  )
}
