import { createSupabaseServerClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import ChatWindow from './ChatWindow'

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`
}

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: room } = await supabase
    .from('chat_rooms')
    .select(`
      id, buyer_id, buyer_name,
      product:products(id, title, price, status, seller_name)
    `)
    .eq('id', roomId)
    .single()

  if (!room) notFound()

  const { data: messages } = await supabase
    .from('messages')
    .select('id, sender_id, sender_name, content, created_at')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })

  const productRaw = room.product
  const product = (Array.isArray(productRaw) ? productRaw[0] : productRaw) as { id: string; title: string; price: number; status: string; seller_name: string } | null
  const userName = user.user_metadata?.name ?? user.email?.split('@')[0] ?? '익명'

  const statusColor: Record<string, string> = {
    '판매중': 'bg-green-100 text-green-800',
    '예약중': 'bg-yellow-100 text-yellow-800',
    '판매완료': 'bg-gray-100 text-gray-500',
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>

      {/* 상단 네비 */}
      <div className="flex items-center gap-2 mb-4">
        <a href="/chat" className="text-sm text-[#2E7D32] font-bold hover:underline">← 채팅 목록</a>
      </div>

      <div className="flex-1 flex flex-col bg-white border-2 border-[#2E7D32] rounded-sm shadow-lg overflow-hidden">

        {/* 상품 정보 헤더 */}
        {product && (
          <a
            href={`/products/${product.id}`}
            className="flex items-center gap-3 p-3 border-b-2 border-[#FFD600] bg-green-50 hover:bg-green-100 transition-colors"
          >
            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-xl flex-shrink-0">
              🍠
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1B5E20] text-sm truncate">{product.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-bold text-[#E67E22]">{formatPrice(product.price)}</span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${statusColor[product.status] ?? ''}`}>
                  {product.status}
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-400">🧑‍🌾 {product.seller_name}</span>
          </a>
        )}

        {/* 채팅창 */}
        <ChatWindow
          roomId={roomId}
          currentUserId={user.id}
          currentUserName={userName}
          initialMessages={messages ?? []}
        />
      </div>
    </div>
  )
}
