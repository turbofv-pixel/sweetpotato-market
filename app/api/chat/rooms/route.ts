import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const { product_id } = await request.json()
  if (!product_id) {
    return NextResponse.json({ error: 'product_id가 필요합니다.' }, { status: 400 })
  }

  const buyerName = user.user_metadata?.name ?? user.email?.split('@')[0] ?? '익명'

  // 이미 존재하는 채팅방 조회
  const { data: existing } = await supabase
    .from('chat_rooms')
    .select('id')
    .eq('product_id', product_id)
    .eq('buyer_id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ room_id: existing.id })
  }

  // 새 채팅방 생성
  const { data: room, error } = await supabase
    .from('chat_rooms')
    .insert({ product_id, buyer_id: user.id, buyer_name: buyerName })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: '채팅방 생성 실패' }, { status: 500 })
  }

  return NextResponse.json({ room_id: room.id })
}
