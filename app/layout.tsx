import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

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

        <Header />

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
