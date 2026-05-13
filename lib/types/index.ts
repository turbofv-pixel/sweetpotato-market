export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  seller_name: string;
  status: '판매중' | '예약중' | '판매완료';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  price: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  completed_at?: string;
}
