import { Resume } from "@/types/resume";

export const TECH_STACKS = [
  {
    title: "Frontend",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "React Query",
      "Zustand",
      "Recoil",
      "Redux",
      "TailwindCSS",
      "Emotion",
      "Chakra UI",
      "MUI",
      "Radix UI",
      "shadcn/ui",
      "i18n",
      "TradingView",
      "Storybook",
      "Jest",
    ],
  },
  {
    title: "App",
    skills: ["React Native"],
  },
  {
    title: "Backend & Infra",
    skills: [
      "Turborepo",
      "pnpm",
      "Heroku",
      "Python",
      "Django",
      "Ninja",
      "Chrome Extension",
      "Amazon EC2",
      "S3",
      "Bedrock",
    ],
  },
];

// 이력서 데이터
export const RESUME_DATA: Resume[] = [
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
  {
    company: "플라잉캣",
    period: "2022.10.04 ~ 2023.05.05",
    description:
      "Frontend Developer로서 B2B 스케줄링 SaaS와 퀵커머스 앱 개발에 참여하여 사용자 중심의 UI/UX 설계 및 성능 최적화를 주도",
    projects: [
      {
        title: "SYNC – 캘린더 기반 B2B 업무 스케줄링 SaaS",
        achievements: [
          {
            category: "기획 및 설계",
            items: [
              "B2B 스케줄 자동화 SaaS 개발 초기 단계에 기획부터 프론트엔드 전반을 주도적으로 참여",
              "기존 일정 공유 도구(Calendly 등)의 UX를 벤치마킹하여 기능 정의 및 사용자 흐름 구조화",
            ],
          },
          {
            category: "UI/UX 개발",
            items: [
              "FullCalendar 기반 커스터마이징 캘린더 UI 개발",
              "복잡한 반복 일정 및 타임존 처리를 위한 스케줄 유틸 함수 및 상태 관리 로직 직접 구현",
              "MUI + i18n 조합을 통한 다국어 대응 및 반응형 디자인 구성",
            ],
          },
          {
            category: "기능 구현",
            items: [
              "Stripe 결제 연동을 통해 일정 예약 유료화 기능 구현",
              "Slack API, Kakao API 등 외부 메시징 플랫폼과의 알림 구현",
              "다양한 디바이스·언어 환경에서도 일정 생성·공유 기능의 일관된 경험 제공",
            ],
          },
          {
            category: "개발 프로세스",
            items: [
              "Storybook 도입 및 컴포넌트 문서화 체계 수립",
              "외주 개발자와의 영어 기반 비동기 협업, 스크럼 주도, PR 리뷰 문화 정착 등 초기 팀 개발 프로세스 정비",
            ],
          },
        ],
        techStack: [
          "React",
          "FullCalendar",
          "MUI",
          "i18n",
          "Stripe",
          "Slack API",
          "Kakao API",
          "Storybook",
        ],
      },
      {
        title: "10분 특공대 – 실시간 퀵커머스 앱",
        achievements: [
          {
            category: "앱 개발",
            items: [
              "배달의민족 스타일의 퀵커머스 앱 개발에 참여",
              "실시간 재고에 따라 노출되는 시간별 특가 UI, 주문 제한 로직 등을 구현하여 수요 피크 타이밍 대응",
            ],
          },
          {
            category: "성능 최적화",
            items: [
              "React Query 기반 Infinite Scroll 구조 구현",
              "스크롤 위치 유지 및 페이지네이션 캐싱 전략으로 성능 병목 지점 최적화",
            ],
          },
          {
            category: "상태 관리",
            items: [
              "상태 불일치 이슈를 해결하기 위해 API 응답 기준으로 UI 상태 재설계",
              "상품 품절/주문 불가 상태를 즉각 반영하는 UX 강화",
            ],
          },
        ],
        techStack: [
          "React Native",
          "React Query",
          "Infinite Scroll",
          "상태 관리",
        ],
      },
    ],
  },
  {
    company: "KORNEC",
    period: "2020.06.22 ~ 2021.03.31",
    description:
      "웹 개발자로서 전자정부 표준 프레임워크 기반 Java 웹 개발에 참여하여 공공 도메인 업무 기능 개발 및 표준 UX 구조 설계",
    projects: [
      {
        title: "KORUS – 국립대학교 자원관리 시스템",
        achievements: [
          {
            category: "웹 개발",
            items: [
              "전자정부 표준 프레임워크 기반 Java 웹 개발 참여",
              "대학 산학협력, 연구 과제 관리 기능 등 공공 도메인 업무 기능 개발",
              "JSP, Spring 기반 웹 화면 및 서버 로직 구현",
            ],
          },
          {
            category: "업무 로직",
            items: [
              "과제 제출·승인·문서 출력 등 업무 흐름 처리 로직 구현",
              "국립대학교 통합 연구 자원 관리 시스템 관련 교육 참여 및 실습 문서 작성",
            ],
          },
          {
            category: "UX 설계",
            items: [
              "행정·교육기관 대상 서비스 특성을 고려한 표준 UX 구조 설계",
              "유관 부서와의 협업 경험 보유",
            ],
          },
        ],
        techStack: [
          "Java",
          "Spring",
          "JSP",
          "전자정부 표준 프레임워크",
          "웹 개발",
        ],
      },
    ],
  },
];
