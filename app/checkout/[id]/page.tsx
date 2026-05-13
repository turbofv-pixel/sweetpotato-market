import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { notFound } from 'next/navigation';
import CheckoutClient from './CheckoutClient';
import { randomUUID } from 'crypto';

async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`;
}

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();
  if (product.status === '판매완료') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">😢</p>
        <h1 className="text-xl font-bold text-gray-700">이미 판매 완료된 상품입니다.</h1>
        <a href="/" className="mt-6 inline-block text-[#E67E22] font-bold hover:underline">
          목록으로 돌아가기
        </a>
      </div>
    );
  }

  const orderId = randomUUID();

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      <a href={`/products/${product.id}`} className="text-sm text-[#E67E22] font-bold hover:underline mb-6 inline-block">
        ← 상품으로 돌아가기
      </a>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">결제하기</h1>

      {/* 상품 요약 */}
      <div className="bg-white border-2 border-orange-200 rounded p-4 mb-6 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate">{product.title}</p>
          <p className="text-sm text-gray-500 mt-1">판매자: {product.seller_name}</p>
        </div>
        <p className="text-xl font-bold text-[#E67E22] shrink-0">{formatPrice(product.price)}</p>
      </div>

      {/* 결제 위젯 */}
      <CheckoutClient
        productId={product.id}
        productTitle={product.title}
        price={product.price}
        orderId={orderId}
      />
    </div>
  );
}
