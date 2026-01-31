// types/app.d.ts

interface AppNavigation {
  title: string;
  path: string;
  icon: string;
  color: string;
}

interface UserExperience {
  id: string;
  userId: string;
  category: 'shiru' | 'miru' | 'kiku' | 'iku';
  content: string;
  createdAt: Date;
}