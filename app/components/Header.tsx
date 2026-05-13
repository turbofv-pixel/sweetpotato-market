import { createSupabaseServerClient } from '@/lib/supabase-server'
import LogoutButton from './LogoutButton'

export default async function Header() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const displayName = user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? null

  return (
    <>
      {/* 농협 상단 띠 */}
      <div className="bg-[#1B5E20] text-[#FFD600] text-xs text-center py-1 tracking-widest font-bold">
        🌾 농부님들의 정직한 직거래 장터 🌾
      </div>

      {/* 메인 헤더 */}
      <header className="bg-[#2E7D32] sticky top-0 z-10 shadow-xl border-b-4 border-[#FFD600]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <a href="/" className="flex items-center gap-3 group">
              <div className="bg-[#FFD600] rounded-full w-10 h-10 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl">🍠</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-xl text-white tracking-wider">고구마마켓</span>
                <span className="text-xs text-green-200">SweetPotato-Market</span>
              </div>
            </a>

            <div className="hidden sm:flex items-center gap-6 text-green-100 text-sm">
              <span>🌽 신선한 거래</span>
              <span>🐄 믿을 수 있는 판매자</span>
            </div>

            <nav className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end leading-tight">
                    <span className="text-white text-sm font-bold">🧑‍🌾 {displayName}</span>
                    <LogoutButton />
                  </div>
                  {/* 모바일 */}
                  <div className="sm:hidden">
                    <LogoutButton />
                  </div>
                  <a
                    href="/chat"
                    className="text-white text-sm font-bold px-3 py-2 rounded-sm
                      hover:bg-[#1B5E20] transition-colors border-2 border-green-400"
                  >
                    💬 채팅
                  </a>
                  <a
                    href="/products/new"
                    className="bg-[#FFD600] text-[#1B5E20] text-sm font-bold px-4 py-2 rounded-sm
                      hover:bg-yellow-300 hover:scale-105 active:scale-95
                      transition-all duration-200 shadow-md border-2 border-[#1B5E20]"
                  >
                    + 상품 등록
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <a
                    href="/login"
                    className="text-white text-sm font-bold px-4 py-2 rounded-sm
                      hover:bg-[#1B5E20] transition-colors border-2 border-green-400"
                  >
                    로그인
                  </a>
                  <a
                    href="/products/new"
                    className="bg-[#FFD600] text-[#1B5E20] text-sm font-bold px-4 py-2 rounded-sm
                      hover:bg-yellow-300 hover:scale-105 active:scale-95
                      transition-all duration-200 shadow-md border-2 border-[#1B5E20]"
                  >
                    + 상품 등록
                  </a>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}
