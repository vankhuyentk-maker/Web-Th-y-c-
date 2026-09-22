import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Edit2,
  Trash2,
  Eye,
  X,
  Send,
  Users,
  AlertTriangle
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { ConfirmModal } from '../ConfirmModal';

export const TasksView: React.FC = () => {
  const {
    tasks,
    classes,
    students,
    addTask,
    updateTask,
    deleteTask,
    updateStudentTaskStatus,
    userRole,
    currentStudent
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  // Modals
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  // Student submission note modal
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    subject: 'Toán học',
    classId: '11/1',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'Trung bình' as TaskPriority,
    status: 'Đang làm' as TaskStatus
  });

  // Subjects list
  const subjects = ['Toán học', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Anh', 'Tin học', 'Sinh học', 'Lịch sử'];

  // Open add task modal
  const openAddTask = () => {
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      subject: 'Toán học',
      classId: classes[0]?.name || '11/1',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'Trung bình',
      status: 'Đang làm'
    });
    setIsCreateTaskOpen(true);
  };

  const openEditTask = (t: Task) => {
    setEditingTask(t);
    setTaskForm({
      title: t.title,
      description: t.description,
      subject: t.subject,
      classId: t.classId,
      dueDate: t.dueDate,
      priority: t.priority,
      status: t.status
    });
    setIsCreateTaskOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    if (editingTask) {
      updateTask({
        ...editingTask,
        ...taskForm
      });
    } else {
      addTask(taskForm);
    }
    setIsCreateTaskOpen(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    // If student role, only show tasks relevant to student's class
    if (userRole === 'student') {
      const isRelevant = t.classId === 'Tất cả' || t.classId === currentStudent?.classId;
      if (!isRelevant) return false;
    } else {
      if (selectedClass !== 'all' && t.classId !== selectedClass && t.classId !== 'Tất cả') {
        return false;
      }
    }

    if (subjectFilter !== 'all' && t.subject !== subjectFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (userRole === 'student' && currentStudent) {
        const sub = t.submissions.find((s) => s.studentId === currentStudent.id);
        const myStatus = sub?.status || 'Chưa làm';
        if (myStatus !== statusFilter) return false;
      } else {
        if (t.status !== statusFilter) return false;
      }
    }

    // Search filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Đã hoàn thành':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Đang làm':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Chưa làm':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Quá hạn':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'Cao':
        return 'text-rose-600 bg-rose-50';
      case 'Trung bình':
        return 'text-amber-600 bg-amber-50';
      case 'Thấp':
        return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div id="tasks-view-container" className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Nhiệm vụ học tập & Bài tập
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {userRole === 'teacher'
              ? 'Giao bài tập, theo dõi tiến độ nộp bài của các lớp học'
              : `Danh sách nhiệm vụ dành cho ${currentStudent?.name} (Lớp ${currentStudent?.classId})`}
          </p>
        </div>

        {userRole === 'teacher' && (
          <button
            id="btn-open-create-task"
            onClick={openAddTask}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Giao nhiệm vụ mới</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-tasks"
            type="text"
            placeholder="Tìm theo tiêu đề, môn học hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Filter Class (teacher only) */}
        {userRole === 'teacher' && (
          <select
            id="select-filter-task-class"
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
        )}

        {/* Filter Subject */}
        <select
          id="select-filter-task-subject"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả môn học</option>
          {subjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        {/* Filter Status */}
        <select
          id="select-filter-task-status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Chưa làm">Chưa làm</option>
          <option value="Đang làm">Đang làm</option>
          <option value="Đã hoàn thành">Đã hoàn thành</option>
          <option value="Quá hạn">Quá hạn</option>
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <CheckSquare className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-base font-semibold text-slate-700">Không tìm thấy nhiệm vụ nào.</p>
            <p className="text-xs text-slate-400 mt-1">
              Thử chỉnh lại bộ lọc tìm kiếm hoặc tạo một nhiệm vụ mới.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            // For student: find my submission
            const mySubmission = currentStudent
              ? task.submissions.find((s) => s.studentId === currentStudent.id)
              : undefined;
            const studentStatus: TaskStatus = mySubmission?.status || 'Chưa làm';

            // For teacher: calculate stats
            const totalSub = task.submissions.length;
            const completedSub = task.submissions.filter(
              (s) => s.status === 'Đã hoàn thành'
            ).length;
            const percent = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0;

            return (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Content */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-100 text-blue-800">
                        {task.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                        Áp dụng: Lớp {task.classId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-semibold ${getPriorityBadge(
                          task.priority
                        )}`}
                      >
                        Ưu tiên: {task.priority}
                      </span>

                      {/* Display Status */}
                      {userRole === 'student' ? (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(
                            studentStatus
                          )}`}
                        >
                          Trạng thái của em: {studentStatus}
                        </span>
                      ) : (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {task.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {task.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Hạn nộp: <strong className="text-slate-700">{task.dueDate}</strong>
                      </span>
                      <span>Ngày giao: {task.createdAt}</span>
                    </div>

                    {/* Student's submission note if exists */}
                    {userRole === 'student' && mySubmission?.note && (
                      <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900 mt-2">
                        <span className="font-semibold">Ghi chú nộp bài của em: </span>
                        {mySubmission.note}
                        {mySubmission.submittedAt && (
                          <span className="text-emerald-700 block text-[10px] mt-0.5">
                            (Nộp lúc: {mySubmission.submittedAt})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="shrink-0 flex flex-col sm:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {/* Teacher view: Stats and actions */}
                    {userRole === 'teacher' ? (
                      <>
                        <div className="text-left sm:text-right">
                          <div className="text-xs font-bold text-slate-800">
                            {completedSub} / {totalSub} học sinh đã nộp
                          </div>
                          <div className="w-32 bg-slate-100 rounded-full h-2 mt-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">{percent}% hoàn thành</div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            id={`btn-view-task-${task.id}`}
                            onClick={() => setViewingTask(task)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Xem danh sách nộp bài"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>Chi tiết nộp</span>
                          </button>
                          <button
                            id={`btn-edit-task-${task.id}`}
                            onClick={() => openEditTask(task)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                            title="Sửa nhiệm vụ"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-delete-task-${task.id}`}
                            onClick={() => setDeleteTaskId(task.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Xóa nhiệm vụ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      /* Student view: status update buttons */
                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        {studentStatus === 'Đã hoàn thành' ? (
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Em đã nộp bài</span>
                            </span>
                            <button
                              onClick={() => {
                                if (currentStudent) {
                                  updateStudentTaskStatus(task.id, currentStudent.id, 'Đang làm');
                                }
                              }}
                              className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                            >
                              Làm lại
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2">
                            {studentStatus === 'Chưa làm' && (
                              <button
                                onClick={() => {
                                  if (currentStudent) {
                                    updateStudentTaskStatus(task.id, currentStudent.id, 'Đang làm');
                                  }
                                }}
                                className="px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors cursor-pointer"
                              >
                                Đánh dấu Đang làm
                              </button>
                            )}

                            <button
                              id={`btn-submit-task-${task.id}`}
                              onClick={() => {
                                setSubmittingTaskId(task.id);
                                setSubmissionNote(mySubmission?.note || '');
                              }}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Đánh dấu Hoàn thành</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= MODAL: CREATE / EDIT TASK ================= */}
      {isCreateTaskOpen && (
        <div
          id="modal-create-task"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                {editingTask ? 'Chỉnh sửa nhiệm vụ học tập' : 'Giao nhiệm vụ học tập mới'}
              </h3>
              <button
                onClick={() => setIsCreateTaskOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiêu đề nhiệm vụ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Ôn tập chuyên đề Khảo sát hàm số..."
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Môn học *</label>
                  <select
                    value={taskForm.subject}
                    onChange={(e) => setTaskForm({ ...taskForm, subject: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {subjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lớp áp dụng *
                  </label>
                  <select
                    value={taskForm.classId}
                    onChange={(e) => setTaskForm({ ...taskForm, classId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Tất cả">Tất cả các lớp</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        Lớp {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hạn nộp *
                  </label>
                  <input
                    type="date"
                    required
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mức độ ưu tiên
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, priority: e.target.value as TaskPriority })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Cao">Cao</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Thấp">Thấp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô tả chi tiết và yêu cầu bài tập
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ghi rõ số lượng câu hỏi, trang sách bài tập, lưu ý trình bày..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateTaskOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {editingTask ? 'Lưu thay đổi' : 'Giao nhiệm vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: STUDENT SUBMISSION NOTE ================= */}
      {submittingTaskId && currentStudent && (
        <div
          id="modal-submit-task"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">Xác nhận hoàn thành bài tập</h3>
              </div>
              <button
                onClick={() => setSubmittingTaskId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Em đang đánh dấu hoàn thành nhiệm vụ này cho Thầy Nguyễn Văn Khuyên. Em có thể để lại
              ghi chú hoặc phản hồi dưới đây:
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ghi chú nộp bài (tùy chọn)
              </label>
              <textarea
                rows={3}
                placeholder="VD: Em đã làm xong 25 câu trắc nghiệm và nộp vở bài tập cho lớp trưởng..."
                value={submissionNote}
                onChange={(e) => setSubmissionNote(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSubmittingTaskId(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  updateStudentTaskStatus(
                    submittingTaskId,
                    currentStudent.id,
                    'Đã hoàn thành',
                    submissionNote
                  );
                  setSubmittingTaskId(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Nộp bài & Hoàn thành</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: TEACHER VIEW SUBMISSION DETAILS ================= */}
      {viewingTask && (
        <div
          id="modal-view-submissions"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Tiến độ nộp bài: {viewingTask.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Môn {viewingTask.subject} • Áp dụng: Lớp {viewingTask.classId} • Hạn nộp:{' '}
                  {viewingTask.dueDate}
                </p>
              </div>
              <button
                onClick={() => setViewingTask(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                {viewingTask.submissions.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">
                    Chưa có học sinh nào được gán nhiệm vụ này.
                  </p>
                ) : (
                  viewingTask.submissions.map((sub) => (
                    <div
                      key={sub.studentId}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                          {sub.studentName}
                        </div>
                        {sub.note && (
                          <div className="text-xs text-slate-600 mt-0.5 italic">
                            &quot;{sub.note}&quot;
                          </div>
                        )}
                        {sub.submittedAt && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Thời gian nộp: {sub.submittedAt}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(
                            sub.status
                          )}`}
                        >
                          {sub.status}
                        </span>

                        {/* Teacher quick toggle */}
                        <button
                          onClick={() => {
                            const nextStatus: TaskStatus =
                              sub.status === 'Đã hoàn thành' ? 'Chưa làm' : 'Đã hoàn thành';
                            updateStudentTaskStatus(
                              viewingTask.id,
                              sub.studentId,
                              nextStatus,
                              sub.note
                            );
                            // Update local modal state
                            setViewingTask((prev) => {
                              if (!prev) return null;
                              return {
                                ...prev,
                                submissions: prev.submissions.map((s) =>
                                  s.studentId === sub.studentId ? { ...s, status: nextStatus } : s
                                )
                              };
                            });
                          }}
                          className="text-[11px] text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 cursor-pointer"
                        >
                          Đổi
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingTask(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTaskId !== null}
        title="Xác nhận xóa nhiệm vụ học tập?"
        message="Hành động này sẽ xóa vĩnh viễn nhiệm vụ cùng các bài nộp của học sinh. Bạn có chắc chắn không?"
        onConfirm={() => {
          if (deleteTaskId) {
            deleteTask(deleteTaskId);
            setDeleteTaskId(null);
          }
        }}
        onCancel={() => setDeleteTaskId(null)}
      />
    </div>
  );
};
