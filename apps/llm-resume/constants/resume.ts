import { ResumeData } from "@/types/resume";

// 이력서 데이터
export const RESUME_DATA: ResumeData[] = [
  {
    company: "VEGAX",
    period: "2023.12 ~ 재직중",
    description:
      "15인 이상 팀의 유일한 프론트엔드 개발자로서 금융 데이터 시각화 및 분석 중심 UI/UX를 설계하고, Next.js + Turborepo 기반 모노레포 아키텍처를 구축하여 서비스 안정성과 개발 생산성을 향상",
    projects: [
      {
        title: "VEGAX + INVESTOR 서비스 통합 및 모노레포 시스템 구축",
        achievements: [
          {
            category: "아키텍처 설계",
            items: [
              "@repo/ui, @repo/utils, @repo/api 등 패키지 분리를 통해 도메인별 의존성 격리 및 코드 중복 최소화",
              "Radix UI + shadcn/ui + Tailwind CSS 3 조합으로 디자인 시스템 및 40여 개 공용 컴포넌트 구축",
              "i18n 헬퍼, API 래퍼, 공통 hooks, 유틸 함수 등을 분리하여 서비스 간 중복 로직 제거 및 재사용성 극대화",
            ],
          },
          {
            category: "성능 최적화",
            items: [
              "Chakra UI → shadcn/ui + Tailwind, moment.js → day.js, Chart.js → Recharts 등으로 교체하여 모던하고 경량화된 스택으로 전환",
              "평균 First Load JS 약 270 kB → 210 kB로 약 22% 감소",
              "초기 로딩 속도 개선 및 Core Web Vitals(SEO/UX) 지표 개선",
            ],
          },
          {
            category: "품질 관리",
            items: [
              "Slack Webhook, Sentry, ErrorBoundary 연동을 통해 실시간 모니터링 및 장애 대응 체계 구축",
              "도메인 기반 비즈니스 로직 유틸 함수에 테스트 코드 적용",
              "서비스 안정성과 유지 보수성 강화",
            ],
          },
        ],
        techStack: [
          "Next.js",
          "Turborepo",
          "TypeScript",
          "Tailwind CSS",
          "shadcn/ui",
          "React Query",
        ],
      },
      {
        title: "Trading 및 지표 분석용 내부 대시보드",
        achievements: [
          {
            category: "UI/UX 개발",
            items: [
              "React + Next.js 기반 레거시 코드 모듈화 및 컴포넌트화",
              "목적 기반으로 UI 구조를 재설계하여 코드 중복 제거, 관심사 분리",
              "TradingView 기반 OHLC 차트에 커스텀 피더 및 인디케이터 연동",
            ],
          },
          {
            category: "성능 최적화",
            items: [
              "React Query의 useQueries, staleTime, cacheTime 등 옵션을 적절히 활용하여 API 호출 최적화",
              "대용량 데이터에 대한 불필요한 API 호출 최소화",
              "전략 Bot Config 세팅값 Local Storage 활용 하여 저장 및 불러오기 기능 추가",
              "데이터 일관성 및 렌더링 성능 최적화",
            ],
          },
        ],
        techStack: [
          "React",
          "Next.js",
          "TradingView",
          "React Query",
          "Tailwind CSS",
        ],
      },
      {
        title: "Chrome Extension 기반 자동화 도구 개발",
        achievements: [
          {
            category: "UI 개발",
            items: [
              "Chrome Extension Manifest V3 기반 팝업 UI 및 옵션 페이지 개발",
              "Vanilla JavaScript 기반 설계",
              "Local Storage를 활용한 상태 관리 구현",
            ],
          },
          {
            category: "사용자 경험",
            items: [
              "DOM 변화 감지 기반 자동 일시정지·재개 로직으로 안정성 확보",
              "직관적인 파라미터 관리 UI로 사용자 편의성 향상",
              "파라미터 Random 조합 생성 알고리즘 도입",
            ],
          },
        ],
        techStack: ["Chrome Extension", "React", "TypeScript", "Tailwind CSS"],
      },
      {
        title: "LLM 기반 대화형 UI 개발 & Domain-Specific LLM Prototype 구축",
        achievements: [
          {
            category: "UI/UX 개발",
            items: [
              "SSE 기반 실시간 스트리밍 대화형 UI 구현",
              "마크다운 렌더링 및 코드 하이라이팅 기능 통합",
            ],
          },
          {
            category: "성능 최적화",
            items: [
              "메시지 스트리밍 처리 로직 최적화",
              "무한 스크롤 대화 이력 렌더링 성능 개선",
            ],
          },
          {
            category: "RNA 서열 기반 질의응답 LLM 설계 및 테스트",
            items: [
              "RNA 데이터 일부 시퀀스 누락 상황을 가정하여 LLM이 응답을 유도하도록 프롬프트 엔지니어링 설계",
              "다양한 LLM 모델별 요구 데이터 형식에 맞춰 시퀀스 전처리 자동화 스크립트 작성",
              "AWS Bedrock의 지속학습 기능을 활용하여 질의응답 정확도 향상 시도",
            ],
          },
          {
            category: "부동산 청약 챗봇 프로토타입 구현",
            items: [
              "아파트 청약 데이터셋을 기반으로 사용자의 질문에 맞는 정보를 제공하는 프롬프트 기반 챗봇 설계",
              "부동산 도메인 프롬프트 패턴 정리 및 응답 정밀도 테스트",
            ],
          },
        ],
        techStack: [
          "Next.js",
          "TypeScript",
          "SSE",
          "Sequence Embedding",
          "Prompt Engineering",
          "Preprocessing Script",
          "AWS Bedrock",
          "LangChain",
        ],
      },
    ],
  },
];
