"use client";

import TechStacksCard from "@/components/llm-resume/TechStacksCard";
import CareersCard from "@/components/llm-resume/CareersCard";
import ProfilesCard from "@/components/llm-resume/ProfilesCard";
import ResumeHeader from "@/components/llm-resume/ResumeHeader";
import { ChatInterface } from "@/components/ChatInterface";

// 메인 페이지 컴포넌트
export default function LLMResumePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <ResumeHeader />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ProfilesCard />
            <TechStacksCard />
            <CareersCard />
          </div>
          <div className="lg:col-span-1">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}
