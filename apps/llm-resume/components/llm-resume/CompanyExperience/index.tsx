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
import { getProjectReadingTime } from "@/utils/text";

// 프로젝트 상세 컴포넌트
function ProjectDetail({
  project,
  index,
  totalCount,
  parentIsOpen,
  allProjects,
  animationComplete,
  userInteracted,
  isActiveCompany,
}: {
  project: Project;
  index: number;
  totalCount: number;
  parentIsOpen: boolean;
  allProjects: Project[];
  animationComplete: boolean;
  userInteracted: boolean;
  isActiveCompany: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!parentIsOpen) {
      setIsOpen(false);
      return;
    }

    // 사용자가 인터랙션했거나 애니메이션이 완료된 후에는 자동으로 닫히지 않음
    if (userInteracted || animationComplete) {
      // 애니메이션 완료 후 현재 상태 유지 (자동으로 열지 않음)
      return;
    }

    // 현재 활성화된 회사가 아니면 애니메이션 실행하지 않음
    if (!isActiveCompany) {
      return;
    }

    // 이전 프로젝트들의 누적 읽기 시간 계산
    let accumulatedDelay = 0;
    for (let i = 0; i < index; i++) {
      const previousProject = allProjects[i];
      if (previousProject) {
        const readingTime = getProjectReadingTime(previousProject);
        accumulatedDelay += readingTime + 300; // 읽기 시간 + 전환 딜레이
      }
    }

    // 부모가 열려있을 때만 순차적으로 열기
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, accumulatedDelay);

    // 다음 프로젝트가 있다면 현재 프로젝트를 닫기
    if (index < totalCount - 1) {
      const readingTime = getProjectReadingTime(project);
      const closeTimer = setTimeout(() => {
        setIsOpen(false);
      }, accumulatedDelay + readingTime); // 누적 딜레이 + 현재 프로젝트 읽기 시간

      return () => {
        clearTimeout(openTimer);
        clearTimeout(closeTimer);
      };
    }

    return () => clearTimeout(openTimer);
  }, [
    index,
    totalCount,
    parentIsOpen,
    project,
    allProjects,
    animationComplete,
    userInteracted,
    isActiveCompany,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Accordion
        type="single"
        collapsible
        value={isOpen ? `project-${index}` : ""}
        onValueChange={(value) => setIsOpen(value === `project-${index}`)}
      >
        <AccordionItem value={`project-${index}`}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold text-lg text-left">
                {project.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.techStack.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.techStack.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="pl-4 border-l-2 border-blue-500"
                >
                  {project.achievements.map((achievement, achievementIndex) => (
                    <motion.div
                      key={achievementIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: achievementIndex * 0.2 }}
                      className="mb-4"
                    >
                      <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                        {achievement.category}
                      </h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {achievement.items.map((item, itemIndex) => (
                          <motion.li
                            key={itemIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              delay: (achievementIndex * 3 + itemIndex) * 0.1,
                            }}
                            className="text-slate-600 dark:text-slate-400"
                          >
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-2 mt-4"
                  >
                    {project.techStack.map((tech, techIndex) => (
                      <motion.div
                        key={tech}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: techIndex * 0.1 }}
                      >
                        <Badge variant="outline">{tech}</Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}

// 회사 경력 컴포넌트
export default function CompanyExperience({
  experience,
  index,
  isOpen,
  animationComplete,
  userInteracted,
  onOpenChange,
}: {
  experience: Resume;
  index: number;
  isOpen: boolean;
  animationComplete: boolean;
  userInteracted: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="mb-8"
    >
      <Accordion
        type="single"
        collapsible
        value={isOpen ? "projects" : ""}
        onValueChange={(value) => onOpenChange(value === "projects")}
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
          <AccordionContent>
            <AnimatePresence>
              {isOpen &&
                experience.projects.map((project, projectIndex) => (
                  <ProjectDetail
                    key={projectIndex}
                    project={project}
                    index={projectIndex}
                    totalCount={experience.projects.length}
                    parentIsOpen={isOpen}
                    allProjects={experience.projects}
                    animationComplete={animationComplete}
                    userInteracted={userInteracted}
                    isActiveCompany={isOpen}
                  />
                ))}
            </AnimatePresence>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
