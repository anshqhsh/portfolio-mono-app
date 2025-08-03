# AI-Powered Resume Chat

ChatGPT와 대화를 통해 이력서를 탐색하고 동적 콘텐츠를 생성하는 인터랙티브 이력서 애플리케이션입니다.

## 주요 기능

- 🤖 **AI 채팅 인터페이스**: ChatGPT와 자연스러운 대화
- 🧠 **Function Calling**: OpenAI Function Calling을 활용한 지능형 트리거
- 📊 **동적 차트**: 시계열 데이터, 성능 지표 등을 시각화
- 💻 **코드 하이라이팅**: 구현 예시를 구문 강조와 함께 표시
- 📋 **동적 리스트**: 기술 스택, 도구 목록 등을 카테고리별로 정리
- 🏗️ **아키텍처 시각화**: 시스템 구조와 데이터 플로우 표시
- ✨ **부드러운 애니메이션**: Framer Motion을 활용한 UI 전환 효과

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 OpenAI API 키를 설정하세요:

```env
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 사용법

### 기본 대화

AI 어시스턴트와 자연스럽게 대화할 수 있습니다:

- "안녕하세요"
- "이력서에 대해 궁금한 점이 있어요"
- "어떤 기술을 사용하시나요?"

### 동적 콘텐츠 트리거

#### 🧠 Function Calling 방식 (권장)
OpenAI Function Calling을 사용하여 사용자의 의도를 정확히 파악하고 적절한 콘텐츠를 생성합니다:

```
"시계열 데이터 처리 시스템을 보여주세요" → 차트 + 코드 + 아키텍처
"성능 최적화 결과를 비교해주세요" → 성능 비교 차트
"사용하는 기술들을 정리해주세요" → 카테고리별 기술 스택
"시스템 아키텍처를 설명해주세요" → 시스템 구조 시각화
```

#### 🔍 키워드 기반 방식 (시뮬레이션)
API 키가 없을 때는 키워드 매칭으로 동작합니다:

##### 📊 차트 생성
```
"시계열 데이터를 어떻게 관리하시나요?"
"대용량 데이터 처리량을 보여주세요"
"성능 최적화 결과를 차트로 보여주세요"
```

##### 💻 코드 예시
```
"코드 구현 방법을 보여주세요"
"시계열 데이터 처리 코드를 보여주세요"
"최적화된 알고리즘을 보여주세요"
```

##### 📋 기술 스택
```
"사용하는 기술 스택을 알려주세요"
"데이터베이스 기술을 보여주세요"
"모니터링 도구를 알려주세요"
```

##### 🏗️ 아키텍처
```
"시스템 아키텍처를 보여주세요"
"데이터 플로우를 설명해주세요"
```

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **애니메이션**: Framer Motion
- **차트**: Recharts
- **코드 하이라이팅**: react-syntax-highlighter
- **AI**: OpenAI GPT-4 API

## 프로젝트 구조

```
apps/llm-resume/
├── app/
│   └── page.tsx              # 메인 페이지
├── components/
│   ├── ChatInterface.tsx     # 채팅 인터페이스
│   ├── ChatMessage.tsx       # 메시지 컴포넌트
│   └── DynamicContent.tsx    # 동적 콘텐츠 렌더링
├── lib/
│   └── ai-service.ts         # AI 서비스 로직
└── README.md
```

## 커스터마이징

### 새로운 동적 콘텐츠 타입 추가

1. `DynamicContent.tsx`에 새로운 컴포넌트 추가
2. `ai-service.ts`의 시뮬레이션 함수에 새로운 응답 패턴 추가
3. 실제 OpenAI API 사용 시 프롬프트에 새로운 타입 설명 추가

### AI 응답 커스터마이징

`lib/ai-service.ts` 파일에서 AI 응답 로직을 수정할 수 있습니다:

- **Function Calling 모드**: OpenAI API 키가 있을 때 자동 활성화
  - 사용자 의도 분석 후 적절한 함수 자동 호출
  - 구조화된 파라미터로 정확한 데이터 생성
  - 대화 컨텍스트를 고려한 지능형 응답

- **시뮬레이션 모드**: API 키가 없을 때 키워드 기반 응답
  - 미리 정의된 패턴으로 동적 콘텐츠 생성
  - 빠른 테스트 및 데모용

## 배포

### Vercel 배포

1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 연결
3. 환경 변수 설정
4. 배포 완료

### 환경 변수 설정

배포 시 다음 환경 변수를 설정하세요:

- `NEXT_PUBLIC_OPENAI_API_KEY`: OpenAI API 키

## 라이선스

MIT License

## 기여하기

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
