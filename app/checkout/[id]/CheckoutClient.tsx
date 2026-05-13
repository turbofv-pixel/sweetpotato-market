'use client';

import { useEffect, useRef, useState } from 'react';
import { loadPaymentWidget, PaymentWidgetInstance, ANONYMOUS } from '@tosspayments/payment-widget-sdk';

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';

interface Props {
  productId: string;
  productTitle: string;
  price: number;
  orderId: string;
}

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`;
}

export default function CheckoutClient({ productId, productTitle, price, orderId }: Props) {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidgetInstance['renderPaymentMethods']> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(CLIENT_KEY, ANONYMOUS);
      paymentWidgetRef.current = paymentWidget;

      paymentMethodsWidgetRef.current = paymentWidget.renderPaymentMethods(
        '#payment-widget',
        { value: price },
        { variantKey: 'DEFAULT' }
      );

      paymentWidget.renderAgreement('#agreement-widget', { variantKey: 'AGREEMENT' });

      setIsLoading(false);
    })();
  }, [price]);

  const handlePayment = async () => {
    if (!paymentWidgetRef.current) return;
    setIsPaying(true);
    try {
      await paymentWidgetRef.current.requestPayment({
        orderId,
        orderName: productTitle,
        successUrl: `${window.location.origin}/checkout/success?productId=${productId}`,
        failUrl: `${window.location.origin}/checkout/fail`,
        customerName: '구매자',
      });
    } catch {
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-[#E67E22] text-sm font-bold animate-pulse">결제 수단 불러오는 중...</div>
        </div>
      )}

      <div id="payment-widget" className={isLoading ? 'hidden' : ''} />
      <div id="agreement-widget" className={isLoading ? 'hidden' : ''} />

      {!isLoading && (
        <div className="pt-2">
          <div className="bg-orange-50 border border-orange-200 rounded p-4 mb-4 text-sm text-gray-700">
            <p className="font-bold text-[#E67E22] mb-1">결제 금액</p>
            <p className="text-2xl font-bold text-gray-900">{formatPrice(price)}</p>
          </div>
          <button
            onClick={handlePayment}
            disabled={isPaying}
            className="w-full bg-[#E67E22] text-white font-bold py-4 rounded
              hover:bg-[#D35400] active:scale-95 transition-all duration-150
              disabled:opacity-60 disabled:cursor-not-allowed text-lg shadow-md"
          >
            {isPaying ? '결제 처리 중...' : `${formatPrice(price)} 결제하기`}
          </button>
        </div>
      )}
    </div>
  );
}
