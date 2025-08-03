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
import type { Project } from "@/types/resume";

// 프로젝트 상세 컴포넌트

// 프로젝트 상세 컴포넌트
export default function ProjectDetail({
  project,
  index,
  totalCount,
  parentIsOpen,
}: {
  project: Project;
  index: number;
  totalCount: number;
  parentIsOpen: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!parentIsOpen) {
      setIsOpen(false);
      return;
    }
    // 부모가 열려있을 때만 순차적으로 열기
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, index * 3000); // 1초 간격으로 순차 오픈
    // 다음 프로젝트가 있다면 현재 프로젝트를 닫기
    if (index < totalCount - 1) {
      const closeTimer = setTimeout(
        () => {
          setIsOpen(false);
        },
        (index + 1) * 3000
      ); // 3초 동안 열려있다가 닫힘

      return () => {
        clearTimeout(openTimer);
        clearTimeout(closeTimer);
      };
    }

    return () => clearTimeout(openTimer);
  }, [index, totalCount, parentIsOpen]);

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
