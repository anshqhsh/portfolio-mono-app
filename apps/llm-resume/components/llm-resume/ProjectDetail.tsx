import type { ProjectDetail } from "@/types/resume";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";

// 프로젝트 상세 컴포넌트
export default function ProjectDetail({ project }: { project: ProjectDetail }) {
  return (
    <div className="border-l-2 border-blue-500 pl-4 mb-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="projects">
          <AccordionTrigger>
            <h3 className="font-semibold text-lg">{project.title}</h3>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
