"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { RESUME_DATA } from "@/constants/resume";
import CompanyExperience from "../CompanyExperience";
import { motion, AnimatePresence } from "framer-motion";
import { getCompanyReadingTime } from "@/utils/text";

export default function CareersCard() {
  const [activeCompanyIndex, setActiveCompanyIndex] = useState<number | null>(
    null
  );
  const [animationComplete, setAnimationComplete] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    // 첫 번째 회사부터 시작
    setActiveCompanyIndex(0);

    let currentCompanyIndex = 0;
    let accumulatedDelay = 0;

    const processNextCompany = () => {
      if (currentCompanyIndex >= RESUME_DATA.length || userInteracted) {
        setAnimationComplete(true);
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
        if (userInteracted) return;

        currentCompanyIndex++;
        if (currentCompanyIndex < RESUME_DATA.length) {
          setActiveCompanyIndex(currentCompanyIndex);
          processNextCompany();
        } else {
          setAnimationComplete(true);
        }
      }, readingTime);

      accumulatedDelay += readingTime;
    };

    // 첫 번째 회사 처리 시작
    processNextCompany();
  }, [userInteracted]);

  const handleUserInteraction = (index: number, open: boolean) => {
    if (!userInteracted) {
      setUserInteracted(true);
      setAnimationComplete(true);
    }

    if (open) {
      setActiveCompanyIndex(index);
    } else if (index === activeCompanyIndex) {
      setActiveCompanyIndex(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>경력</CardTitle>
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
