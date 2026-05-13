import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "고구마마켓 - 우리 동네 중고 직거래",
  description: "농부님들의 정직한 중고 직거래 장터, 고구마마켓",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ background: "#FFFDE7" }}>

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
                <span>🌿 우리 동네 직거래</span>
              </div>

              <nav>
                <a
                  href="/products/new"
                  className="bg-[#FFD600] text-[#1B5E20] text-sm font-bold px-5 py-2 rounded-sm
                    hover:bg-yellow-300 hover:scale-105 active:scale-95
                    transition-all duration-200 shadow-md border-2 border-[#1B5E20]"
                >
                  + 상품 등록
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        {/* 푸터 */}
        <footer className="bg-[#1B5E20] text-green-100 mt-16 border-t-4 border-[#FFD600]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center space-y-2">
              <div className="text-2xl">🌾 🍠 🌽 🥬 🐄 🌿</div>
              <p className="font-bold text-white text-lg">고구마마켓</p>
              <p className="text-sm text-green-300">우리 동네 정직한 중고 직거래 장터</p>
              <p className="text-xs text-green-400 mt-4">© 2026 고구마마켓. 농부의 마음으로 만들었습니다.</p>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
