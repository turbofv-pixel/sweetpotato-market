# 고구마마켓(SweetPotato-Market)

중고 물품을 사고팔 수 있는 웹 서비스입니다.

## 기술 스택

- **프레임워크**: Next.js 15+ (App Router)
- **데이터베이스 & 인증**: Supabase (PostgreSQL)
- **스타일링**: Tailwind CSS
- **언어**: TypeScript
- **결제**: 토스페이먼츠 (예정)
- **소셜 로그인**: 카카오, 구글

## MCP

- **Supabase MCP**: 연결됨 — DB 조작 시 MCP를 통해 직접 수행

## 디자인 규칙

### 언어 & 통화
- UI는 **한국어**로 작성
- 가격은 **원화(₩)** — `₩10,000` 형태로 표시
- 숫자 포맷: 1,000 단위로 쉼표 추가

### 반응형 & 디자인
- **모바일 반응형 필수** (breakpoint: sm, md, lg)
- **색상 테마**: 주황색 계열 (고구마 컨셉)
  - 주색상: `#FF8C42` 또는 `#E67E22`
  - 보조색: 흰색, 회색 톤
- **스타일**: 깔끔하고 모던한 디자인

## 주요 기능

1. **상품 목록 (메인 페이지)**
   - 카테고리별 필터
   - 검색 기능
   - 가격 정렬

2. **상품 등록/상세/수정/삭제**
   - 이미지 업로드
   - 카테고리 선택
   - 설명 및 가격 입력

3. **인증**
   - Supabase Auth
   - 카카오 / 구글 소셜 로그인

4. **결제**
   - 토스페이먼츠 연동

5. **사용자 프로필**
   - 판매 이력
   - 구매 이력
   - 관심 목록

## 데이터베이스 스키마

### Users
- `id` (UUID, PK)
- `email` (VARCHAR)
- `name` (VARCHAR)
- `avatar_url` (TEXT)
- `bio` (TEXT)
- `created_at` (TIMESTAMP)

### Products
- `id` (UUID, PK)
- `title` (VARCHAR)
- `description` (TEXT)
- `price` (DECIMAL)
- `category` (VARCHAR)
- `image_url` (TEXT)
- `status` ('available' | 'sold' | 'reserved')
- `seller_id` (UUID, FK → users)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Transactions
- `id` (UUID, PK)
- `product_id` (UUID, FK → products)
- `buyer_id` (UUID, FK → users)
- `seller_id` (UUID, FK → users)
- `price` (DECIMAL)
- `status` ('pending' | 'completed' | 'cancelled')
- `created_at` (TIMESTAMP)
- `completed_at` (TIMESTAMP)

## 개발 규칙

### 코드 스타일
- 한국어 변수명 금지 — 모두 영문 camelCase
- 타입 정의는 `lib/types/index.ts`에서 관리
- 컴포넌트는 `app/components/`에 위치
- API 라우트는 `app/api/`에 위치

### 커밋 메시지
- Conventional Commits 사용: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `chore:`

### 환경변수
- `.env.local`에만 저장 (커밋 금지)
- 필수 변수:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 폴더 구조

```
sweetpotato-market/
├── app/
│   ├── api/               # API 라우트
│   ├── components/        # 재사용 컴포넌트
│   ├── (pages)/           # 페이지 라우트
│   ├── layout.tsx         # 루트 레이아웃
│   └── globals.css        # 전역 스타일
├── lib/
│   ├── supabase.ts        # Supabase 클라이언트
│   └── types/
│       └── index.ts       # TypeScript 타입
├── public/
│   └── uploads/           # 사용자 업로드 이미지
└── ...설정 파일들
```

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:3000에서 확인

---

*프로젝트 시작일: 2026-05-13*
