import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
    productId?: string;
  }>;
}

async function confirmPayment(paymentKey: string, orderId: string, amount: number) {
  const secretKey = process.env.TOSS_SECRET_KEY ?? 'test_sk_docs_placeholder';
  const encoded = Buffer.from(`${secretKey}:`).toString('base64');

  const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encoded}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  return res.ok ? await res.json() : null;
}

async function updateProductStatus(productId: string) {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  await supabase.from('products').update({ status: '판매완료' }).eq('id', productId);
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { paymentKey, orderId, amount, productId } = await searchParams;

  if (!paymentKey || !orderId || !amount) redirect('/');

  const result = await confirmPayment(paymentKey, orderId, Number(amount));

  if (!result) {
    redirect(`/checkout/fail?message=결제 승인에 실패했습니다.`);
  }

  if (productId) {
    await updateProductStatus(productId);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">결제가 완료됐어요!</h1>
      <p className="text-gray-500 mb-8">안전하게 거래가 이루어졌습니다.</p>

      <div className="bg-orange-50 border border-orange-200 rounded p-4 text-left text-sm space-y-2 mb-8">
        <div className="flex justify-between">
          <span className="text-gray-500">주문번호</span>
          <span className="font-mono font-bold text-gray-700 truncate ml-4 max-w-[200px]">{orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">결제금액</span>
          <span className="font-bold text-[#E67E22]">₩{Number(amount).toLocaleString('ko-KR')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">결제상태</span>
          <span className="font-bold text-green-600">{result.status === 'DONE' ? '결제 완료' : result.status}</span>
        </div>
      </div>

      <a
        href="/"
        className="inline-block w-full bg-[#E67E22] text-white font-bold py-3 rounded
          hover:bg-[#D35400] transition-colors"
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}
