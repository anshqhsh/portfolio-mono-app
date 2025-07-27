# portfolio-mono-app

모노레포 구조로 구성된 포트폴리오/샘플 프로젝트입니다. Next.js 기반의 웹 서비스, 어드민, 공통 패키지(API, UI, Utils 등)를 하나의 레포에서 관리합니다.

---

## 소개

- **목적**: 이력서, 포트폴리오, 기술 데모 등 다양한 용도로 활용할 수 있는 모던 웹/어드민 샘플 프로젝트
- **구조**: 웹 서비스, 어드민, 공통 패키지(API, UI, Utils, Constants 등)로 분리된 모노레포
- **기술스택**: Next.js (App Router), React, TypeScript, pnpm, TurboRepo 등

---

## 폴더 구조

```
portfolio-mono-app/
├── apps/
│   ├── web/         # 사용자용 웹 서비스 (Next.js)
│   └── admin/       # 어드민 서비스 (Next.js)
├── packages/
│   ├── api/         # 공통 API 클라이언트
│   ├── ui/          # 공통 UI 컴포넌트
│   ├── utils/       # 공통 유틸리티 함수
│   └── constants/   # 공통 상수
└── ...              # 설정 파일, 문서 등
```

---

## 주요 특징

- **모노레포**: 여러 앱/패키지를 하나의 레포에서 관리
- **공통 코드 재사용**: API, UI, Utils, Constants 등 패키지화
- **서비스별 환경 변수 분리**: 각 서비스별 .env 파일 사용
- **확장성/유지보수성**: 실제 서비스 구조와 유사하게 설계
- **관심사 분리**: 데이터 가공, UI 렌더링, 비즈니스 로직을 명확히 분리

---

## 아키텍처 설계 원칙

### 1. **선언부만 봐도 의도 파악 가능**

- 컴포넌트와 훅의 선언부만 읽어도 역할이 명확함
- 복잡한 로직은 별도 커스텀 훅이나 유틸 함수로 분리

### 2. **관심사 분리**

- **데이터 가공**: 커스텀 훅 (예: `usePieData`, `useUnifiedPortfolioSummary`)
- **UI 렌더링**: 컴포넌트
- **비즈니스 로직**: 유틸 함수

### 3. **간결한 인증 관리**

- react-query 중심의 인증 상태 관리
- Context Provider 없이 토큰 기반 조건부 쿼리 활용

---

## 커스텀 훅 구조 및 설계

### 1. **인증 관리**

#### `useAuth()` / `useUserQuery()`

- **react-query 중심의 간결한 인증 상태 관리**
- 토큰 파싱 → 조건부 유저 쿼리 → 인증 상태 자동 관리
- Context Provider 없이도 전역 인증 상태 제공

```ts
const { user, isAuthenticated, isLoading } = useAuth();
```

#### `useAuthActions()`

- 로그인/로그아웃 액션 함수 제공
- react-query 캐시 무효화를 통한 상태 동기화

```ts
const { login, logout } = useAuthActions();
```

### 2. **포트폴리오 데이터 관리**

#### `useUnifiedPortfolioSummary()`

- 다양한 포트폴리오(전략, 채권, SMA 등)와 환율, 상품 정보를 통합 조회
- **복잡한 계산/가공 로직은 모두 utils/portfoiloSummary.ts로 분리**

- **주요 반환값**:
  - `sortedPortfolios`: 정렬된 포트폴리오 요약 정보 배열
  - `totalInvestedPrincipal`: 전체 투자 원금(USD 기준)
  - `totalCurrentValue`: 전체 평가금액(USD 기준, 원금+수익)
  - `totalReturns`: 전체 수익(USD 기준, 평가금액-원금)
  - `totalBalanceUSDT`: 전체 잔액(USD 기준) + 예치금
  - `userDepositUSD`: 유저 예치금(USD 환산)
  - `userRawBalance`: 유저의 실제 잔고(통화별)
  - `currencies`: 환율 정보
  - `isLoading`: 데이터 로딩 상태

#### 주요 유틸 함수

- `calculateUserDepositUSD(balances, currencies)`:  
  유저의 잔고를 USD 기준으로 환산하여 합산

- `mapOrderListToPortfolioSummaries(orderList, currencies, productMetaData)`:  
  포트폴리오 리스트를 요약 정보 배열로 변환

- `calculateTotalInvestedAndCurrentValue(portfolios, currencies)`:  
  전체 투자 원금과 평가금액(USD 기준)을 한 번에 계산

- `mapProductsToMetaData(products)`:  
  상품 리스트에서 메타데이터(로고, 심볼, 설명 등) 추출

### 3. **차트 데이터 관리**

#### `usePieData(allPortfolios, totalInvestments)`

- 포트폴리오 데이터를 차트용 데이터로 변환
- 비율 계산, 필터링, 그룹핑 등 복잡한 로직을 분리
- 컴포넌트는 단순히 `const pieData = usePieData(...)`로 사용

---

### 예시 코드

```ts
// 인증
const { user, isAuthenticated, isLoading } = useAuth();
const { login, logout } = useAuthActions();

// 포트폴리오 데이터
const {
  sortedPortfolios,
  totalInvestedPrincipal,
  totalCurrentValue,
  totalReturns,
  totalBalanceUSDT,
  isLoading,
  userDepositUSD,
  userRawBalance,
  currencies,
} = useUnifiedPortfolioSummary();

// 차트 데이터
const pieData = usePieData(sortedPortfolios, totalInvestedPrincipal);

// 컴포넌트에서는 단순 렌더링만
function BalanceChart() {
  const pieData = usePieData(allPortfolios, totalInvestments);
  return <PieChart data={pieData} />;
}
```

---

### 변경 이력(Changelog) 예시

> **2024-06-XX (최신)**
>
> - **AuthProvider 제거**: react-query 중심의 간결한 인증 관리로 전환
> - **useAuth/useAuthActions**: 토큰 기반 조건부 쿼리로 인증 상태 자동 관리
> - **usePieData**: 차트 데이터 가공 로직을 별도 훅으로 분리
> - **관심사 분리 강화**: 선언부만 봐도 의도가 파악되는 간결한 구조 구현

> **2024-06-XX**
>
> - 포트폴리오 요약 훅(`useUnifiedPortfolioSummary`)의 반환값 구조를 개선
> - 복잡한 계산/가공 로직을 `utils/portfoiloSummary.ts`로 분리
> - 주요 유틸 함수: `calculateUserDepositUSD`, `mapOrderListToPortfolioSummaries`, `calculateTotalInvestedAndCurrentValue` 등 추가
> - 반환값 필드명: `allPortfolios` → `sortedPortfolios`, `totalInvestmentsBalance` → `totalCurrentValue`, `totalInvestments` → `totalInvestedPrincipal` 등으로 변경

---

## 실행 방법

```bash
# 의존성 설치
pnpm install

# 웹 서비스 실행
pnpm --filter web dev

# 어드민 서비스 실행
pnpm --filter admin dev
```

---

## 활용 예시

- 이력서/포트폴리오 제출용 샘플 프로젝트
- 모노레포 구조 학습/데모
- Next.js 기반 SaaS/서비스 개발 템플릿
- 실제 서비스 구조와 유사한 데이터 통합/비즈니스 로직 설계 참고
- **관심사 분리**와 **선언적 프로그래밍** 패턴 학습

---

## 보안 및 참고

> 본 프로젝트는 실제 서비스와 동일하게 동작하는 제품이 아니며,  
> **코드 스타일, 폴더 구조, 비즈니스 로직 분리 등 개발 방식의 참고**를 목적으로 작성되었습니다.  
> 보안상 민감한 로직은 포함하지 않았으며,  
> 실제 서비스 운영에 필요한 모든 기능/정책이 구현되어 있지 않습니다.
>
> **즉, 이 프로젝트는 실서비스가 아닌 "코딩 스타일 및 설계 참고용 샘플"임을 유의해 주세요.**
