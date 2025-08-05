# AI-Powered Resume Chat

ChatGPT와 대화를 통해 이력서를 탐색하고 동적 콘텐츠를 생성하는 인터랙티브 이력서 애플리케이션입니다.

## 구현된 기능

### 📝 이력서 기본 구조

- **반응형 레이아웃**: 모바일/데스크톱 최적화
- **다크모드 지원**: 시스템 테마 연동
- **모던 UI 컴포넌트**: shadcn/ui + Tailwind CSS
- **순차적 애니메이션**: Framer Motion을 활용한 자연스러운 콘텐츠 전환

### 💼 경력 사항 표시

- **아코디언 기반 정보 계층화**: 회사 > 프로젝트 > 상세 내용
- **자동 순차 표시**: 프로젝트별 자동 전환 애니메이션
- **기술 스택 뱃지**: 프로젝트별 사용 기술 시각화
- **카테고리별 업무 성과**: 아키텍처/성능/품질 등 분류

### 🎯 핵심 역량 강조

- **기술 스택 분류**: Core/UI/UX/Architecture 카테고리화
- **프로필 섹션**: 주요 정보 및 연락처 통합
- **시각적 계층 구조**: 카드 레이아웃 기반 정보 구조화

## TODO

### 🤖 AI 채팅 기능

- [ ] ChatGPT 연동 및 스트리밍 응답
- [ ] Function Calling 기반 동적 콘텐츠 생성
- [ ] 대화 이력 관리 및 컨텍스트 유지
- [ ] 실시간 타이핑 효과

### 📊 동적 콘텐츠

- [ ] 차트 컴포넌트 (Recharts)
  - [ ] 성능 최적화 결과 시각화
  - [ ] 시계열 데이터 차트
  - [ ] 기술 스택 분포도
- [ ] 코드 하이라이팅
  - [ ] 구현 예시 코드
  - [ ] 설정 파일 예시
- [ ] 아키텍처 다이어그램
  - [ ] 시스템 구조도
  - [ ] 데이터 플로우

### 🔄 데이터 동기화

- [ ] Notion API 연동
- [ ] 실시간 이력서 데이터 업데이트
- [ ] 마크다운 변환 및 렌더링

### 🎨 UI/UX 개선

- [ ] 스켈레톤 로딩 상태
- [ ] 페이지 전환 애니메이션
- [ ] 반응형 차트 레이아웃
- [ ] 접근성 개선

## 기술 스택

### Core

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

### UI/UX

- shadcn/ui
- Framer Motion
- Lucide Icons

### 구조

- Turborepo
- pnpm Workspace

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

## 프로젝트 구조

```
apps/llm-resume/
├── app/
│   ├── layout.tsx     # 레이아웃 설정
│   └── page.tsx       # 메인 페이지
├── components/
│   ├── llm-resume/    # 이력서 관련 컴포넌트
│   └── providers.tsx  # 전역 프로바이더
├── constants/
│   └── resume.ts      # 이력서 데이터
└── types/
    └── resume.ts      # 타입 정의
```

## 환경 변수 설정

`.env.local` 파일에 필요한 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

## 라이선스

MIT License
