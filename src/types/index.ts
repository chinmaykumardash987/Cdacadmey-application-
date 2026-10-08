export type ClassLevel = 'Class 11' | 'Class 12';

export type UserRole = 'student' | 'admin';

export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  uid?: string;
  fullName: string;
  name?: string;
  email: string;
  phone: string;
  role: UserRole;
  classLevel: ClassLevel | 'All';
  class?: string;
  board?: string;
  rollNumber?: string;
  status: UserStatus;
  isActive?: boolean;
  createdAt: string;
  lastLogin?: string;
  avatarUrl?: string;
  profileImage?: string;
  enrolledBatches?: string[];
  notificationPermission?: 'granted' | 'denied' | 'default';
  fcmToken?: string;
}

export type Subject = 
  | 'Physics'
  | 'Chemistry'
  | 'Mathematics'
  | 'Biology'
  | 'English';

export interface Note {
  id: string;
  noteId?: string;
  title: string;
  classLevel: ClassLevel;
  class?: string;
  subject: Subject;
  chapter: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  pageCount: number;
  uploaderId: string;
  uploaderName?: string;
  uploadedAt?: string;
  batchId?: string;
  createdAt: string;
  tags?: string[];
  youtubeVideoUrl?: string;
  youtubeVideoTitle?: string;
}

export interface Lecture {
  id: string;
  lectureId?: string;
  title: string;
  classLevel: ClassLevel;
  class?: string;
  subject: Subject;
  chapter: string;
  lectureNumber: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  uploaderId: string;
  uploaderName?: string;
  uploadedAt?: string;
  batchId?: string;
  createdAt: string;
}

export interface DPP {
  id: string;
  dppId?: string;
  title: string;
  classLevel: ClassLevel;
  class?: string;
  subject: Subject;
  chapter: string;
  description: string;
  fileUrl: string;
  questionsCount: number;
  maxMarks?: number;
  uploaderId: string;
  uploaderName?: string;
  batchId?: string;
  createdAt: string;
  youtubeVideoUrl?: string;
  youtubeVideoTitle?: string;
}

export interface Batch {
  id?: string;
  batchId: string;
  name?: string;
  batchName: string;
  classLevel?: ClassLevel;
  class: string;
  description: string;
  price?: number;
  startDate?: string;
  endDate?: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  status: 'active' | 'upcoming' | 'archived';
  studentCount?: number;
  enrolledStudentsCount?: number;
  subjects?: Subject[];
  createdAt: string;
}

export interface TestQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer?: number | string;
  correctAnswerIndex?: number;
  marks: number;
  explanation?: string;
}

export interface TestItem {
  id?: string;
  testId: string;
  title: string;
  classLevel?: ClassLevel;
  class: string;
  subject: Subject;
  chapter?: string;
  durationMinutes?: number;
  duration?: number;
  totalQuestions?: number;
  totalMarks: number;
  questions: TestQuestion[];
  batchId?: string;
  status: 'upcoming' | 'live' | 'completed';
  scheduledDate?: string;
  createdAt: string;
}

export interface TestResultItem {
  id?: string;
  resultId: string;
  userId: string;
  studentName?: string;
  testId: string;
  testTitle?: string;
  subject?: Subject;
  score: number;
  totalMarks: number;
  percentage: number;
  timeTaken?: string;
  timeTakenSeconds?: number;
  submittedAt: string;
}

export interface NotificationItem {
  id?: string;
  notificationId: string;
  title: string;
  message: string;
  type?: 'lecture' | 'note' | 'dpp' | 'test' | 'announcement';
  targetType: 'all' | 'class' | 'batch' | 'student';
  targetClass?: ClassLevel | 'All' | string;
  targetBatch?: string;
  targetStudentId?: string;
  readBy?: string[];
  actionUrl?: string;
  actionTab?: ActiveTab;
  imageURL?: string;
  createdAt: string;
  isRead?: boolean;
  isActive?: boolean;
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

export type AdminTab =
  | 'dashboard'
  | 'students'
  | 'batches'
  | 'notes'
  | 'lectures'
  | 'dpp'
  | 'tests'
  | 'notifications'
  | 'guide'
  | 'settings';
