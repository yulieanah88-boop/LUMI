export interface StudentInfo {
  name: string;
  className: string;
  studentNumber?: string;
  registeredAt: string;
  avatarUrl?: string;
}

export interface ReflectionData {
  emoji: string;
  moodText: string;
  favoriteMenu: string;
  applicationText: string;
  submittedAt: string;
}

export type QuestionType = 'mc' | 'complex' | 'matching' | 'short' | 'reorder';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  title: string;
  prompt: string;
  explanation: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'mc';
  options: string[];
  correctAnswer: number;
}

export interface ComplexChoiceQuestion extends BaseQuestion {
  type: 'complex';
  options: string[];
  correctAnswers: number[]; // indices of correct options
}

export interface MatchingPair {
  id: string;
  leftText: string;
  rightText: string;
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: MatchingPair[];
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short';
  acceptedAnswers: string[];
  hint: string;
}

export interface ReorderItem {
  id: string;
  label: string;
}

export interface ReorderQuestion extends BaseQuestion {
  type: 'reorder';
  items: ReorderItem[];
  correctOrder: string[]; // array of IDs in correct order
}

export type GameQuestion =
  | MultipleChoiceQuestion
  | ComplexChoiceQuestion
  | MatchingQuestion
  | ShortAnswerQuestion
  | ReorderQuestion;

export interface HotsQuestion {
  id: number;
  caseStory: string;
  storyImage?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  dimension: string; // e.g., 'Analisis (C4)', 'Evaluasi (C5)', 'Kreasi (C6)'
}

export interface DeveloperProfile {
  name: string;
  title: string;
  institution: string;
  subject: string;
  email: string;
  creationYear: string;
  bio: string;
  avatarUrl: string;
}

export interface SectionProgress {
  belajar: boolean;
  bermain: boolean;
  berlatih: boolean;
  refleksi: boolean;
}

export interface AchievementBadge {
  id: string;
  section: keyof SectionProgress | 'grand_master';
  title: string;
  nickname: string;
  icon: string;
  color: string;
  borderColor: string;
  bgGradient: string;
  description: string;
  requirement: string;
  quote: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  className: string;
  studentNumber?: string;
  score: number;
  date: string;
  isCurrentUser?: boolean;
  avatarUrl?: string;
}

export type ActiveScreen =
  | 'welcome'
  | 'theme_select'
  | 'registration'
  | 'home'
  | 'belajar'
  | 'bermain'
  | 'berlatih'
  | 'refleksi'
  | 'sumber'
  | 'pengembang';

export * from './theme';
