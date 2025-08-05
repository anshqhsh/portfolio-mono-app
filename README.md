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
- **비즈니스 로직 분리**: 데이터 가공 및 UI 로직을 명확히 분리하여 유지보수 용이

---

## 커스텀 훅 구조 및 설계

### 1. `useUnifiedPortfolioSummary`

- **역할**:  
  다양한 포트폴리오(전략, 채권, SMA 등)와 환율, 상품 정보를 통합적으로 조회하여,  
  UI에서 필요한 모든 요약 정보를 한 번에 제공하는 커스텀 훅입니다.

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

- **설계 포인트**:
  - 여러 API를 병렬로 호출하여 데이터 통합
  - 각 계산을 순수함수로 분리하고 테스트를 용이하게 수정(**테스트코드 추가 예정**)
  - 각 포트폴리오 타입별로 타입 가드 및 데이터 가공
  - **복잡한 계산/가공 로직은 모두 utils/portfoiloSummary.ts로 분리**
  - UI에서 바로 사용할 수 있도록 일관된 데이터 구조 제공
  - 차트 등 UI 비즈니스 로직은 컴포넌트에서 처리하도록 분리

#### 주요 유틸 함수

- `calculateUserDepositUSD(balances, currencies)`:  
  유저의 잔고를 USD 기준으로 환산하여 합산

- `mapOrderListToPortfolioSummaries(orderList, currencies, productMetaData)`:  
  포트폴리오 리스트를 요약 정보 배열로 변환

- `calculateTotalInvestedAndCurrentValue(portfolios, currencies)`:  
  전체 투자 원금과 평가금액(USD 기준)을 한 번에 계산

- `mapProductsToMetaData(products)`:  
  상품 리스트에서 메타데이터(로고, 심볼, 설명 등) 추출

---

### 예시 코드

```ts
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
```


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

---

## 보안 및 참고

> 본 프로젝트는 실제 서비스와 동일하게 동작하는 제품이 아니며,  
> **코드 스타일, 폴더 구조, 비즈니스 로직 분리 등 개발 방식의 참고**를 목적으로 작성되었습니다.  
> 보안상 민감한 로직은 포함하지 않았으며,  
> 실제 서비스 운영에 필요한 모든 기능/정책이 구현되어 있지 않습니다.
>
> **즉, 이 프로젝트는 실서비스가 아닌 "코딩 스타일 및 설계 참고용 샘플"임을 유의해 주세요.**


## 변경 이력

---

> **2024-06-25**
>
> - 포트폴리오 요약 훅(`useUnifiedPortfolioSummary`)의 반환값 구조를 개선
> - 복잡한 계산/가공 로직을 `utils/portfoiloSummary.ts`로 분리
> - 주요 유틸 함수: `calculateUserDepositUSD`, `mapOrderListToPortfolioSummaries`, `calculateTotalInvestedAndCurrentValue` 등 추가
> - 반환값 필드명: `allPortfolios` → `sortedPortfolios`, `totalInvestmentsBalance` → `totalCurrentValue`, `totalInvestments` → `totalInvestedPrincipal` 등으로 변경

---