'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')

  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const supabase = createSupabaseBrowserClient()

  function showMsg(text: string, error = false) {
    setMessage(text)
    setIsError(error)
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { showMsg('이메일과 비밀번호를 입력해주세요.', true); return }
    setLoading(true)
    setMessage('')

    if (tab === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { showMsg('이메일 또는 비밀번호가 올바르지 않습니다.', true) }
      else { router.push('/'); router.refresh() }
    } else {
      if (!name.trim()) { showMsg('이름을 입력해주세요.', true); setLoading(false); return }
      const { error } = await supabase.auth.signUp({
        email, password, options: { data: { name: name.trim() } },
      })
      if (error) { showMsg(error.message, true) }
      else { router.push('/'); router.refresh() }
    }
    setLoading(false)
  }

  async function handleOAuth(provider: 'google' | 'kakao') {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { showMsg('소셜 로그인에 실패했습니다.', true); setLoading(false) }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍠</div>
          <h1 className="text-2xl font-bold text-[#1B5E20]">고구마마켓</h1>
          <p className="text-sm text-gray-500 mt-1">우리 동네 정직한 중고 직거래 장터</p>
        </div>

        <div className="bg-white border-2 border-[#2E7D32] rounded-sm shadow-lg overflow-hidden">
          <div className="h-2 bg-[#FFD600]" />
          <div className="p-6">
            {errorParam && (
              <div className="mb-4 bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-sm">
                ⚠️ 로그인 중 오류가 발생했습니다. 다시 시도해주세요.
              </div>
            )}

            <div className="flex mb-6 border-2 border-[#2E7D32] rounded-sm overflow-hidden">
              <button onClick={() => { setTab('login'); setMessage('') }}
                className={`flex-1 py-2 text-sm font-bold transition-colors ${tab === 'login' ? 'bg-[#2E7D32] text-white' : 'bg-white text-[#2E7D32] hover:bg-green-50'}`}>
                로그인
              </button>
              <button onClick={() => { setTab('signup'); setMessage('') }}
                className={`flex-1 py-2 text-sm font-bold transition-colors ${tab === 'signup' ? 'bg-[#2E7D32] text-white' : 'bg-white text-[#2E7D32] hover:bg-green-50'}`}>
                회원가입
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <button onClick={() => handleOAuth('google')} disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-sm font-bold text-sm text-gray-700 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google로 계속하기
              </button>
              <button onClick={() => handleOAuth('kakao')} disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-[#FEE500] border-2 border-[#FEE500] rounded-sm font-bold text-sm text-[#3C1E1E] hover:bg-yellow-300 active:scale-95 transition-all disabled:opacity-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#3C1E1E">
                  <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.7 1.74 5.07 4.38 6.48L5.4 21l4.5-2.88C10.56 18.3 11.28 18.36 12 18.36c5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/>
                </svg>
                카카오로 계속하기
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">또는 이메일로</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-3">
              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-[#1B5E20] mb-1">이름</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="홍길동"
                    className="w-full border-2 border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#2E7D32]" />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-[#1B5E20] mb-1">이메일</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com"
                  className="w-full border-2 border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#2E7D32]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1B5E20] mb-1">비밀번호</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="6자 이상"
                  className="w-full border-2 border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#2E7D32]" />
              </div>
              {message && (
                <div className={`text-sm px-3 py-2 rounded-sm border ${isError ? 'bg-red-50 border-red-300 text-red-700' : 'bg-green-50 border-green-300 text-green-700'}`}>
                  {isError ? '⚠️' : '✅'} {message}
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-[#2E7D32] text-white font-bold rounded-sm hover:bg-[#1B5E20] active:scale-95 transition-all border-2 border-[#1B5E20] shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? '처리 중...' : tab === 'login' ? '🌾 로그인' : '🌱 회원가입'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          <a href="/" className="hover:underline text-[#2E7D32] font-bold">← 로그인 없이 둘러보기</a>
        </p>
      </div>
    </div>
  )
}
