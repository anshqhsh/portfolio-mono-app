// OpenAI API를 사용한 AI 서비스 (Function Calling 지원)
// 실제 구현에서는 환경 변수로 API 키를 관리해야 합니다

export interface AIResponse {
  content: string;
  dynamicContent?: {
    type: "chart" | "code" | "image" | "list";
    data: any;
  };
}

// Function Calling을 위한 함수 정의
const functions = [
  {
    name: "show_project_details",
    description: "특정 프로젝트나 업무 경험에 대한 상세 정보를 표시합니다.",
    parameters: {
      type: "object",
      properties: {
        projectName: {
          type: "string",
          description: "프로젝트 이름",
        },
        details: {
          type: "array",
          items: {
            type: "object",
            properties: {
              category: { type: "string" },
              items: { type: "array", items: { type: "string" } },
            },
          },
          description: "프로젝트 상세 내용",
        },
        techStack: {
          type: "array",
          items: { type: "string" },
          description: "사용된 기술 스택",
        },
      },
      required: ["projectName", "details"],
    },
  },
  {
    name: "show_tech_experience",
    description: "특정 기술이나 도구 사용 경험을 시각화하여 표시합니다.",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "기술 경험 제목",
        },
        data: {
          type: "object",
          properties: {
            labels: {
              type: "array",
              items: { type: "string" },
              description: "기술/도구 이름",
            },
            datasets: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  label: { type: "string" },
                  data: { type: "array", items: { type: "number" } },
                  backgroundColor: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
      },
      required: ["title", "data"],
    },
  },
  {
    name: "show_architecture",
    description: "프로젝트의 아키텍처나 시스템 구조를 시각화합니다.",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "아키텍처 제목",
        },
        components: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              type: { type: "string" },
              description: { type: "string" },
            },
          },
        },
        relationships: {
          type: "array",
          items: {
            type: "object",
            properties: {
              from: { type: "string" },
              to: { type: "string" },
              type: { type: "string" },
            },
          },
        },
      },
      required: ["title", "components"],
    },
  },
  {
    name: "show_performance_metrics",
    description: "성능 개선이나 최적화 결과를 차트로 표시합니다.",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "성능 지표 제목",
        },
        metrics: {
          type: "array",
          items: { type: "string" },
          description: "측정 지표들",
        },
        beforeData: {
          type: "array",
          items: { type: "number" },
          description: "개선 전 데이터",
        },
        afterData: {
          type: "array",
          items: { type: "number" },
          description: "개선 후 데이터",
        },
      },
      required: ["title", "metrics", "beforeData", "afterData"],
    },
  },
  {
    name: "show_code_example",
    description: "특정 기술이나 구현의 코드 예시를 표시합니다.",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "코드 예시 제목",
        },
        language: {
          type: "string",
          enum: ["typescript", "javascript", "python", "java"],
          description: "프로그래밍 언어",
        },
        code: {
          type: "string",
          description: "코드 내용",
        },
        explanation: {
          type: "string",
          description: "코드 설명",
        },
      },
      required: ["title", "language", "code"],
    },
  },
];

export class AIService {
  private apiKey: string;
  private baseUrl = "https://api.openai.com/v1/chat/completions";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
  }

  async generateResponse(
    userInput: string,
    conversationHistory: any[] = []
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      return this.simulateResponse(userInput);
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `당신은 이력서 AI 어시스턴트입니다. 사용자의 질문에 답변하면서 필요에 따라 적절한 함수를 호출하여 동적 콘텐츠를 생성해야 합니다.

사용 가능한 함수들:
- show_project_details: 프로젝트 상세 정보 표시
- show_tech_experience: 기술 경험 시각화
- show_architecture: 시스템 아키텍처 시각화
- show_performance_metrics: 성능 개선 결과 표시
- show_code_example: 코드 예시 표시

특히 다음 프로젝트들에 대해 자세히 설명할 수 있습니다:
1. VEGAX + INVESTOR 서비스 통합 및 모노레포 시스템 구축
2. Trading 및 지표 분석용 내부 대시보드
3. TradingView 파라미터 자동 탐색 도구 개발
4. LLM 기반 생명정보학 챗봇

사용자의 의도를 정확히 파악하고 적절한 함수를 호출하세요.`,
            },
            ...conversationHistory,
            {
              role: "user",
              content: userInput,
            },
          ],
          functions: functions,
          function_call: "auto",
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      const choice = data.choices[0];

      if (choice.message.function_call) {
        const functionCall = choice.message.function_call;
        const functionArgs = JSON.parse(functionCall.arguments);

        const dynamicContent = this.executeFunction(
          functionCall.name,
          functionArgs
        );

        return {
          content: choice.message.content || "동적 콘텐츠를 생성했습니다.",
          dynamicContent,
        };
      }

      return {
        content: choice.message.content,
      };
    } catch (error) {
      console.error("AI API 호출 중 오류:", error);
      return this.simulateResponse(userInput);
    }
  }

  private executeFunction(functionName: string, args: any): any {
    switch (functionName) {
      case "show_project_details":
        return {
          type: "list",
          data: {
            title: args.projectName,
            items: args.details,
            techStack: args.techStack,
          },
        };

      case "show_tech_experience":
        return {
          type: "chart",
          data: {
            title: args.title,
            type: "bar",
            data: args.data,
          },
        };

      case "show_architecture":
        return {
          type: "list",
          data: {
            title: args.title,
            items: [
              {
                category: "시스템 컴포넌트",
                items: args.components.map(
                  (comp: any) =>
                    `${comp.name} (${comp.type}): ${comp.description}`
                ),
              },
              {
                category: "컴포넌트 관계",
                items:
                  args.relationships?.map(
                    (rel: any) => `${rel.from} → ${rel.to} (${rel.type})`
                  ) || [],
              },
            ],
          },
        };

      case "show_performance_metrics":
        return {
          type: "chart",
          data: {
            title: args.title,
            type: "bar",
            data: {
              labels: args.metrics,
              datasets: [
                {
                  label: "개선 전",
                  data: args.beforeData,
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
                {
                  label: "개선 후",
                  data: args.afterData,
                  backgroundColor: "rgba(75, 192, 192, 0.5)",
                },
              ],
            },
          },
        };

      case "show_code_example":
        return {
          type: "code",
          data: {
            title: args.title,
            language: args.language,
            code: args.code,
            explanation: args.explanation,
          },
        };

      default:
        return null;
    }
  }

  private simulateResponse(userInput: string): AIResponse {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes("모노레포") || lowerInput.includes("vegax")) {
      return {
        content:
          "VEGAX + INVESTOR 서비스 통합 프로젝트에 대해 설명드리겠습니다.",
        dynamicContent: {
          type: "list",
          data: {
            title: "VEGAX + INVESTOR 서비스 통합 및 모노레포 시스템 구축",
            items: [
              {
                category: "아키텍처 설계",
                items: [
                  "Next.js + Turborepo 기반 모노레포 아키텍처 설계 및 구축",
                  "@repo/ui, @repo/utils, @repo/api 등 패키지 분리",
                  "도메인별 의존성 격리 및 코드 중복 최소화",
                ],
              },
              {
                category: "UI/UX 개선",
                items: [
                  "Radix UI + shadcn/ui + Tailwind CSS 3 조합으로 디자인 시스템 구축",
                  "40여 개 공용 컴포넌트 개발",
                  "접근성(A11y) 확보 및 UI 일관성 향상",
                ],
              },
              {
                category: "성능 최적화",
                items: [
                  "Chakra UI → shadcn/ui + Tailwind 전환",
                  "moment.js → day.js, Chart.js → Recharts 교체",
                  "First Load JS 약 22% 감소 (270kB → 210kB)",
                  "Core Web Vitals(SEO/UX) 지표 개선",
                ],
              },
            ],
          },
        },
      };
    }

    if (lowerInput.includes("트레이딩") || lowerInput.includes("대시보드")) {
      return {
        content:
          "Trading 및 지표 분석용 내부 대시보드 개발 경험을 공유드리겠습니다.",
        dynamicContent: {
          type: "list",
          data: {
            title: "Trading 및 지표 분석용 내부 대시보드",
            items: [
              {
                category: "코드 개선",
                items: [
                  "React + Next.js 기반 레거시 코드 모듈화",
                  "목적 기반 UI 구조 재설계",
                  "코드 중복 제거 및 관심사 분리",
                ],
              },
              {
                category: "성능 최적화",
                items: [
                  "React Query의 useQueries, staleTime, cacheTime 활용",
                  "불필요한 API 호출 최소화",
                  "데이터 일관성 및 렌더링 성능 최적화",
                ],
              },
              {
                category: "차트 시스템",
                items: [
                  "TradingView 기반 OHLC 차트 커스텀",
                  "시계열 데이터 및 실시간 지표 연동",
                  "시그널 라벨 및 커스텀 지표선 시각화",
                ],
              },
            ],
          },
        },
      };
    }

    if (lowerInput.includes("chrome") || lowerInput.includes("extension")) {
      return {
        content:
          "TradingView 파라미터 자동 탐색 도구 개발에 대해 설명드리겠습니다.",
        dynamicContent: {
          type: "list",
          data: {
            title: "TradingView 파라미터 자동 탐색 도구 (Chrome Extension)",
            items: [
              {
                category: "핵심 기능",
                items: [
                  "Chrome Extension 기반 파라미터 제어·데이터 수집",
                  "TradingView DOM 제어로 파라미터 조작",
                  "로컬 스토리지 활용으로 데이터 지속성 확보",
                ],
              },
              {
                category: "최적화",
                items: [
                  "랜덤 파라미터 조합 생성 알고리즘",
                  "DOM 변화 감지 기반 자동 일시정지·재개",
                  "파라미터 Set 관리로 메모리 최적화",
                ],
              },
              {
                category: "UX 개선",
                items: [
                  "Popup UI로 실시간 진행 상태 시각화",
                  "사용자 피드백 반영한 반복 개선",
                  "작업 효율성 극대화",
                ],
              },
            ],
          },
        },
      };
    }

    if (lowerInput.includes("llm") || lowerInput.includes("챗봇")) {
      return {
        content: "LLM 기반 생명정보학 챗봇 프로젝트에 대해 설명드리겠습니다.",
        dynamicContent: {
          type: "list",
          data: {
            title: "LLM 기반 생명정보학 챗봇",
            items: [
              {
                category: "UI/UX",
                items: [
                  "SSE 기반 대화형 챗 UI 구현",
                  "실시간 AI 응답 스트리밍 지원",
                  "사용자 인터랙션 품질 향상",
                ],
              },
              {
                category: "기술 구현",
                items: [
                  "Biology-Instructions 논문 기반 Multi-Omics 분석",
                  "k-mer 토크나이징, 벡터 임베딩",
                  "LangChain + FAISS 기반 RAG 구조",
                ],
              },
              {
                category: "확장성",
                items: [
                  "AWS Bedrock 활용 지속 학습",
                  "확장성 테스트 진행",
                  "AI 역량 확보 및 기술 신뢰도 제고",
                ],
              },
            ],
          },
        },
      };
    }

    if (lowerInput.includes("성능") || lowerInput.includes("최적화")) {
      return {
        content: "서비스 성능 최적화 결과를 보여드리겠습니다.",
        dynamicContent: {
          type: "chart",
          data: {
            title: "성능 최적화 결과",
            type: "bar",
            data: {
              labels: [
                "First Load JS",
                "API 호출 수",
                "렌더링 시간",
                "메모리 사용량",
              ],
              datasets: [
                {
                  label: "최적화 전",
                  data: [270, 100, 1200, 180],
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
                {
                  label: "최적화 후",
                  data: [210, 40, 800, 120],
                  backgroundColor: "rgba(75, 192, 192, 0.5)",
                },
              ],
            },
          },
        },
      };
    }

    return {
      content:
        "어떤 프로젝트나 기술 경험에 대해 더 자세히 알고 싶으신가요? 예를 들어 '모노레포 구축 경험', 'Trading 대시보드 개발', 'Chrome Extension 개발', 'LLM 챗봇 프로젝트' 등에 대해 물어보실 수 있습니다.",
    };
  }
}

export const aiService = new AIService();
