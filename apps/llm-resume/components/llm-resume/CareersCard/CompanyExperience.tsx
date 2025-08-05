"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";
import type { Project, Resume } from "@/types/resume";
import ProjectDetail from "./ProjectDetail";

// 프로젝트 상세 컴포넌트

// 회사 경력 컴포넌트
export default function CompanyExperience({
  experience,
  index,
  totalCount,
}: {
  experience: Resume;
  index: number;
  totalCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // 자동 아코디언 효과
  useEffect(() => {
    // 현재 아코디언을 열고
    setIsOpen(true);

    // 다음 아코디언이 있다면, 일정 시간 후 현재 아코디언을 닫음
    if (index < totalCount - 1) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 5000); // 5초 후 닫힘

      return () => clearTimeout(timer);
    }
  }, [index, totalCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.3 }}
      className="mb-8"
    >
      <Accordion
        type="single"
        collapsible
        value={isOpen ? "projects" : ""}
        onValueChange={(value) => setIsOpen(value === "projects")}
      >
        <AccordionItem value="projects">
          <AccordionTrigger className="hover:no-underline">
            <div className="text-left">
              <h3 className="text-xl font-semibold">{experience.company}</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {experience.period}
              </p>
              <p className="text-sm mt-1">{experience.description}</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-2">
            <AnimatePresence>
              {isOpen &&
                experience.projects.map((project, projectIndex) => (
                  <ProjectDetail
                    key={projectIndex}
                    project={project}
                    index={projectIndex}
                    totalCount={experience.projects.length}
                    parentIsOpen={isOpen}
                  />
                ))}
            </AnimatePresence>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
