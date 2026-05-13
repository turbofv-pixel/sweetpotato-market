'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function FailContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const code = searchParams.get('code');

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">😢</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">결제에 실패했어요</h1>
      <p className="text-gray-500 mb-4">
        {message ?? '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.'}
      </p>
      {code && (
        <p className="text-xs text-gray-400 mb-8">오류 코드: {code}</p>
      )}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => window.history.back()}
          className="w-full bg-[#E67E22] text-white font-bold py-3 rounded
            hover:bg-[#D35400] transition-colors"
        >
          다시 시도하기
        </button>
        <a
          href="/"
          className="w-full block bg-white text-gray-600 font-bold py-3 rounded
            border-2 border-gray-200 hover:bg-gray-50 transition-colors"
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense>
      <FailContent />
    </Suspense>
  );
}
