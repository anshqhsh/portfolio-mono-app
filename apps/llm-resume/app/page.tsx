"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { MessageSquare, Github, Mail, Phone, MapPin } from "lucide-react";
import { ChatInterface } from "../components/ChatInterface";

// 데이터 타입 정의
interface Achievement {
  category: string;
  items: string[];
}

interface ProjectDetail {
  title: string;
  achievements: Achievement[];
  techStack: string[];
}

interface Project {
  company: string;
  period: string;
  description: string;
  projects: ProjectDetail[];
}

// 이력서 데이터
const RESUME_DATA: Project[] = [
  {
    company: "VEGAX",
    period: "2023.12 ~ 재직중",
    description: "Next.js + Turborepo 기반 모노레포 아키텍처 설계 및 구축",
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
            category: "코드 품질 개선",
            items: [
              "React + Next.js 기반 레거시 코드 모듈화 및 컴포넌트화",
              "목적 기반으로 UI 구조를 재설계하여 코드 중복 제거, 관심사 분리",
              "가독성 및 유지보수성 향상",
            ],
          },
          {
            category: "성능 최적화",
            items: [
              "React Query의 useQueries, staleTime, cacheTime 등 옵션을 적절히 활용",
              "대용량 데이터에 대한 불필요한 API 호출 최소화",
              "데이터 일관성 및 렌더링 성능 최적화",
            ],
          },
          {
            category: "차트 시스템 개발",
            items: [
              "TradingView 기반 OHLC 차트에 커스텀 피더 및 인디케이터 연동",
              "단위별 시계열 데이터 및 실시간 지표 데이터를 내부 API로 구성",
              "Custom Data Feeder 및 Indicator를 통해 시그널 라벨, 커스텀 지표선 시각화",
            ],
          },
          {
            category: "데이터 처리",
            items: [
              "BigNumber 라이브러리를 활용한 정밀 소수점 계산 처리",
              "다양한 숫자 형식을 안정적으로 대응할 수 있도록 숫자 전용 유틸 함수 작성",
              "콤마/포맷 처리 로직 구현",
            ],
          },
        ],
        techStack: [
          "React",
          "Next.js",
          "TradingView",
          "React Query",
          "BigNumber.js",
        ],
      },
      {
        title: "TradingView 파라미터 자동 탐색 도구",
        achievements: [
          {
            category: "자동화 시스템",
            items: [
              "Chrome Extension 기반 파라미터 제어·데이터 수집 도구 개발",
              "퀀트 리서치팀의 수작업 파라미터 입력·백테스트 반복을 자동화",
              "TradingView DOM 제어로 파라미터 조작",
            ],
          },
          {
            category: "데이터 관리",
            items: [
              "로컬 스토리지 활용으로 데이터 지속성 확보",
              "연결 끊김·사용자 실수 상황에서도 작업 무중단",
              "파라미터 Set 관리 로직으로 메모리 최적화",
            ],
          },
          {
            category: "알고리즘 개선",
            items: [
              "랜덤 파라미터 조합 생성 알고리즘 도입",
              "최적 파라미터 탐색 효율 극대화",
              "DOM 변화 감지 기반 자동 일시정지·재개 로직 구현",
            ],
          },
        ],
        techStack: [
          "Chrome Extension",
          "TypeScript",
          "DOM API",
          "Local Storage",
        ],
      },
      {
        title: "LLM 기반 생명정보학 챗봇",
        achievements: [
          {
            category: "UI/UX 개발",
            items: [
              "SSE 기반 대화형 챗 UI 구현",
              "실시간 AI 응답 스트리밍을 지원하여 사용자 인터랙션 품질 향상",
            ],
          },
          {
            category: "AI 시스템",
            items: [
              "Biology-Instructions 논문 기반 Multi-Omics 시퀀스 분석 흐름 구현",
              "k-mer 토크나이징, 벡터 임베딩, LLM 기반 질의응답 구조 설계",
              "LangChain + FAISS 기반 RAG 구조 구성",
            ],
          },
          {
            category: "확장성",
            items: [
              "AWS Bedrock을 활용한 지속 학습 실험 및 확장성 테스트 진행",
              "AI 역량 확보의 근거로 활용",
              "기술 신뢰도 제고 및 투자 유치에 긍정적 기여",
            ],
          },
        ],
        techStack: ["LangChain", "FAISS", "AWS Bedrock", "SSE", "Next.js"],
      },
    ],
  },
];

// 프로젝트 상세 컴포넌트
function ProjectDetail({ project }: { project: ProjectDetail }) {
  return (
    <div className="border-l-2 border-blue-500 pl-4 mb-6">
      <h3 className="font-semibold text-lg">{project.title}</h3>

      {project.achievements.map((achievement, index) => (
        <div key={index} className="mb-4">
          <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
            {achievement.category}
          </h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {achievement.items.map((item, itemIndex) => (
              <li
                key={itemIndex}
                className="text-slate-600 dark:text-slate-400"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="flex flex-wrap gap-2 mt-4">
        {project.techStack.map((tech) => (
          <Badge key={tech} variant="outline">
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// 회사 경력 컴포넌트
function CompanyExperience({ experience }: { experience: Project }) {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{experience.company}</h3>
        <p className="text-slate-600 dark:text-slate-400">
          {experience.period}
        </p>
        <p className="text-sm mt-1">{experience.description}</p>
      </div>

      {experience.projects.map((project, index) => (
        <ProjectDetail key={index} project={project} />
      ))}
    </div>
  );
}

// 메인 페이지 컴포넌트
export default function LLMResumePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            AI-Powered Resume
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            AI와 대화하며 제 이력서를 탐색해보세요
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resume Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/avatar.jpg" alt="Profile" />
                    <AvatarFallback>JH</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">이준혁</CardTitle>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                      Frontend Developer
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">React</Badge>
                      <Badge variant="secondary">Next.js</Badge>
                      <Badge variant="secondary">TypeScript</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>anshqhsh.dev@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>010-4031-2329</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>서울, 대한민국</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    <a
                      href="https://github.com/anshqhsh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      github.com/anshqhsh
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle>경력</CardTitle>
              </CardHeader>
              <CardContent>
                {RESUME_DATA.map((experience, index) => (
                  <CompanyExperience key={index} experience={experience} />
                ))}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>기술 스택</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Frontend</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "React",
                        "Next.js",
                        "TypeScript",
                        "Tailwind CSS",
                        "Framer Motion",
                        "shadcn/ui",
                        "React Query",
                      ].map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Backend & DevOps</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Node.js",
                        "Express",
                        "AWS",
                        "Docker",
                        "Turborepo",
                        "GitHub Actions",
                      ].map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">AI & Data</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "LangChain",
                        "FAISS",
                        "AWS Bedrock",
                        "OpenAI API",
                        "Vector DB",
                      ].map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Chat Section */}
          <div className="lg:col-span-1">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}
