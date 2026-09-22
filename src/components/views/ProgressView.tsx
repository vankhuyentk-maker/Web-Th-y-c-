import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Users,
  Search,
  Filter,
  BarChart2,
  Sparkles,
  ChevronRight,
  BookOpen,
  Calendar,
  X
} from 'lucide-react';
import { Student, AcademicStatus } from '../../types';

export const ProgressView: React.FC = () => {
  const {
    userRole,
    classes,
    students,
    tasks,
    quizzes,
    quizResults,
    currentStudent,
    updateStudent,
    teacherName
  } = useApp();

  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Comment modal for teacher
  const [commentStudent, setCommentStudent] = useState<Student | null>(null);
  const [newNote, setNewNote] = useState('');
  const [newStatus, setNewStatus] = useState<AcademicStatus>('Giỏi');

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchClass = selectedClass === 'all' || s.classId === selectedClass;
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchClass && matchSearch;
  });

  // Calculate student statistics
  const getStudentStats = (studentId: string, classId: string) => {
    // Tasks stats
    const relevantTasks = tasks.filter(
      (t) => t.classId === 'Tất cả' || t.classId === classId
    );
    let completedTasks = 0;
    relevantTasks.forEach((t) => {
      const sub = t.submissions.find((s) => s.studentId === studentId);
      if (sub && sub.status === 'Đã hoàn thành') {
        completedTasks++;
      }
    });

    // Quiz stats
    const myResults = quizResults.filter((r) => r.studentId === studentId);
    const avgScore =
      myResults.length > 0
        ? (
            myResults.reduce((sum, r) => sum + r.score, 0) / myResults.length
          ).toFixed(1)
        : 'Chưa thi';

    const completionRate =
      relevantTasks.length > 0
        ? Math.round((completedTasks / relevantTasks.length) * 100)
        : 100;

    return {
      totalTasks: relevantTasks.length,
      completedTasks,
      completionRate,
      quizCount: myResults.length,
      avgScore
    };
  };

  // Overall class statistics (for Teacher)
  const totalStudents = students.length;
  const countExcellent = students.filter((s) => s.academicStatus === 'Xuất sắc').length;
  const countGood = students.filter((s) => s.academicStatus === 'Giỏi').length;
  const countFair = students.filter((s) => s.academicStatus === 'Khá').length;
  const countNeedsWork = students.filter((s) => s.academicStatus === 'Cần cố gắng').length;

  const percentExcellent = totalStudents > 0 ? Math.round((countExcellent / totalStudents) * 100) : 0;
  const percentGood = totalStudents > 0 ? Math.round((countGood / totalStudents) * 100) : 0;
  const percentFair = totalStudents > 0 ? Math.round((countFair / totalStudents) * 100) : 0;
  const percentNeedsWork = totalStudents > 0 ? Math.round((countNeedsWork / totalStudents) * 100) : 0;

  const handleOpenComment = (std: Student) => {
    setCommentStudent(std);
    setNewNote(std.notes || '');
    setNewStatus(std.academicStatus);
  };

  const handleSaveComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentStudent) return;

    updateStudent({
      ...commentStudent,
      notes: newNote,
      academicStatus: newStatus
    });
    setCommentStudent(null);
  };

  return (
    <div id="progress-view-container" className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Đánh giá & Theo dõi tiến độ học tập
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {userRole === 'teacher'
            ? 'Tổng hợp phổ điểm, năng lực học sinh và ghi nhận phản hồi định kỳ'
            : `Hồ sơ tiến độ học tập cá nhân của ${currentStudent?.name} - Lớp ${currentStudent?.classId}`}
        </p>
      </div>

      {/* ================= STUDENT PERSONAL PROGRESS CARD ================= */}
      {userRole === 'student' && currentStudent && (
        <div className="space-y-6">
          {(() => {
            const stats = getStudentStats(currentStudent.id, currentStudent.classId);

            return (
              <>
                {/* Hero Summary Badge */}
                <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
                        Học kỳ 1 • Năm học 2025 - 2026
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                        Chào em, {currentStudent.name}!
                      </h3>
                      <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
                        Em đang hoàn thành rất tốt kế hoạch học tập tại THPT Duy Tân. Hãy tiếp tục
                        duy trì tinh thần chủ động ôn luyện nhé!
                      </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                      <div className="text-center">
                        <div className="text-2xl font-extrabold">{stats.completionRate}%</div>
                        <div className="text-[11px] text-blue-200">Hoàn thành bài tập</div>
                      </div>
                      <div className="w-px h-8 bg-white/20" />
                      <div className="text-center">
                        <div className="text-2xl font-extrabold">{stats.avgScore}</div>
                        <div className="text-[11px] text-blue-200">Điểm kiểm tra TB</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Details Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Task completion */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Nhiệm vụ học tập
                      </span>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">
                      {stats.completedTasks}{' '}
                      <span className="text-sm font-normal text-slate-400">
                        / {stats.totalTasks} nhiệm vụ
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-500">
                      Đã hoàn thành {stats.completionRate}% bài tập được giao.
                    </div>
                  </div>

                  {/* Quizzes Taken */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Bài kiểm tra
                      </span>
                      <Award className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">
                      {stats.quizCount}{' '}
                      <span className="text-sm font-normal text-slate-400">
                        / {quizzes.length} đề thi
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{
                          width: `${quizzes.length > 0 ? (stats.quizCount / quizzes.length) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <div className="text-xs text-slate-500">
                      Điểm trung bình các bài thi: <strong>{stats.avgScore} / 10</strong>
                    </div>
                  </div>

                  {/* Academic Status */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Xếp loại hiện tại
                      </span>
                      <Sparkles className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-purple-700">
                      {currentStudent.academicStatus}
                    </div>
                    <div className="text-xs text-slate-500 pt-3">
                      Đánh giá theo năng lực học tập và thái độ chuyên cần.
                    </div>
                  </div>
                </div>

                {/* Teacher's Feedback */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>Lời nhận xét từ Thầy {teacherName}:</span>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-slate-800 text-sm italic leading-relaxed">
                    {currentStudent.notes
                      ? `"${currentStudent.notes}"`
                      : '"Em tham gia học tập tích cực, tiếp thu kiến thức tốt và luôn nộp bài đúng hạn. Hãy giữ vững phong độ!"'}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* ================= TEACHER OVERVIEW & STUDENT LIST ================= */}
      {userRole === 'teacher' && (
        <div className="space-y-6">
          {/* Top 4 Stats Ratio Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="text-xs font-semibold text-purple-700">Học lực Xuất sắc</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{countExcellent}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{percentExcellent}% tổng số HS</div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div
                  className="bg-purple-600 h-full rounded-full"
                  style={{ width: `${percentExcellent}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="text-xs font-semibold text-emerald-700">Học lực Giỏi</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{countGood}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{percentGood}% tổng số HS</div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${percentGood}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="text-xs font-semibold text-blue-700">Học lực Khá</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{countFair}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{percentFair}% tổng số HS</div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${percentFair}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="text-xs font-semibold text-amber-700">Cần cố gắng</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{countNeedsWork}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{percentNeedsWork}% tổng số HS</div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${percentNeedsWork}%` }}
                />
              </div>
            </div>
          </div>

          {/* Filter & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm học sinh theo tên, mã HS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả các lớp</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  Lớp {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Detailed Student Progress Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Bảng theo dõi tiến độ chi tiết ({filteredStudents.length} học sinh)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Học sinh & Lớp</th>
                    <th className="py-3 px-4">Xếp loại</th>
                    <th className="py-3 px-4">Tỷ lệ bài tập</th>
                    <th className="py-3 px-4">Điểm thi TB</th>
                    <th className="py-3 px-4">Nhận xét của Giáo viên</th>
                    <th className="py-3 px-4 text-right">Đánh giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredStudents.map((std) => {
                    const stats = getStudentStats(std.id, std.classId);

                    return (
                      <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{std.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {std.code} • Lớp {std.classId}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              std.academicStatus === 'Xuất sắc'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : std.academicStatus === 'Giỏi'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : std.academicStatus === 'Khá'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {std.academicStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{stats.completionRate}%</span>
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${stats.completionRate}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {stats.completedTasks}/{stats.totalTasks} bài
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-blue-700 text-xs">
                            {stats.avgScore} / 10
                          </span>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          {std.notes ? (
                            <div className="text-xs text-slate-600 truncate italic">
                              &quot;{std.notes}&quot;
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Chưa có nhận xét</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            id={`btn-comment-student-${std.id}`}
                            onClick={() => handleOpenComment(std)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Nhận xét</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: TEACHER COMMENT / EVALUATION ================= */}
      {commentStudent && (
        <div
          id="modal-comment-student"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Đánh giá học sinh</h3>
                <p className="text-xs text-slate-500">
                  {commentStudent.name} • {commentStudent.code} • Lớp {commentStudent.classId}
                </p>
              </div>
              <button
                onClick={() => setCommentStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveComment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Xếp loại năng lực học tập
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AcademicStatus)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Xuất sắc">Xuất sắc</option>
                  <option value="Giỏi">Giỏi</option>
                  <option value="Khá">Khá</option>
                  <option value="Cần cố gắng">Cần cố gắng</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nhận xét & Lời khuyên của Thầy {teacherName}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ghi nhận sự tiến bộ, điểm cần khắc phục hoặc hướng dẫn tự học thêm..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCommentStudent(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Lưu nhận xét
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
