import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  Plus,
  Play,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Search,
  Filter,
  Eye,
  Trash2,
  Edit2,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { Quiz, QuizQuestion, QuizResult } from '../../types';
import { ConfirmModal } from '../ConfirmModal';
import { playSound } from '../../utils/audio';

export const ExamsView: React.FC = () => {
  const {
    quizzes,
    quizResults,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuizResult,
    userRole,
    currentStudent,
    classes,
    students,
    soundEnabled
  } = useApp();

  // Active sub-tab for Teacher: 'quizzes' (danh sách đề) | 'gradebook' (sổ điểm)
  const [activeTeacherTab, setActiveTeacherTab] = useState<'quizzes' | 'gradebook'>('quizzes');
  const [gradebookFilterQuiz, setGradebookFilterQuiz] = useState<string>('all');
  const [gradebookFilterClass, setGradebookFilterClass] = useState<string>('all');
  const [gradebookSearch, setGradebookSearch] = useState('');

  // Active quiz session state (Taking a quiz)
  const [activeTakingQuiz, setActiveTakingQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [quizTimerActive, setQuizTimerActive] = useState(false);

  // Reviewing quiz result modal
  const [reviewingResult, setReviewingResult] = useState<QuizResult | null>(null);

  // Teacher Create/Edit Quiz Modal
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null);

  // New Quiz form state
  const [quizForm, setQuizForm] = useState({
    title: '',
    subject: 'Toán học',
    grade: 11 as 10 | 11 | 12,
    classId: '11/1',
    timeLimitMinutes: 15,
    description: '',
    questions: [
      {
        id: 'q_1',
        questionText: 'Cho hàm số y = f(x) có đạo hàm f\'(x) = x^2 - 4. Số điểm cực trị của hàm số là:',
        options: ['A. 0', 'B. 1', 'C. 2', 'D. 3'],
        correctAnswerIndex: 2,
        explanation: 'f\'(x) = 0 <=> x = 2 hoặc x = -2. Cả hai đều là nghiệm đơn nên f\'(x) đổi dấu qua 2 điểm này. Hàm số có 2 điểm cực trị.'
      },
      {
        id: 'q_2',
        questionText: 'Tiệm cận ngang của đồ thị hàm số y = (3x - 1) / (x + 2) là:',
        options: ['A. y = 3', 'B. x = -2', 'C. y = -1/2', 'D. y = 1/3'],
        correctAnswerIndex: 0,
        explanation: 'Bậc tử bằng bậc mẫu, hệ số cao nhất là 3 / 1 = 3. Do đó phương trình tiệm cận ngang là y = 3.'
      }
    ] as QuizQuestion[]
  });

  // Countdown timer effect
  useEffect(() => {
    if (!quizTimerActive || !activeTakingQuiz) return;

    if (timeLeftSeconds <= 0) {
      // Auto submit when time runs out!
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [quizTimerActive, timeLeftSeconds, activeTakingQuiz]);

  // Start taking a quiz
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveTakingQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(quiz.questions.length).fill(-1));
    setTimeLeftSeconds(quiz.timeLimitMinutes * 60);
    setQuizTimerActive(true);
    playSound('click', soundEnabled);
  };

  // Select an option during quiz
  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[questionIndex] = optionIndex;
      return updated;
    });
    playSound('click', soundEnabled);
  };

  // Submit quiz and calculate score
  const handleSubmitQuiz = () => {
    if (!activeTakingQuiz || !currentStudent) return;

    setQuizTimerActive(false);

    let correctCount = 0;
    activeTakingQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const totalCount = activeTakingQuiz.questions.length;
    const score = Number(((correctCount / totalCount) * 10).toFixed(1));
    const timeSpentSeconds = activeTakingQuiz.timeLimitMinutes * 60 - timeLeftSeconds;

    const result = submitQuizResult({
      quizId: activeTakingQuiz.id,
      quizTitle: activeTakingQuiz.title,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      classId: currentStudent.classId,
      score,
      correctCount,
      totalCount,
      timeSpentSeconds,
      answers: userAnswers
    });

    // Close quiz runner and open review modal
    setActiveTakingQuiz(null);
    setReviewingResult(result);
  };

  // Open Create Quiz
  const openCreateQuiz = () => {
    setEditingQuiz(null);
    setQuizForm({
      title: '',
      subject: 'Toán học',
      grade: 11,
      classId: classes[0]?.name || '11/1',
      timeLimitMinutes: 15,
      description: '',
      questions: [
        {
          id: 'q_1',
          questionText: 'Nhập câu hỏi trắc nghiệm số 1...',
          options: ['A. Phương án 1', 'B. Phương án 2', 'C. Phương án 3', 'D. Phương án 4'],
          correctAnswerIndex: 0,
          explanation: 'Lời giải chi tiết câu hỏi...'
        }
      ]
    });
    setIsCreateQuizOpen(true);
  };

  const openEditQuiz = (q: Quiz) => {
    setEditingQuiz(q);
    setQuizForm({
      title: q.title,
      subject: q.subject,
      grade: q.grade,
      classId: q.classId,
      timeLimitMinutes: q.timeLimitMinutes,
      description: q.description || '',
      questions: q.questions
    });
    setIsCreateQuizOpen(true);
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizForm.title.trim() || quizForm.questions.length === 0) return;

    if (editingQuiz) {
      updateQuiz({
        ...editingQuiz,
        ...quizForm,
        totalQuestions: quizForm.questions.length
      });
    } else {
      addQuiz({
        ...quizForm,
        totalQuestions: quizForm.questions.length
      });
    }
    setIsCreateQuizOpen(false);
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filter gradebook
  const filteredGradebook = quizResults.filter((r) => {
    if (gradebookFilterQuiz !== 'all' && r.quizId !== gradebookFilterQuiz) return false;
    if (gradebookFilterClass !== 'all' && r.classId !== gradebookFilterClass) return false;
    if (gradebookSearch) {
      const q = gradebookSearch.toLowerCase();
      return (
        r.studentName.toLowerCase().includes(q) ||
        r.quizTitle.toLowerCase().includes(q) ||
        r.classId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="exams-view-container" className="space-y-6">
      {/* ================= QUIZ RUNNER INTERFACE ================= */}
      {activeTakingQuiz ? (
        <div
          id="quiz-active-runner"
          className="bg-white rounded-2xl border border-blue-200 shadow-lg p-6 sm:p-8 space-y-6 animate-in fade-in duration-200"
        >
          {/* Top Bar of Quiz: Title, Timer, Progress */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  {activeTakingQuiz.subject}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {activeTakingQuiz.totalQuestions} câu hỏi • Thang điểm 10
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                {activeTakingQuiz.title}
              </h2>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-base ${
                  timeLeftSeconds <= 120
                    ? 'border-rose-300 bg-rose-50 text-rose-700 animate-pulse'
                    : 'border-blue-200 bg-blue-50 text-blue-800'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>

              <button
                id="btn-submit-quiz-now"
                onClick={handleSubmitQuiz}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
              >
                Nộp bài thi
              </button>
            </div>
          </div>

          {/* Question Grid Quick Navigator */}
          <div className="flex flex-wrap items-center gap-2 py-1">
            <span className="text-xs font-semibold text-slate-500 mr-2">Danh sách câu:</span>
            {activeTakingQuiz.questions.map((q, idx) => {
              const isAnswered = userAnswers[idx] !== -1;
              const isCurrent = idx === currentQuestionIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'ring-2 ring-blue-600 bg-blue-600 text-white'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Box */}
          {activeTakingQuiz.questions[currentQuestionIndex] && (
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-blue-700 uppercase tracking-wider">
                  Câu hỏi {currentQuestionIndex + 1} / {activeTakingQuiz.questions.length}
                </span>
                <span>Chọn 1 đáp án đúng nhất</span>
              </div>

              <div className="text-base font-semibold text-slate-900 leading-relaxed">
                {activeTakingQuiz.questions[currentQuestionIndex].questionText}
              </div>

              {/* Options A, B, C, D */}
              <div className="space-y-3 pt-2">
                {activeTakingQuiz.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIndex] === optIdx;

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-950 font-semibold shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <span className="text-sm">{opt}</span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Prev / Next question buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Câu trước</span>
                </button>

                <span className="text-xs text-slate-400">
                  Đã làm:{' '}
                  <strong className="text-slate-700">
                    {userAnswers.filter((a) => a !== -1).length}
                  </strong>{' '}
                  / {activeTakingQuiz.questions.length} câu
                </span>

                {currentQuestionIndex < activeTakingQuiz.questions.length - 1 ? (
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(activeTakingQuiz.questions.length - 1, prev + 1)
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Câu tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Nộp bài hoàn tất
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Cancel button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (confirm('Bạn có chắc muốn thoát bài kiểm tra? Bài làm sẽ không được lưu.')) {
                  setActiveTakingQuiz(null);
                  setQuizTimerActive(false);
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-800 underline"
            >
              Hủy và thoát bài thi
            </button>
          </div>
        </div>
      ) : (
        /* ================= NORMAL EXAMS VIEW ================= */
        <>
          {/* Title and Top Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Bài kiểm tra & Sổ điểm
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {userRole === 'teacher'
                  ? 'Quản lý đề thi trắc nghiệm, tự động chấm điểm và theo dõi phổ điểm'
                  : `Danh sách bài kiểm tra dành cho ${currentStudent?.name} (Lớp ${currentStudent?.classId})`}
              </p>
            </div>

            {userRole === 'teacher' && (
              <div className="flex items-center gap-2">
                {/* Switch between quizzes & gradebook */}
                <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setActiveTeacherTab('quizzes')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTeacherTab === 'quizzes'
                        ? 'bg-white text-blue-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Đề kiểm tra ({quizzes.length})
                  </button>
                  <button
                    onClick={() => setActiveTeacherTab('gradebook')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTeacherTab === 'gradebook'
                        ? 'bg-white text-blue-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sổ điểm ({quizResults.length})
                  </button>
                </div>

                <button
                  id="btn-create-quiz"
                  onClick={openCreateQuiz}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tạo bài kiểm tra</span>
                </button>
              </div>
            )}
          </div>

          {/* ================= TEACHER: GRADEBOOK TAB ================= */}
          {userRole === 'teacher' && activeTeacherTab === 'gradebook' && (
            <div className="space-y-4">
              {/* Filter bar for gradebook */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên học sinh, lớp hoặc bài thi..."
                    value={gradebookSearch}
                    onChange={(e) => setGradebookSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <select
                  value={gradebookFilterQuiz}
                  onChange={(e) => setGradebookFilterQuiz(e.target.value)}
                  className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả bài kiểm tra</option>
                  {quizzes.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.title}
                    </option>
                  ))}
                </select>

                <select
                  value={gradebookFilterClass}
                  onChange={(e) => setGradebookFilterClass(e.target.value)}
                  className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả lớp</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.name}>
                      Lớp {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gradebook Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Sổ theo dõi kết quả kiểm tra ({filteredGradebook.length} lượt nộp)
                  </div>
                </div>

                {filteredGradebook.length === 0 ? (
                  <div className="p-10 text-center text-slate-500">
                    Chưa có bài thi nào được nộp theo bộ lọc này.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          <th className="py-3 px-4">Học sinh</th>
                          <th className="py-3 px-4">Lớp</th>
                          <th className="py-3 px-4">Bài kiểm tra</th>
                          <th className="py-3 px-4">Điểm số</th>
                          <th className="py-3 px-4">Số câu đúng</th>
                          <th className="py-3 px-4">Thời gian nộp</th>
                          <th className="py-3 px-4 text-right">Xem chi tiết</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                        {filteredGradebook.map((res) => (
                          <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-slate-900">
                              {res.studentName}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700">
                                {res.classId}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">
                              {res.quizTitle}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                                  res.score >= 8
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : res.score >= 5
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {res.score} / 10
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">
                              {res.correctCount} / {res.totalCount} câu
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 text-xs">
                              {res.completedAt}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setReviewingResult(res)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                Xem bài
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= LIST OF QUIZZES ================= */}
          {(userRole === 'student' || activeTeacherTab === 'quizzes') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {quizzes.map((quiz) => {
                // For student: check if student has taken this quiz
                const studentResult = quizResults.find(
                  (r) => r.quizId === quiz.id && r.studentId === currentStudent?.id
                );

                // For teacher: count how many students finished
                const completedCount = quizResults.filter((r) => r.quizId === quiz.id).length;

                return (
                  <div
                    key={quiz.id}
                    id={`quiz-card-${quiz.id}`}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-200 hover:shadow-md transition-all p-5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-100 text-blue-800">
                          {quiz.subject}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          Khối {quiz.grade} • Lớp {quiz.classId}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                          {quiz.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {quiz.description || 'Bài kiểm tra trắc nghiệm chấm điểm tự động.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {quiz.timeLimitMinutes} phút
                        </span>
                        <span>{quiz.totalQuestions} câu hỏi trắc nghiệm</span>
                      </div>
                    </div>

                    {/* Bottom action bar */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      {userRole === 'student' ? (
                        studentResult ? (
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <span className="text-xs font-bold text-emerald-600">
                                Đã nộp: {studentResult.score}/10 điểm
                              </span>
                              <div className="text-[10px] text-slate-400">
                                {studentResult.correctCount}/{studentResult.totalCount} câu đúng
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setReviewingResult(studentResult)}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                              >
                                Xem bài
                              </button>
                              <button
                                onClick={() => handleStartQuiz(quiz)}
                                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold cursor-pointer"
                              >
                                Làm lại
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            id={`btn-start-quiz-${quiz.id}`}
                            onClick={() => handleStartQuiz(quiz)}
                            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Play className="w-4 h-4 fill-current" />
                            <span>Bắt đầu làm bài</span>
                          </button>
                        )
                      ) : (
                        /* Teacher controls */
                        <>
                          <div className="text-xs text-slate-500">
                            <strong className="text-slate-800">{completedCount}</strong> học sinh đã nộp
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setGradebookFilterQuiz(quiz.id);
                                setActiveTeacherTab('gradebook');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors cursor-pointer"
                              title="Xem sổ điểm"
                            >
                              Điểm số
                            </button>
                            <button
                              onClick={() => openEditQuiz(quiz)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                              title="Sửa đề thi"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteQuizId(quiz.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Xóa đề thi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ================= MODAL: REVIEW QUIZ RESULT ================= */}
      {reviewingResult && (
        <div
          id="modal-review-quiz-result"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 max-h-[88vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">
                  Kết quả bài kiểm tra trắc nghiệm
                </span>
                <h3 className="font-bold text-lg mt-0.5">{reviewingResult.quizTitle}</h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Học sinh: {reviewingResult.studentName} (Lớp {reviewingResult.classId}) • Nộp lúc:{' '}
                  {reviewingResult.completedAt}
                </p>
              </div>
              <button
                onClick={() => setReviewingResult(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Highlight Ribbon */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-around text-center">
              <div>
                <div className="text-2xl font-extrabold text-blue-600">
                  {reviewingResult.score} <span className="text-sm font-normal text-slate-400">/ 10</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Điểm số đạt được
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <div className="text-2xl font-extrabold text-emerald-600">
                  {reviewingResult.correctCount} / {reviewingResult.totalCount}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Số câu trả lời đúng
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <div className="text-2xl font-extrabold text-slate-700">
                  {Math.round(reviewingResult.timeSpentSeconds / 60)} phút
                </div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Thời gian làm bài
                </div>
              </div>
            </div>

            {/* Detailed questions and explanations */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Xem lại từng câu và giải thích chi tiết:
              </h4>

              {(() => {
                const targetQuiz = quizzes.find((q) => q.id === reviewingResult.quizId);
                if (!targetQuiz) {
                  return (
                    <p className="text-xs text-slate-500">
                      Không tìm thấy câu hỏi chi tiết của đề thi này.
                    </p>
                  );
                }

                return targetQuiz.questions.map((q, idx) => {
                  const studentAnswerIdx = reviewingResult.answers[idx];
                  const isCorrect = studentAnswerIdx === q.correctAnswerIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-rose-200 bg-rose-50/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-slate-800">
                          Câu {idx + 1}: {q.questionText}
                        </span>
                        {isCorrect ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Đúng
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 shrink-0 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Sai
                          </span>
                        )}
                      </div>

                      {/* Options */}
                      <div className="mt-3 space-y-1.5 text-xs">
                        {q.options.map((opt, optIdx) => {
                          const isStudentPick = studentAnswerIdx === optIdx;
                          const isRealCorrect = q.correctAnswerIndex === optIdx;

                          return (
                            <div
                              key={optIdx}
                              className={`p-2 rounded-lg flex items-center justify-between ${
                                isRealCorrect
                                  ? 'bg-emerald-100/80 font-bold text-emerald-900 border border-emerald-300'
                                  : isStudentPick
                                  ? 'bg-rose-100 font-semibold text-rose-900 border border-rose-300'
                                  : 'text-slate-600'
                              }`}
                            >
                              <span>{opt}</span>
                              {isRealCorrect && (
                                <span className="text-[10px] font-bold text-emerald-800">
                                  Đáp án đúng
                                </span>
                              )}
                              {isStudentPick && !isRealCorrect && (
                                <span className="text-[10px] font-bold text-rose-800">
                                  Em đã chọn
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="mt-3 p-3 bg-white/80 rounded-lg border border-slate-200/80 text-xs text-slate-700">
                          <span className="font-bold text-blue-700">Giải thích: </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setReviewingResult(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT QUIZ ================= */}
      {isCreateQuizOpen && (
        <div
          id="modal-create-quiz"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                {editingQuiz ? 'Chỉnh sửa đề kiểm tra' : 'Tạo bài kiểm tra trắc nghiệm mới'}
              </h3>
              <button
                onClick={() => setIsCreateQuizOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiêu đề bài kiểm tra *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Kiểm tra 15 phút: Cực trị & Đạo hàm..."
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Môn học</label>
                  <select
                    value={quizForm.subject}
                    onChange={(e) => setQuizForm({ ...quizForm, subject: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Toán học">Toán học</option>
                    <option value="Vật lý">Vật lý</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Ngữ văn">Ngữ văn</option>
                    <option value="Tin học">Tin học</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Khối</label>
                  <select
                    value={quizForm.grade}
                    onChange={(e) =>
                      setQuizForm({
                        ...quizForm,
                        grade: Number(e.target.value) as 10 | 11 | 12
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={10}>Khối 10</option>
                    <option value={11}>Khối 11</option>
                    <option value={12}>Khối 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lớp</label>
                  <select
                    value={quizForm.classId}
                    onChange={(e) => setQuizForm({ ...quizForm, classId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Tất cả">Tất cả các lớp</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        Lớp {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Thời gian (phút)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={quizForm.timeLimitMinutes}
                    onChange={(e) =>
                      setQuizForm({ ...quizForm, timeLimitMinutes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Questions list manager */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Danh sách câu hỏi trắc nghiệm ({quizForm.questions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newQ: QuizQuestion = {
                        id: 'q_' + Date.now(),
                        questionText: `Câu hỏi số ${quizForm.questions.length + 1}...`,
                        options: ['A. Phương án A', 'B. Phương án B', 'C. Phương án C', 'D. Phương án D'],
                        correctAnswerIndex: 0,
                        explanation: 'Lời giải chi tiết...'
                      };
                      setQuizForm({ ...quizForm, questions: [...quizForm.questions, newQ] });
                    }}
                    className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm câu hỏi</span>
                  </button>
                </div>

                {quizForm.questions.map((q, qIndex) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-blue-700">Câu {qIndex + 1}</span>
                      {quizForm.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setQuizForm({
                              ...quizForm,
                              questions: quizForm.questions.filter((_, i) => i !== qIndex)
                            });
                          }}
                          className="text-xs text-rose-600 hover:text-rose-800"
                        >
                          Xóa câu
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="Nội dung câu hỏi..."
                      value={q.questionText}
                      onChange={(e) => {
                        const updated = [...quizForm.questions];
                        updated[qIndex].questionText = e.target.value;
                        setQuizForm({ ...quizForm, questions: updated });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />

                    {/* 4 Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-1.5">
                          <input
                            type="radio"
                            name={`correct_${q.id}`}
                            checked={q.correctAnswerIndex === optIdx}
                            onChange={() => {
                              const updated = [...quizForm.questions];
                              updated[qIndex].correctAnswerIndex = optIdx;
                              setQuizForm({ ...quizForm, questions: updated });
                            }}
                            title="Đánh dấu đây là đáp án đúng"
                            className="cursor-pointer text-blue-600"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updated = [...quizForm.questions];
                              const newOpts = [...updated[qIndex].options];
                              newOpts[optIdx] = e.target.value;
                              updated[qIndex].options = newOpts;
                              setQuizForm({ ...quizForm, questions: updated });
                            }}
                            className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Lời giải thích đáp án..."
                      value={q.explanation}
                      onChange={(e) => {
                        const updated = [...quizForm.questions];
                        updated[qIndex].explanation = e.target.value;
                        setQuizForm({ ...quizForm, questions: updated });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-600 italic"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateQuizOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {editingQuiz ? 'Lưu thay đổi' : 'Tạo đề kiểm tra'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteQuizId !== null}
        title="Xác nhận xóa bài kiểm tra?"
        message="Hành động này sẽ xóa đề kiểm tra khỏi hệ thống trường THPT Duy Tân."
        onConfirm={() => {
          if (deleteQuizId) {
            deleteQuiz(deleteQuizId);
            setDeleteQuizId(null);
          }
        }}
        onCancel={() => setDeleteQuizId(null)}
      />
    </div>
  );
};
