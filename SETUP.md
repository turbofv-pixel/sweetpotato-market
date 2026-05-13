# 고구마마켓(SweetPotato-Market) 설정 가이드

## 프로젝트 구조

```
sweetpotato-market/
├── app/
│   ├── api/                 # API 라우트
│   ├── components/          # 재사용 가능한 컴포넌트
│   ├── layout.tsx           # 루트 레이아웃
│   └── page.tsx             # 홈 페이지
├── lib/
│   ├── supabase.ts          # Supabase 클라이언트
│   └── types/               # TypeScript 타입 정의
├── public/
│   └── uploads/             # 업로드된 이미지 저장소
├── .env.local               # 환경변수 (로컬 설정)
└── tailwind.config.ts       # Tailwind CSS 설정
```

## Supabase 설정

### 1. Supabase 프로젝트 생성
- [Supabase 콘솔](https://app.supabase.com)에 접속
- 새 프로젝트 생성

### 2. 환경변수 설정
`.env.local` 파일을 열고 다음 값들을 입력하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

프로젝트 설정 > API에서 확인할 수 있습니다.

### 3. Supabase 데이터베이스 테이블 생성

SQL Editor에서 다음을 실행하세요:

```sql
-- Users 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products 테이블
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'available',
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions 테이블
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 인덱스 생성
CREATE INDEX products_seller_id_idx ON products(seller_id);
CREATE INDEX transactions_buyer_id_idx ON transactions(buyer_id);
CREATE INDEX transactions_seller_id_idx ON transactions(seller_id);
```

## 개발 시작

```bash
npm run dev
```

http://localhost:3000에서 확인할 수 있습니다.

## 기술 스택

- **프레임워크**: Next.js 15+ (App Router)
- **언어**: TypeScript
- **백엔드**: Supabase (PostgreSQL)
- **스타일링**: Tailwind CSS
- **패키지 매니저**: npm

## 다음 단계

1. 인증 시스템 구현 (Supabase Auth)
2. 상품 목록 페이지 개발
3. 상품 상세 페이지
4. 사용자 프로필 페이지
5. 거래 시스템 구현

행운을 빕니다! 🚀
