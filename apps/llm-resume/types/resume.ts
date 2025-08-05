// 데이터 타입 정의
export interface Achievement {
  category: string;
  items: string[];
}

export interface Project {
  title: string;
  achievements: Achievement[];
  techStack: string[];
}

export interface Resume {
  company: string;
  period: string;
  description: string;
  projects: Project[];
}
