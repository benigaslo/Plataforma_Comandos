export type OperatingSystem = 'linux' | 'windows';

export type UserRole = 'student' | 'teacher';

export type CourseGroup = '1DAM' | '1DAW' | '2SMR';

export type ThemeMode = 'dark' | 'light' | 'matrix';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  course?: CourseGroup;
  xp: number;
  level: number;
  streak: number;
  avatar: string;
  completed_exercises: string[]; // exercise IDs
  badges: string[]; // badge IDs
}

export interface Exercise {
  id: string;
  title: string;
  os: OperatingSystem;
  module: string;
  difficulty: 'fácil' | 'medio' | 'avanzado';
  xpReward: number;
  mission: string;
  explanation: string;
  startingDir?: string;
  hint: string;
  validCommandPatterns: (string | RegExp)[];
  simulatedOutput: string;
  secondaryValidCommands?: string[];
  isCustom?: boolean; // created by teacher
  createdBy?: string;
  targetCourse?: CourseGroup | 'TODOS';
}

export interface ExerciseModule {
  id: string;
  name: string;
  os: OperatingSystem;
  description: string;
  exercises: Exercise[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'linux' | 'windows' | 'streak' | 'general';
  xpBonus: number;
  condition: (user: UserProfile) => boolean;
}

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'success';
  content: string;
  prompt?: string;
}

export interface StudentProgressRow {
  studentId: string;
  studentName: string;
  studentEmail: string;
  role: UserRole;
  course: CourseGroup;
  initialPassword?: string;
  level: number;
  xp: number;
  streak: number;
  completedCount: number;
  totalExercises: number;
  lastActive: string;
  recentAttempts: {
    exerciseId: string;
    exerciseTitle: string;
    command: string;
    success: boolean;
    timestamp: string;
  }[];
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  course: CourseGroup;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  completedCount: number;
  rankTitle: string;
  isCurrentUser?: boolean;
}
