export type ClassLevel = 'Class 11' | 'Class 12';

export type UserRole = 'student' | 'admin';

export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  classLevel: ClassLevel | 'All';
  status: UserStatus;
  createdAt: string;
  avatarUrl?: string;
}

export type Subject = 
  | 'Physics'
  | 'Chemistry'
  | 'Mathematics'
  | 'Biology'
  | 'English';

export interface Note {
  id: string;
  title: string;
  classLevel: ClassLevel;
  subject: Subject;
  chapter: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  pageCount: number;
  uploaderId: string;
  uploaderName?: string;
  createdAt: string;
  tags?: string[];
  youtubeVideoUrl?: string;
  youtubeVideoTitle?: string;
}

export interface Lecture {
  id: string;
  title: string;
  classLevel: ClassLevel;
  subject: Subject;
  chapter: string;
  lectureNumber: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  uploaderId: string;
  uploaderName?: string;
  createdAt: string;
}

export interface DPP {
  id: string;
  title: string;
  classLevel: ClassLevel;
  subject: Subject;
  chapter: string;
  description: string;
  fileUrl: string;
  questionsCount: number;
  maxMarks?: number;
  uploaderId: string;
  uploaderName?: string;
  createdAt: string;
  youtubeVideoUrl?: string;
  youtubeVideoTitle?: string;
}

export interface TestSeries {
  id: string;
  title: string;
  classLevel: ClassLevel;
  subject: Subject;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  status: 'upcoming' | 'live' | 'completed';
  scheduledDate: string;
}

export type ActiveTab = 'dashboard' | 'notes' | 'lectures' | 'dpp' | 'tests' | 'profile';

export type AdminTab = 'dashboard' | 'students' | 'notes' | 'lectures' | 'dpp' | 'settings' | 'guide';
