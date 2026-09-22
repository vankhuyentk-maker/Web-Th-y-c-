export type UserRole = 'teacher' | 'student';

export type AcademicStatus = 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Cần cố gắng';

export interface Student {
  id: string;
  name: string;
  code: string; // e.g. HS1101
  classId: string; // e.g. 11/1
  gender: 'Nam' | 'Nữ';
  dob: string;
  academicStatus: AcademicStatus;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface ClassRoom {
  id: string;
  name: string; // 11/1, 11/4...
  grade: 10 | 11 | 12;
  room: string;
  academicYear: string;
  homeroomTeacher: string;
  description?: string;
}

export type TaskPriority = 'Cao' | 'Trung bình' | 'Thấp';
export type TaskStatus = 'Chưa làm' | 'Đang làm' | 'Đã hoàn thành' | 'Quá hạn';

export interface StudentSubmission {
  studentId: string;
  studentName: string;
  status: TaskStatus;
  submittedAt?: string;
  note?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  classId: string; // e.g. "11/1" or "Tất cả"
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus; // General/Teacher view status
  createdAt: string;
  submissions: StudentSubmission[];
}

export type DocumentType = 'pdf' | 'docx' | 'pptx' | 'video' | 'link';

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  subject: string;
  category: 'Sách giáo khoa' | 'Chuyên đề ôn tập' | 'Đề cương học kỳ' | 'Bài giảng điện tử' | 'Bài tập trắc nghiệm';
  grade: 10 | 11 | 12 | 'Tất cả';
  fileType: DocumentType;
  fileSize: string;
  uploadDate: string;
  author: string;
  readTime?: string;
  url?: string;
  previewContent?: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: 10 | 11 | 12;
  classId: string; // e.g. "11/1" or "Tất cả"
  timeLimitMinutes: number;
  totalQuestions: number;
  questions: QuizQuestion[];
  createdAt: string;
  description?: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  classId: string;
  score: number; // 0 - 10
  correctCount: number;
  totalCount: number;
  completedAt: string;
  timeSpentSeconds: number;
  answers: number[]; // chosen option index per question
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'task' | 'quiz' | 'general' | 'grade';
  isRead: boolean;
}

export type ActiveTab = 'dashboard' | 'classes' | 'tasks' | 'documents' | 'exams' | 'progress';
