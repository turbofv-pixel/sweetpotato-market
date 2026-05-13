import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return '방금 전'
  if (mins < 60) return `${mins}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`
  return date.toLocaleDateString('ko-KR')
}

export default async function ChatListPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: rooms } = await supabase
    .from('chat_rooms')
    .select(`
      id,
      buyer_name,
      created_at,
      product:products(id, title, price, status),
      messages(content, created_at, sender_name)
    `)
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  const roomsWithLastMsg = (rooms ?? []).map(room => {
    const msgs = (room.messages as { content: string; created_at: string; sender_name: string }[]) ?? []
    const last = msgs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
    return { ...room, lastMsg: last ?? null }
  })

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-2 bg-[#2E7D32] rounded-full" />
        <h1 className="text-xl font-bold text-[#1B5E20]">내 채팅</h1>
        <span className="bg-[#FFD600] text-[#1B5E20] text-xs font-bold px-2 py-0.5 rounded-full border border-[#1B5E20]">
          {roomsWithLastMsg.length}개
        </span>
      </div>

      {roomsWithLastMsg.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <span className="text-5xl mb-4">💬</span>
          <p className="text-lg font-medium">아직 채팅이 없어요</p>
          <p className="text-sm mt-1">상품 페이지에서 채팅을 시작해보세요!</p>
          <a href="/" className="mt-4 text-[#2E7D32] font-bold text-sm hover:underline">
            상품 보러 가기 →
          </a>
        </div>
      ) : (
        <ul className="space-y-2">
          {roomsWithLastMsg.map((room) => {
            const productRaw = room.product
            const product = (Array.isArray(productRaw) ? productRaw[0] : productRaw) as { id: string; title: string; price: number; status: string } | null
            return (
              <li key={room.id}>
                <a
                  href={`/chat/${room.id}`}
                  className="flex items-center gap-4 bg-white border-2 border-gray-200
                    hover:border-[#2E7D32] rounded-sm p-4 transition-colors group"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    🍠
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1B5E20] text-sm truncate group-hover:text-[#2E7D32]">
                      {product?.title ?? '상품 없음'}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {room.lastMsg ? room.lastMsg.content : '아직 메시지가 없습니다'}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">
                    {room.lastMsg
                      ? formatDate(room.lastMsg.created_at)
                      : formatDate(room.created_at)}
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
