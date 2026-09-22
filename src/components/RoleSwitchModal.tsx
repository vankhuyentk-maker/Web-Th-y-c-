import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, UserCheck, School, Check, X, Search, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface RoleSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitchModal: React.FC<RoleSwitchModalProps> = ({ isOpen, onClose }) => {
  const {
    userRole,
    setUserRole,
    currentStudentId,
    setCurrentStudentId,
    students,
    teacherName,
    schoolName,
    setActiveTab
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole);
  const [selectedStudent, setSelectedStudent] = useState<string>(currentStudentId);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handleApply = () => {
    setUserRole(selectedRole);
    if (selectedRole === 'student') {
      setCurrentStudentId(selectedStudent);
    }
    setActiveTab('dashboard');
    onClose();
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.classId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      id="role-switch-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="role-switch-modal-content"
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <School className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Chuyển đổi vai trò trải nghiệm</h3>
                <p className="text-blue-100 text-xs mt-0.5">{schoolName} • Năm học 2025 - 2026</p>
              </div>
            </div>
            <button
              id="btn-close-role-modal"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-200 bg-white/10 px-3 py-1.5 rounded-lg w-fit">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Mô phỏng đăng nhập nhanh - Không cần nhập mật khẩu</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-3">
            {/* Teacher option */}
            <div
              id="role-option-teacher"
              onClick={() => setSelectedRole('teacher')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedRole === 'teacher'
                  ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                {selectedRole === 'teacher' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h4 className="font-bold text-slate-900 text-base">Giáo viên</h4>
                <p className="text-xs text-slate-600 mt-0.5">{teacherName}</p>
                <div className="mt-2 text-[11px] text-slate-500 font-medium leading-relaxed">
                  Quyền quản trị lớp học, tạo nhiệm vụ, tải học liệu, tạo đề kiểm tra & thống kê.
                </div>
              </div>
            </div>

            {/* Student option */}
            <div
              id="role-option-student"
              onClick={() => setSelectedRole('student')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedRole === 'student'
                  ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                {selectedRole === 'student' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h4 className="font-bold text-slate-900 text-base">Học sinh</h4>
                <p className="text-xs text-slate-600 mt-0.5">Góc học tập cá nhân</p>
                <div className="mt-2 text-[11px] text-slate-500 font-medium leading-relaxed">
                  Xem nhiệm vụ, nộp bài, đọc học liệu số, làm bài kiểm tra trực tuyến & xem điểm.
                </div>
              </div>
            </div>
          </div>

          {/* Student picker if student role chosen */}
          {selectedRole === 'student' && (
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Chọn học sinh mẫu để trải nghiệm:
              </label>

              {/* Search in student list */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên học sinh, lớp hoặc mã số..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-0.5">
                {filteredStudents.map((std) => (
                  <div
                    key={std.id}
                    onClick={() => setSelectedStudent(std.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer text-left transition-all flex items-center justify-between ${
                      selectedStudent === std.id
                        ? 'border-blue-600 bg-blue-50/80 font-semibold text-blue-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-medium">{std.name}</div>
                      <div className="text-[11px] text-slate-500">
                        Lớp {std.classId} • {std.code}
                      </div>
                    </div>
                    {selectedStudent === std.id && (
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            id="btn-cancel-role-switch"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/60 text-sm font-medium transition-colors cursor-pointer"
          >
            Đóng
          </button>
          <button
            id="btn-apply-role-switch"
            onClick={handleApply}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Vào hệ thống với vai trò này</span>
          </button>
        </div>
      </div>
    </div>
  );
};
