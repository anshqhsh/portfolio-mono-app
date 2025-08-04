import type { Project, Resume } from "@/types/resume";

export const getReadingTimeByChars = (text: string) => {
  const avgWordLength = 5;
  const words = text.length / avgWordLength;
  const wordsPerMinute = 200;
  return Math.ceil((words / wordsPerMinute) * 60 * 100); // milliseconds로 반환
};

export const getProjectReadingTime = (project: Project) => {
  // 프로젝트 제목
  let totalText = project.title;

  // 모든 업적 텍스트
  project.achievements.forEach((achievement) => {
    totalText += achievement.category;
    totalText += achievement.items.join("");
  });

  return getReadingTimeByChars(totalText);
};

export const getCompanyReadingTime = (company: Resume) => {
  // 회사 기본 정보
  let totalText = `${company.company} ${company.period} ${company.description}`;

  // 프로젝트들의 읽기 시간 합산
  const projectsTime = company.projects.reduce((total, project) => {
    return total + getProjectReadingTime(project);
  }, 0);

  return getReadingTimeByChars(totalText) + projectsTime;
};
