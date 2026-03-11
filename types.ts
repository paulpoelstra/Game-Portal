
export enum ProjectStatus {
  DRAFT = 'Draft',
  CONTENT_GEN = 'AI Generation',
  REVIEW = 'Review',
  SET_BUILDING = 'Set Building',
  TEMPLATE_CHECK = 'Template Check',
  PRINT_READY = 'Ready for Print',
  PRODUCTION = 'In Production'
}

export type UserRole = 'Lead Editor' | 'Editor' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type RoundType = 'Normal 5Q' | 'Ordering' | 'List' | 'Rules';

export interface CardLayoutSpec {
  roundType: RoundType;
  widthMm: number;
  heightMm: number;
  maxCharsQuestion: number; // Voor Rules: Koptekst
  maxCharsAnswer: number;   // Voor Rules: Body Voorzijde
  maxCharsBack?: number;    // Voor Rules: Body Achterzijde
  maxCharsFactoid?: number;
  safeMarginMm: number;
  // Typography additions
  titleFont?: string;
  titleSize?: number;
  bodyFont?: string;
  bodySize?: number;
}

export interface TextFitRules {
  id: string;
  name: string;
  normal: { 
    warnChars: number; 
    maxChars: number; 
    warnLines: number; 
    maxLines: number; 
  };
  ordering: { 
    promptWarn: number; 
    promptMax: number; 
    itemWarn: number; 
    itemMax: number; 
  };
  list: { 
    promptWarn: number; 
    promptMax: number; 
    hintWarn: number; 
    hintMax: number; 
  };
}

export interface Game {
  id: string;
  name: string;
  description: string;
  gridQuizzes: number;
  gridRounds: number;
  categories: string[];
  allowedRoundTypes: RoundType[];
  textFitPresetId: string;
  layoutSpecs?: CardLayoutSpec[];
}

export interface ExampleQuestion {
  id: string;
  gameId: string;
  category: string;
  question: string;
  answer: string;
  adminRating: number; // 1-5
  aiDifficulty: number; // 1-5
  sourceFile?: string;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answer: string;
  factoid?: string;
}

export interface RoundCard {
  id: string;
  type: RoundType;
  prompt?: string;
  hint?: string;
  items?: string[];
  questions: QuizQuestion[];
  reviewStatus: 'Pending' | 'Approved' | 'Rejected';
  fitStatus: 'Ok' | 'Near limit' | 'Overflow';
  origin?: string;
}

export interface Edition {
  id: string;
  gameId: string;
  name: string;
  language: string;
  region: string;
  year: number;
  sku: string;
  format: 'Card Deck' | 'Board Game' | 'Box Set';
  theme?: string;
  description?: string;
  textFitRulesId: string;
  allowedSources?: string[];
}

export interface Project {
  id: string;
  name: string;
  editionId: string;
  status: ProjectStatus;
  progress: number;
  totalQuestions: number;
  deadline: string;
  owner: string;
  lastModified: string;
  grid: RoundCard[][];
}

export interface Task {
  id: string;
  label: string;
  priority: 'High' | 'Medium' | 'Low';
  project: string;
}
