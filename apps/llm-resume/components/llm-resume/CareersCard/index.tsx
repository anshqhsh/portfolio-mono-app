"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import { RESUME_DATA } from "@/constants/resume";
import CompanyExperience from "../CompanyExperience";
import { motion, AnimatePresence } from "framer-motion";
import { getCompanyReadingTime } from "@/utils/text";
import { FastForward, Play, Pause } from "lucide-react";

export default function CareersCard() {
  const [activeCompanyIndex, setActiveCompanyIndex] = useState<number | null>(
    null
  );
  const [animationComplete, setAnimationComplete] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // 전체 애니메이션 진행률 계산
  const totalCompanies = RESUME_DATA.length;
  const currentProgress =
    activeCompanyIndex !== null
      ? ((activeCompanyIndex + 1) / totalCompanies) * 100
      : 0;

  useEffect(() => {
    setProgress(currentProgress);
  }, [currentProgress]);

  useEffect(() => {
    if (isPaused || userInteracted || animationComplete) return;

    // 첫 번째 회사부터 시작
    setActiveCompanyIndex(0);

    let currentCompanyIndex = 0;
    let accumulatedDelay = 0;

    const processNextCompany = () => {
      if (
        currentCompanyIndex >= RESUME_DATA.length ||
        userInteracted ||
        isPaused
      ) {
        if (currentCompanyIndex >= RESUME_DATA.length) {
          setAnimationComplete(true);
          setProgress(100);
        }
        return;
      }

      const company = RESUME_DATA[currentCompanyIndex];
      if (!company) {
        setAnimationComplete(true);
        return;
      }

      const readingTime = getCompanyReadingTime(company);

      // 현재 회사의 프로젝트들이 모두 표시된 후 다음 회사로
      setTimeout(() => {
        if (userInteracted || isPaused) return;

        currentCompanyIndex++;
        if (currentCompanyIndex < RESUME_DATA.length) {
          setActiveCompanyIndex(currentCompanyIndex);
          processNextCompany();
        } else {
          setAnimationComplete(true);
          setProgress(100);
        }
      }, readingTime);

      accumulatedDelay += readingTime;
    };

    // 첫 번째 회사 처리 시작
    processNextCompany();
  }, [userInteracted, isPaused, animationComplete]);

  const handleUserInteraction = (index: number, open: boolean) => {
    if (!userInteracted) {
      setUserInteracted(true);
      setAnimationComplete(true);
      setProgress(100);
    }

    if (open) {
      setActiveCompanyIndex(index);
    } else if (index === activeCompanyIndex) {
      setActiveCompanyIndex(null);
    }
  };

  const handleSkip = () => {
    setUserInteracted(true);
    setAnimationComplete(true);
    setProgress(100);
    setActiveCompanyIndex(RESUME_DATA.length - 1); // 마지막 회사로 이동
  };

  const handlePlayPause = () => {
    if (animationComplete || userInteracted) return;
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setUserInteracted(false);
    setAnimationComplete(false);
    setIsPaused(false);
    setProgress(0);
    setActiveCompanyIndex(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>경력</CardTitle>

          {/* 애니메이션 제어 버튼들 */}
          {!animationComplete && !userInteracted && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPause}
                className="h-8 w-8 p-0"
              >
                {isPaused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-8 w-8 p-0"
              >
                <FastForward className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* 재시작 버튼 (애니메이션 완료 후) */}
          {(animationComplete || userInteracted) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-sm"
            >
              다시 보기
            </Button>
          )}
        </div>

        {/* 프로그레스 바 */}
        {!userInteracted && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </CardHeader>

      <CardContent>
        <AnimatePresence>
          {RESUME_DATA.map((experience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <CompanyExperience
                experience={experience}
                index={index}
                isOpen={index === activeCompanyIndex}
                animationComplete={animationComplete}
                userInteracted={userInteracted}
                onOpenChange={(open) => handleUserInteraction(index, open)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
