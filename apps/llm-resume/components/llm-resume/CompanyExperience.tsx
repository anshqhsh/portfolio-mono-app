import { ResumeData } from "@/types/resume";
import ProjectDetail from "./ProjectDetail";

// 회사 경력 컴포넌트
export default function CompanyExperience({
  experience,
}: {
  experience: ResumeData;
}) {
  return (
    <div className="mb-8">
      <div>
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
