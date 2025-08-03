"use client";

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

import { RESUME_DATA } from "@/constants/resume";
import CompanyExperience from "@/components/llm-resume/CompanyExperience";

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
                    <h4 className="font-semibold mb-2">Core</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "React",
                        "Next.js",
                        "TypeScript",
                        "Tailwind CSS",
                        "React Query",
                      ].map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">UI/UX</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "shadcn/ui",
                        "Radix UI",
                        "Framer Motion",
                        "TradingView",
                      ].map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Architecture</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Turborepo",
                        "Chrome Extension",
                        "SSE",
                        "Module Federation",
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
