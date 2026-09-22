import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckSquare,
  BookOpen,
  FileCheck2,
  TrendingUp,
  School,
  Clock,
  ArrowRight,
  PlusCircle,
  Award,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    userRole,
    teacherName,
    schoolName,
    currentStudent,
    classes,
    students,
    tasks,
    documents,
    quizzes,
    quizResults,
    setActiveTab
  } = useApp();

  // Metrics for Teacher
  const totalClasses = classes.length;
  const totalStudents = students.length;
  const totalTasks = tasks.length;

  // Calculate completion rate across all task submissions
  let totalSubmissions = 0;
  let completedSubmissions = 0;
  tasks.forEach((t) => {
    t.submissions.forEach((s) => {
      totalSubmissions++;
      if (s.status === 'Đã hoàn thành') {
        completedSubmissions++;
      }
    });
  });
  const overallTaskCompletionPercent =
    totalSubmissions > 0 ? Math.round((completedSubmissions / totalSubmissions) * 100) : 0;

  // Average quiz score across results
  const avgQuizScore =
    quizResults.length > 0
      ? (quizResults.reduce((acc, r) => acc + r.score, 0) / quizResults.length).toFixed(1)
      : '0.0';

  // Metrics for Student
  const studentTasks = tasks.filter(
    (t) => t.classId === 'Tất cả' || t.classId === currentStudent?.classId
  );
  const studentCompletedTasks = studentTasks.filter((t) => {
    const sub = t.submissions.find((s) => s.studentId === currentStudent?.id);
    return sub?.status === 'Đã hoàn thành';
  });
  const studentPendingTasks = studentTasks.filter((t) => {
    const sub = t.submissions.find((s) => s.studentId === currentStudent?.id);
    return !sub || sub.status !== 'Đã hoàn thành';
  });

  const studentResults = quizResults.filter((r) => r.studentId === currentStudent?.id);
  const studentAvgScore =
    studentResults.length > 0
      ? (studentResults.reduce((acc, r) => acc + r.score, 0) / studentResults.length).toFixed(1)
      : 'Chưa có';

  const pendingQuizzes = quizzes.filter(
    (q) =>
      (q.classId === 'Tất cả' || q.classId === currentStudent?.classId) &&
      !studentResults.some((r) => r.quizId === q.id)
  );

  return (
    <div id="dashboard-view-container" className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold text-blue-100 mb-3">
              <School className="w-3.5 h-3.5 text-blue-200" />
              <span>{schoolName} • Năm học 2025 - 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {userRole === 'teacher' ? (
                <>Chào mừng, {teacherName}!</>
              ) : (
                <>Chào em, {currentStudent?.name}!</>
              )}
            </h1>
            <p className="text-blue-100 text-sm sm:text-base mt-2 leading-relaxed">
              {userRole === 'teacher'
                ? 'Hệ thống đã sẵn sàng hỗ trợ thầy quản lý học sinh, giao nhiệm vụ, cung cấp học liệu và đánh giá chất lượng dạy học.'
                : `Học sinh lớp ${currentStudent?.classId} - Mã số: ${currentStudent?.code}. Chúc em có một ngày học tập tập trung và hiệu quả!`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {userRole === 'teacher' ? (
              <>
                <button
                  id="btn-dash-create-task"
                  onClick={() => setActiveTab('tasks')}
                  className="px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-blue-600" />
                  <span>Giao nhiệm vụ</span>
                </button>
                <button
                  id="btn-dash-create-quiz"
                  onClick={() => setActiveTab('exams')}
                  className="px-4 py-2.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-semibold text-sm transition-all border border-blue-400/30 cursor-pointer flex items-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Tạo bài kiểm tra</span>
                </button>
              </>
            ) : (
              <button
                id="btn-dash-take-quiz"
                onClick={() => setActiveTab('exams')}
                className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Vào làm bài kiểm tra</span>
              </button>
            )}
          </div>
        </div>

        {/* Subtle background circle decoration */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* ================= TEACHER DASHBOARD CONTENT ================= */}
      {userRole === 'teacher' && (
        <>
          {/* 4 Overview Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Stat 1: Classes */}
            <div
              onClick={() => setActiveTab('classes')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <School className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Xem <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-extrabold text-slate-900">{totalClasses}</div>
                <div className="text-xs font-medium text-slate-500 mt-1">Lớp học phụ trách</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Khối 10, 11 và 12</div>
              </div>
            </div>

            {/* Stat 2: Students */}
            <div
              onClick={() => setActiveTab('classes')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Xem <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-extrabold text-slate-900">{totalStudents}</div>
                <div className="text-xs font-medium text-slate-500 mt-1">Tổng số học sinh</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">100% hồ sơ học tập</div>
              </div>
            </div>

            {/* Stat 3: Tasks completion */}
            <div
              onClick={() => setActiveTab('tasks')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-amber-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  {overallTaskCompletionPercent}% <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-extrabold text-slate-900">{totalTasks}</div>
                <div className="text-xs font-medium text-slate-500 mt-1">Nhiệm vụ đã giao</div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${overallTaskCompletionPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stat 4: Quiz & Avg Score */}
            <div
              onClick={() => setActiveTab('exams')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  {avgQuizScore}/10 <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-extrabold text-slate-900">{quizzes.length} đề</div>
                <div className="text-xs font-medium text-slate-500 mt-1">Bài kiểm tra trắc nghiệm</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{quizResults.length} lượt bài nộp</div>
              </div>
            </div>
          </div>

          {/* Visual Charts & Progress Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Tỷ lệ hoàn thành nhiệm vụ theo từng lớp (2 cols) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Tỷ lệ hoàn thành nhiệm vụ theo lớp
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thống kê tỷ lệ nộp bài tập và chuyên đề học tập tuần qua
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Xem chi tiết
                </button>
              </div>

              {/* Progress bars per class */}
              <div className="space-y-4">
                {classes.map((cls) => {
                  const classStudents = students.filter((s) => s.classId === cls.name);
                  const classTasks = tasks.filter(
                    (t) => t.classId === 'Tất cả' || t.classId === cls.name
                  );
                  let cTotal = 0;
                  let cDone = 0;

                  classTasks.forEach((t) => {
                    t.submissions.forEach((sub) => {
                      if (classStudents.some((cs) => cs.id === sub.studentId)) {
                        cTotal++;
                        if (sub.status === 'Đã hoàn thành') cDone++;
                      }
                    });
                  });

                  const percent = cTotal > 0 ? Math.round((cDone / cTotal) * 100) : 75;

                  return (
                    <div key={cls.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">Lớp {cls.name}</span>
                          <span className="text-slate-400">({classStudents.length} học sinh)</span>
                        </div>
                        <span className="font-bold text-slate-700">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent >= 80
                              ? 'bg-emerald-500'
                              : percent >= 60
                              ? 'bg-blue-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Weekly summary note */}
              <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Nhận xét của giáo viên Nguyễn Văn Khuyên: </span>
                  Lớp 11/1 và 11/4 có tinh thần tự giác cao, tỷ lệ nộp bài tập toán đạt trên 80%.
                  Cần nhắc nhở một số học sinh lớp 11/1 nộp bài nghị luận trước hạn 25/09.
                </div>
              </div>
            </div>

            {/* Chart 2: Phổ điểm & Xếp loại học tập (1 col) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Phổ điểm bài kiểm tra</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Thống kê kết quả {quizResults.length} lượt thi
                </p>

                {/* Score breakdown metrics */}
                <div className="mt-5 space-y-3">
                  {/* Xuất sắc (9 - 10) */}
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      <span className="font-medium text-emerald-900">Điểm Xuất sắc (9 - 10)</span>
                    </div>
                    <span className="font-bold text-emerald-700">
                      {quizResults.filter((r) => r.score >= 9).length} bài
                    </span>
                  </div>

                  {/* Khá - Giỏi (7 - 8.9) */}
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      <span className="font-medium text-blue-900">Điểm Khá - Giỏi (7.0 - 8.9)</span>
                    </div>
                    <span className="font-bold text-blue-700">
                      {quizResults.filter((r) => r.score >= 7 && r.score < 9).length} bài
                    </span>
                  </div>

                  {/* Trung bình (5 - 6.9) */}
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                      <span className="font-medium text-amber-900">Trung bình (5.0 - 6.9)</span>
                    </div>
                    <span className="font-bold text-amber-700">
                      {quizResults.filter((r) => r.score >= 5 && r.score < 7).length} bài
                    </span>
                  </div>

                  {/* Dưới 5 */}
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                      <span className="font-medium text-rose-900">Cần cố gắng (&lt; 5.0)</span>
                    </div>
                    <span className="font-bold text-rose-700">
                      {quizResults.filter((r) => r.score < 5).length} bài
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Điểm trung bình toàn khối:</span>
                <span className="text-base font-extrabold text-blue-600">{avgQuizScore} / 10</span>
              </div>
            </div>
          </div>

          {/* Recent Tasks List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Nhiệm vụ học tập gần đây</h3>
                <p className="text-xs text-slate-500 mt-0.5">Theo dõi hạn nộp và tiến độ học sinh</p>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
              >
                Tất cả nhiệm vụ <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {tasks.slice(0, 3).map((task) => {
                const totalSub = task.submissions.length;
                const completedSub = task.submissions.filter(
                  (s) => s.status === 'Đã hoàn thành'
                ).length;

                return (
                  <div
                    key={task.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-700">
                          {task.subject}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Lớp {task.classId}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            task.status === 'Đã hoàn thành'
                              ? 'bg-emerald-100 text-emerald-800'
                              : task.status === 'Quá hạn'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 mt-1 truncate">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Hạn nộp: {task.dueDate}
                        </span>
                        <span>Độ ưu tiên: {task.priority}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-800">
                          {completedSub}/{totalSub} hoàn thành
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0}% nộp bài
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('tasks')}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Quản lý
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ================= STUDENT DASHBOARD CONTENT ================= */}
      {userRole === 'student' && (
        <>
          {/* 3 Student KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {/* KPI 1: Completed Tasks */}
            <div
              onClick={() => setActiveTab('tasks')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Xem <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-extrabold text-slate-900">
                  {studentCompletedTasks.length} / {studentTasks.length}
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1">Nhiệm vụ đã hoàn thành</div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        studentTasks.length > 0
                          ? Math.round(
                              (studentCompletedTasks.length / studentTasks.length) * 100
                            )
                          : 0
                      }%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* KPI 2: Pending Quizzes */}
            <div
              onClick={() => setActiveTab('exams')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-amber-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Làm ngay <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-extrabold text-slate-900">
                  {pendingQuizzes.length} đề
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1">Bài kiểm tra chờ làm</div>
                <div className="text-[11px] text-amber-600 font-medium mt-0.5">
                  {pendingQuizzes.length > 0 ? 'Cần làm trước khi hết hạn' : 'Đã hoàn tất tất cả đề!'}
                </div>
              </div>
            </div>

            {/* KPI 3: GPA score */}
            <div
              onClick={() => setActiveTab('progress')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Tiến độ <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-extrabold text-slate-900">
                  {studentAvgScore} <span className="text-sm font-normal text-slate-400">/ 10</span>
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1">Điểm trung bình kiểm tra</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                  Xếp loại: {currentStudent?.academicStatus || 'Khá'}
                </div>
              </div>
            </div>
          </div>

          {/* 2-column: Tasks to do & Quizzes ready */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Tasks */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Nhiệm vụ cần hoàn thành</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Bài tập giáo viên giao cho lớp em</p>
                </div>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Xem tất cả
                </button>
              </div>

              {studentPendingTasks.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800">Tuyệt vời!</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Em đã hoàn thành tất cả nhiệm vụ học tập được giao.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studentPendingTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors bg-white flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                            {task.subject}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Hạn nộp: {task.dueDate}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 mt-1.5 truncate">
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {task.description}
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveTab('tasks')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition-colors shrink-0 cursor-pointer"
                      >
                        Nộp bài
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quizzes ready */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Bài kiểm tra đang mở</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Thi trắc nghiệm và chấm điểm ngay</p>
                </div>
                <button
                  onClick={() => setActiveTab('exams')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Vào thi
                </button>
              </div>

              <div className="space-y-3">
                {quizzes.slice(0, 2).map((quiz) => {
                  const hasDone = studentResults.some((r) => r.quizId === quiz.id);
                  const result = studentResults.find((r) => r.quizId === quiz.id);

                  return (
                    <div
                      key={quiz.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                            {quiz.subject}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {quiz.timeLimitMinutes} phút • {quiz.totalQuestions} câu
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 mt-1 truncate">
                          {quiz.title}
                        </h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {hasDone ? (
                            <span className="text-emerald-600 font-bold">
                              Đã nộp bài: {result?.score}/10 điểm
                            </span>
                          ) : (
                            <span className="text-amber-600 font-medium">Chưa làm</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('exams')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                          hasDone
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {hasDone ? 'Xem kết quả' : 'Làm bài'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
