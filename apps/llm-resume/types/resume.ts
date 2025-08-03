// 데이터 타입 정의
export interface Achievement {
  category: string;
  items: string[];
}

export interface ProjectDetail {
  title: string;
  achievements: Achievement[];
  techStack: string[];
}

export interface ResumeData {
  company: string;
  period: string;
  description: string;
  projects: ProjectDetail[];
}
