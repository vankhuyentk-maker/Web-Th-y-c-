import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole,
  Student,
  ClassRoom,
  Task,
  DocumentItem,
  Quiz,
  QuizResult,
  AppNotification,
  ActiveTab,
  TaskStatus
} from '../types';
import {
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_TASKS,
  INITIAL_DOCUMENTS,
  INITIAL_QUIZZES,
  INITIAL_QUIZ_RESULTS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';
import { playSound } from '../utils/audio';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  userRole: UserRole;
  currentStudentId: string;
  currentStudent: Student | undefined;
  teacherName: string;
  schoolName: string;
  activeTab: ActiveTab;
  soundEnabled: boolean;
  toast: ToastMessage | null;
  classes: ClassRoom[];
  students: Student[];
  tasks: Task[];
  documents: DocumentItem[];
  quizzes: Quiz[];
  quizResults: QuizResult[];
  notifications: AppNotification[];
  unreadNotifCount: number;

  // Setters & Actions
  setUserRole: (role: UserRole) => void;
  setCurrentStudentId: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: () => void;
  resetToDemoData: () => void;

  // Student & Class
  addClass: (cls: Omit<ClassRoom, 'id'>) => void;
  updateClass: (cls: ClassRoom) => void;
  deleteClass: (id: string) => void;
  addStudent: (std: Omit<Student, 'id'>) => void;
  updateStudent: (std: Student) => void;
  deleteStudent: (id: string) => void;

  // Task
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'submissions'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateStudentTaskStatus: (taskId: string, studentId: string, status: TaskStatus, note?: string) => void;

  // Document
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => void;
  updateDocument: (doc: DocumentItem) => void;
  deleteDocument: (id: string) => void;

  // Quiz & Grading
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => void;
  updateQuiz: (quiz: Quiz) => void;
  deleteQuiz: (id: string) => void;
  submitQuizResult: (result: Omit<QuizResult, 'id' | 'completedAt'>) => QuizResult;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'dtlm_user_role',
  STUDENT_ID: 'dtlm_student_id',
  CLASSES: 'dtlm_classes',
  STUDENTS: 'dtlm_students',
  TASKS: 'dtlm_tasks',
  DOCUMENTS: 'dtlm_documents',
  QUIZZES: 'dtlm_quizzes',
  QUIZ_RESULTS: 'dtlm_quiz_results',
  NOTIFICATIONS: 'dtlm_notifications',
  SOUND: 'dtlm_sound_enabled'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const teacherName = 'Thầy Nguyễn Văn Khuyên';
  const schoolName = 'Trường THPT Duy Tân';

  // Sound state
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const setSoundEnabled = (val: boolean) => {
    setSoundEnabledState(val);
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND, JSON.stringify(val));
    } catch {}
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playSound('success', true);
  };

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    if (type === 'success') {
      playSound('success', soundEnabled);
    } else if (type === 'error') {
      playSound('delete', soundEnabled);
    } else {
      playSound('click', soundEnabled);
    }
  };

  const dismissToast = () => setToast(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  // Role and Active tab
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      return (saved as UserRole) || 'teacher';
    } catch {
      return 'teacher';
    }
  });

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    } catch {}
    playSound('click', soundEnabled);
    showToast(
      role === 'teacher'
        ? `Đã chuyển sang vai trò: Giáo viên (${teacherName})`
        : `Đã chuyển sang vai trò: Học sinh`,
      'info'
    );
  };

  const [currentStudentId, setCurrentStudentIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENT_ID);
      if (saved === 'std_07' || saved === 'std_08' || saved === 'std_11' || saved === 'std_12') {
        return 'std_01';
      }
      return saved || 'std_01';
    } catch {
      return 'std_01';
    }
  });

  const setCurrentStudentId = (id: string) => {
    setCurrentStudentIdState(id);
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENT_ID, id);
    } catch {}
    playSound('click', soundEnabled);
  };

  const [activeTab, setActiveTabState] = useState<ActiveTab>('dashboard');
  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    playSound('click', soundEnabled);
  };

  // Persistent collections with automatic migration for classes 11/1 & 11/4
  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.CLASSES);
      if (s) {
        const parsed: ClassRoom[] = JSON.parse(s);
        const hasOld = parsed.some((c) => ['12A1', '12A2', '11A1', '10A1'].includes(c.id || c.name));
        if (hasOld) {
          const migrated = parsed
            .filter((c) => c.id !== '12A2' && c.id !== '10A1' && c.name !== '12A2' && c.name !== '10A1')
            .map((c) => {
              if (c.id === '12A1' || c.name === '12A1') {
                return { ...c, id: '11/1', name: '11/1', grade: 11 as const };
              }
              if (c.id === '11A1' || c.name === '11A1') {
                return { ...c, id: '11/4', name: '11/4', grade: 11 as const };
              }
              return c;
            });
          return migrated.length > 0 ? migrated : INITIAL_CLASSES;
        }
        return parsed;
      }
      return INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (s) {
        const parsed: Student[] = JSON.parse(s);
        const hasOld = parsed.some((std) => ['12A1', '12A2', '11A1', '10A1'].includes(std.classId));
        if (hasOld) {
          return parsed
            .filter((std) => std.classId !== '12A2' && std.classId !== '10A1')
            .map((std) => {
              if (std.classId === '12A1') {
                return {
                  ...std,
                  classId: '11/1',
                  code: std.code.replace('1201', '1101'),
                  email: std.email ? std.email.replace('12a1', '111') : std.email
                };
              }
              if (std.classId === '11A1') {
                return {
                  ...std,
                  classId: '11/4',
                  code: std.code.replace('1101', '1104'),
                  email: std.email ? std.email.replace('11a1', '114') : std.email
                };
              }
              return std;
            });
        }
        return parsed;
      }
      return INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (s) {
        const parsed: Task[] = JSON.parse(s);
        const hasOld = parsed.some((t) => ['12A1', '12A2', '11A1', '10A1'].includes(t.classId));
        if (hasOld) {
          return parsed
            .filter((t) => t.classId !== '12A2' && t.classId !== '10A1')
            .map((t) => {
              if (t.classId === '12A1') return { ...t, classId: '11/1' };
              if (t.classId === '11A1') return { ...t, classId: '11/4' };
              return t;
            });
        }
        return parsed;
      }
      return INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return s ? JSON.parse(s) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.QUIZZES);
      if (s) {
        const parsed: Quiz[] = JSON.parse(s);
        const hasOld = parsed.some((q) => ['12A1', '12A2', '11A1', '10A1'].includes(q.classId));
        if (hasOld) {
          return parsed
            .filter((q) => q.classId !== '12A2' && q.classId !== '10A1')
            .map((q) => {
              if (q.classId === '12A1') return { ...q, classId: '11/1', grade: 11 as const };
              if (q.classId === '11A1') return { ...q, classId: '11/4', grade: 11 as const };
              return q;
            });
        }
        return parsed;
      }
      return INITIAL_QUIZZES;
    } catch {
      return INITIAL_QUIZZES;
    }
  });

  const [quizResults, setQuizResults] = useState<QuizResult[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
      if (s) {
        const parsed: QuizResult[] = JSON.parse(s);
        const hasOld = parsed.some((r) => ['12A1', '12A2', '11A1', '10A1'].includes(r.classId));
        if (hasOld) {
          return parsed
            .filter((r) => r.classId !== '12A2' && r.classId !== '10A1')
            .map((r) => {
              if (r.classId === '12A1') return { ...r, classId: '11/1' };
              if (r.classId === '11A1') return { ...r, classId: '11/4' };
              return r;
            });
        }
        return parsed;
      }
      return INITIAL_QUIZ_RESULTS;
    } catch {
      return INITIAL_QUIZ_RESULTS;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (s) {
        const parsed: AppNotification[] = JSON.parse(s);
        const hasOld = parsed.some((n) => n.message.includes('12A1') || n.title.includes('Toán 12'));
        if (hasOld) {
          return parsed.map((n) => ({
            ...n,
            title: n.title.replace('Toán 12', 'Toán 11'),
            message: n.message.replace('12A1', '11/1')
          }));
        }
        return parsed;
      }
      return INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Local storage auto-sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    } catch {}
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch {}
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
    } catch {}
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
    } catch {}
  }, [quizzes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(quizResults));
    } catch {}
  }, [quizResults]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Current student object
  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  // Reset to original demo data
  const resetToDemoData = () => {
    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS);
    setTasks(INITIAL_TASKS);
    setDocuments(INITIAL_DOCUMENTS);
    setQuizzes(INITIAL_QUIZZES);
    setQuizResults(INITIAL_QUIZ_RESULTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentStudentId('std_01');
    showToast('Đã khôi phục dữ liệu mẫu THPT Duy Tân thành công!', 'info');
  };

  // Class Actions
  const addClass = (clsData: Omit<ClassRoom, 'id'>) => {
    const id = clsData.name.trim();
    if (classes.some((c) => c.name.toLowerCase() === clsData.name.toLowerCase())) {
      showToast(`Lớp ${clsData.name} đã tồn tại!`, 'error');
      return;
    }
    const newClass: ClassRoom = { ...clsData, id };
    setClasses((prev) => [...prev, newClass]);
    showToast(`Đã thêm lớp ${newClass.name} thành công!`);
  };

  const updateClass = (updated: ClassRoom) => {
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    showToast(`Đã cập nhật thông tin lớp ${updated.name}!`);
  };

  const deleteClass = (id: string) => {
    const cls = classes.find((c) => c.id === id);
    setClasses((prev) => prev.filter((c) => c.id !== id));
    // Also remove students belonging to this class
    setStudents((prev) => prev.filter((s) => s.classId !== id));
    showToast(`Đã xóa lớp ${cls?.name || id} khỏi hệ thống!`, 'info');
  };

  // Student Actions
  const addStudent = (stdData: Omit<Student, 'id'>) => {
    const id = 'std_' + Date.now().toString().slice(-6);
    const newStudent: Student = { ...stdData, id };
    setStudents((prev) => [newStudent, ...prev]);
    showToast(`Đã thêm học sinh ${newStudent.name} (Lớp ${newStudent.classId})!`);
  };

  const updateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast(`Đã cập nhật hồ sơ học sinh ${updated.name}!`);
  };

  const deleteStudent = (id: string) => {
    const std = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast(`Đã xóa học sinh ${std?.name || ''}!`, 'info');
  };

  // Task Actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'submissions'>) => {
    const id = 'task_' + Date.now().toString().slice(-6);
    const today = new Date().toISOString().split('T')[0];
    const targetStudents =
      taskData.classId === 'Tất cả'
        ? students
        : students.filter((s) => s.classId === taskData.classId);

    const submissions: Task['submissions'] = targetStudents.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      status: 'Chưa làm'
    }));

    const newTask: Task = {
      ...taskData,
      id,
      createdAt: today,
      submissions
    };

    setTasks((prev) => [newTask, ...prev]);

    // Send notification
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      title: `Nhiệm vụ mới: ${newTask.title}`,
      message: `Giáo viên Nguyễn Văn Khuyên vừa giao nhiệm vụ môn ${newTask.subject} cho lớp ${newTask.classId}. Hạn nộp: ${newTask.dueDate}`,
      timestamp: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
      type: 'task',
      isRead: false
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Đã giao nhiệm vụ "${newTask.title}" cho lớp ${newTask.classId}!`);
  };

  const updateTask = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    showToast(`Đã cập nhật nhiệm vụ "${updated.title}"!`);
  };

  const deleteTask = (id: string) => {
    const t = tasks.find((item) => item.id === id);
    setTasks((prev) => prev.filter((item) => item.id !== id));
    showToast(`Đã xóa nhiệm vụ "${t?.title || ''}"!`, 'info');
  };

  const updateStudentTaskStatus = (
    taskId: string,
    studentId: string,
    status: TaskStatus,
    note?: string
  ) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const existingIdx = t.submissions.findIndex((s) => s.studentId === studentId);
        const std = students.find((s) => s.id === studentId);
        const submittedAt =
          status === 'Đã hoàn thành'
            ? new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
            : undefined;

        let updatedSubmissions = [...t.submissions];
        if (existingIdx >= 0) {
          updatedSubmissions[existingIdx] = {
            ...updatedSubmissions[existingIdx],
            status,
            note: note !== undefined ? note : updatedSubmissions[existingIdx].note,
            submittedAt: submittedAt || updatedSubmissions[existingIdx].submittedAt
          };
        } else if (std) {
          updatedSubmissions.push({
            studentId,
            studentName: std.name,
            status,
            note,
            submittedAt
          });
        }

        return {
          ...t,
          submissions: updatedSubmissions
        };
      })
    );

    if (status === 'Đã hoàn thành') {
      playSound('complete', soundEnabled);
      showToast('Đã đánh dấu hoàn thành nhiệm vụ! Chúc mừng em!', 'success');
    } else {
      playSound('click', soundEnabled);
      showToast(`Đã cập nhật trạng thái nhiệm vụ: ${status}`);
    }
  };

  // Document Actions
  const addDocument = (docData: Omit<DocumentItem, 'id' | 'uploadDate'>) => {
    const id = 'doc_' + Date.now().toString().slice(-6);
    const today = new Date().toISOString().split('T')[0];
    const newDoc: DocumentItem = {
      ...docData,
      id,
      uploadDate: today
    };
    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Đã thêm tài liệu "${newDoc.title}" vào kho học liệu!`);
  };

  const updateDocument = (updated: DocumentItem) => {
    setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    showToast(`Đã cập nhật tài liệu "${updated.title}"!`);
  };

  const deleteDocument = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    showToast(`Đã xóa tài liệu "${doc?.title || ''}"!`, 'info');
  };

  // Quiz Actions
  const addQuiz = (quizData: Omit<Quiz, 'id' | 'createdAt'>) => {
    const id = 'quiz_' + Date.now().toString().slice(-6);
    const today = new Date().toISOString().split('T')[0];
    const newQuiz: Quiz = {
      ...quizData,
      id,
      createdAt: today
    };
    setQuizzes((prev) => [newQuiz, ...prev]);
    showToast(`Đã tạo bài kiểm tra "${newQuiz.title}" thành công!`);
  };

  const updateQuiz = (updated: Quiz) => {
    setQuizzes((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    showToast(`Đã cập nhật bài kiểm tra "${updated.title}"!`);
  };

  const deleteQuiz = (id: string) => {
    const q = quizzes.find((item) => item.id === id);
    setQuizzes((prev) => prev.filter((item) => item.id !== id));
    showToast(`Đã xóa bài kiểm tra "${q?.title || ''}"!`, 'info');
  };

  const submitQuizResult = (resultData: Omit<QuizResult, 'id' | 'completedAt'>): QuizResult => {
    const id = 'res_' + Date.now().toString().slice(-6);
    const completedAt = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });

    const newResult: QuizResult = {
      ...resultData,
      id,
      completedAt
    };

    setQuizResults((prev) => [newResult, ...prev]);
    playSound('complete', soundEnabled);
    showToast(
      `Đã nộp bài kiểm tra thành công! Điểm số: ${newResult.score}/10 (${newResult.correctCount}/${newResult.totalCount} câu đúng)`,
      'success'
    );
    return newResult;
  };

  // Notification Actions
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('Đã đánh dấu đã đọc tất cả thông báo!');
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        currentStudentId,
        currentStudent,
        teacherName,
        schoolName,
        activeTab,
        soundEnabled,
        toast,
        classes,
        students,
        tasks,
        documents,
        quizzes,
        quizResults,
        notifications,
        unreadNotifCount,
        setUserRole,
        setCurrentStudentId,
        setActiveTab,
        setSoundEnabled,
        toggleSound,
        showToast,
        dismissToast,
        resetToDemoData,
        addClass,
        updateClass,
        deleteClass,
        addStudent,
        updateStudent,
        deleteStudent,
        addTask,
        updateTask,
        deleteTask,
        updateStudentTaskStatus,
        addDocument,
        updateDocument,
        deleteDocument,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        submitQuizResult,
        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
