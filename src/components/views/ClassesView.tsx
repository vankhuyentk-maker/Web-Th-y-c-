import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  School,
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  UserCheck,
  Phone,
  Mail,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { Student, ClassRoom, AcademicStatus } from '../../types';
import { ConfirmModal } from '../ConfirmModal';

export const ClassesView: React.FC = () => {
  const {
    classes,
    students,
    addClass,
    updateClass,
    deleteClass,
    addStudent,
    updateStudent,
    deleteStudent,
    userRole,
    teacherName,
    currentStudent
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'student' | 'class';
    id: string;
    name: string;
  } | null>(null);

  // Student Form state
  const [stdFormData, setStdFormData] = useState({
    name: '',
    code: '',
    classId: classes[0]?.name || '11/1',
    gender: 'Nam' as 'Nam' | 'Nữ',
    dob: '2008-01-01',
    academicStatus: 'Giỏi' as AcademicStatus,
    phone: '',
    email: '',
    notes: ''
  });

  // Class Form state
  const [clsFormData, setClsFormData] = useState({
    name: '',
    grade: 11 as 10 | 11 | 12,
    room: '',
    academicYear: '2025 - 2026',
    homeroomTeacher: teacherName,
    description: ''
  });

  // Filtering students
  const filteredStudents = students.filter((s) => {
    const matchesClass = selectedClassId === 'all' || s.classId === selectedClassId;
    const matchesStatus = statusFilter === 'all' || s.academicStatus === statusFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.phone && s.phone.includes(searchTerm)) ||
      (s.notes && s.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesClass && matchesStatus && matchesSearch;
  });

  // Handle open student modal
  const openAddStudentModal = () => {
    setEditingStudent(null);
    setStdFormData({
      name: '',
      code: `HS${new Date().getFullYear().toString().slice(-2)}${Math.floor(1000 + Math.random() * 9000)}`,
      classId: selectedClassId !== 'all' ? selectedClassId : classes[0]?.name || '11/1',
      gender: 'Nam',
      dob: '2008-05-15',
      academicStatus: 'Giỏi',
      phone: '',
      email: '',
      notes: ''
    });
    setIsAddStudentOpen(true);
  };

  const openEditStudentModal = (std: Student) => {
    setEditingStudent(std);
    setStdFormData({
      name: std.name,
      code: std.code,
      classId: std.classId,
      gender: std.gender,
      dob: std.dob,
      academicStatus: std.academicStatus,
      phone: std.phone || '',
      email: std.email || '',
      notes: std.notes || ''
    });
    setIsAddStudentOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stdFormData.name.trim()) return;

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        ...stdFormData
      });
    } else {
      addStudent(stdFormData);
    }
    setIsAddStudentOpen(false);
  };

  // Handle open class modal
  const openAddClassModal = () => {
    setEditingClass(null);
    setClsFormData({
      name: '',
      grade: 12,
      room: 'Phòng học mới',
      academicYear: '2025 - 2026',
      homeroomTeacher: teacherName,
      description: ''
    });
    setIsAddClassOpen(true);
  };

  const openEditClassModal = (cls: ClassRoom) => {
    setEditingClass(cls);
    setClsFormData({
      name: cls.name,
      grade: cls.grade,
      room: cls.room,
      academicYear: cls.academicYear,
      homeroomTeacher: cls.homeroomTeacher,
      description: cls.description || ''
    });
    setIsAddClassOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clsFormData.name.trim()) return;

    if (editingClass) {
      updateClass({
        ...editingClass,
        ...clsFormData
      });
    } else {
      addClass(clsFormData);
    }
    setIsAddClassOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'student') {
      deleteStudent(deleteTarget.id);
    } else if (deleteTarget.type === 'class') {
      deleteClass(deleteTarget.id);
      if (selectedClassId === deleteTarget.id) {
        setSelectedClassId('all');
      }
    }
    setDeleteTarget(null);
  };

  const getStatusBadge = (status: AcademicStatus) => {
    switch (status) {
      case 'Xuất sắc':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Giỏi':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Khá':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cần cố gắng':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="classes-view-container" className="space-y-6">
      {/* Top Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Lớp học & Học sinh
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tổng cộng {classes.length} lớp học và {students.length} học sinh trường THPT Duy Tân
          </p>
        </div>

        {userRole === 'teacher' && (
          <div className="flex items-center gap-2">
            <button
              id="btn-add-class"
              onClick={openAddClassModal}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4 text-slate-500" />
              <span>Thêm lớp</span>
            </button>
            <button
              id="btn-add-student"
              onClick={openAddStudentModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm học sinh</span>
            </button>
          </div>
        )}
      </div>

      {/* Class Selector Carousel / Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* All classes button */}
        <div
          id="class-card-all"
          onClick={() => setSelectedClassId('all')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedClassId === 'all'
              ? 'border-blue-600 bg-blue-50/80 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Tất cả các lớp</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-extrabold text-slate-900 mt-1">{students.length}</div>
          <div className="text-[11px] text-slate-500">học sinh toàn trường</div>
        </div>

        {/* Individual classes */}
        {classes.map((cls) => {
          const count = students.filter((s) => s.classId === cls.name).length;
          const isSelected = selectedClassId === cls.name;

          return (
            <div
              key={cls.id}
              id={`class-card-${cls.name}`}
              onClick={() => setSelectedClassId(cls.name)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Lớp {cls.name}</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-100 rounded text-slate-600">
                  Khối {cls.grade}
                </span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 mt-1">{count}</div>
              <div className="text-[11px] text-slate-500 truncate">{cls.room}</div>

              {/* Action buttons on card hover for teacher */}
              {userRole === 'teacher' && (
                <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 bg-white/95 p-1 rounded-lg shadow-xs border border-slate-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditClassModal(cls);
                    }}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Chỉnh sửa thông tin lớp"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({ type: 'class', id: cls.id, name: `Lớp ${cls.name}` });
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Xóa lớp"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-student"
            type="text"
            placeholder="Tìm kiếm học sinh theo tên, mã HS, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Học lực:</span>
          </div>
          <select
            id="select-academic-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả xếp loại</option>
            <option value="Xuất sắc">Xuất sắc</option>
            <option value="Giỏi">Giỏi</option>
            <option value="Khá">Khá</option>
            <option value="Cần cố gắng">Cần cố gắng</option>
          </select>
        </div>
      </div>

      {/* Student Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Danh sách học sinh{' '}
            {selectedClassId !== 'all' ? `Lớp ${selectedClassId}` : 'toàn trường'}{' '}
            <span className="text-blue-600 font-extrabold">({filteredStudents.length})</span>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">Không tìm thấy học sinh nào phù hợp.</p>
            <p className="text-xs text-slate-400 mt-1">
              Thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc lớp khác.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Mã & Họ tên học sinh</th>
                  <th className="py-3 px-4">Lớp</th>
                  <th className="py-3 px-4">Giới tính & Ngày sinh</th>
                  <th className="py-3 px-4">Học lực</th>
                  <th className="py-3 px-4">Liên hệ & Ghi chú</th>
                  {userRole === 'teacher' && <th className="py-3 px-4 text-right">Thao tác</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredStudents.map((std) => (
                  <tr
                    key={std.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Name & Code */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {std.name.split(' ').slice(-1)[0]?.charAt(0) || 'H'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{std.name}</span>
                            {std.id === currentStudent?.id && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                Tôi
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{std.code}</div>
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-slate-100 text-slate-700">
                        {std.classId}
                      </span>
                    </td>

                    {/* Gender & DOB */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{std.gender}</div>
                      <div className="text-[11px] text-slate-400">{std.dob}</div>
                    </td>

                    {/* Academic Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                          std.academicStatus
                        )}`}
                      >
                        {std.academicStatus}
                      </span>
                    </td>

                    {/* Contact & Notes */}
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      {std.notes ? (
                        <div className="text-xs text-slate-600 truncate">{std.notes}</div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">—</span>
                      )}
                      {std.phone && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{std.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Actions for teacher */}
                    {userRole === 'teacher' && (
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            id={`btn-edit-student-${std.id}`}
                            onClick={() => openEditStudentModal(std)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Sửa thông tin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-delete-student-${std.id}`}
                            onClick={() =>
                              setDeleteTarget({
                                type: 'student',
                                id: std.id,
                                name: `${std.name} (Lớp ${std.classId})`
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa học sinh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD / EDIT STUDENT ================= */}
      {isAddStudentOpen && (
        <div
          id="modal-add-edit-student"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                {editingStudent ? 'Chỉnh sửa thông tin học sinh' : 'Thêm học sinh mới'}
              </h3>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên học sinh *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn An"
                    value={stdFormData.name}
                    onChange={(e) => setStdFormData({ ...stdFormData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã học sinh *
                  </label>
                  <input
                    type="text"
                    required
                    value={stdFormData.code}
                    onChange={(e) => setStdFormData({ ...stdFormData, code: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lớp học *
                  </label>
                  <select
                    value={stdFormData.classId}
                    onChange={(e) => setStdFormData({ ...stdFormData, classId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        Lớp {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giới tính
                  </label>
                  <select
                    value={stdFormData.gender}
                    onChange={(e) =>
                      setStdFormData({ ...stdFormData, gender: e.target.value as 'Nam' | 'Nữ' })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Học lực
                  </label>
                  <select
                    value={stdFormData.academicStatus}
                    onChange={(e) =>
                      setStdFormData({
                        ...stdFormData,
                        academicStatus: e.target.value as AcademicStatus
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Xuất sắc">Xuất sắc</option>
                    <option value="Giỏi">Giỏi</option>
                    <option value="Khá">Khá</option>
                    <option value="Cần cố gắng">Cần cố gắng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    value={stdFormData.dob}
                    onChange={(e) => setStdFormData({ ...stdFormData, dob: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 0912 345 678"
                    value={stdFormData.phone}
                    onChange={(e) => setStdFormData({ ...stdFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ghi chú của giáo viên
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về năng lực, tinh thần học tập..."
                  value={stdFormData.notes}
                  onChange={(e) => setStdFormData({ ...stdFormData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {editingStudent ? 'Lưu thay đổi' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT CLASS ================= */}
      {isAddClassOpen && (
        <div
          id="modal-add-edit-class"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                {editingClass ? 'Sửa thông tin lớp học' : 'Thêm lớp học mới'}
              </h3>
              <button
                onClick={() => setIsAddClassOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên lớp học *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: 10A2, 11A3, 12A3..."
                  value={clsFormData.name}
                  onChange={(e) => setClsFormData({ ...clsFormData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Khối *</label>
                  <select
                    value={clsFormData.grade}
                    onChange={(e) =>
                      setClsFormData({
                        ...clsFormData,
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phòng học
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Phòng 201 - Dãy A"
                    value={clsFormData.room}
                    onChange={(e) => setClsFormData({ ...clsFormData, room: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Giáo viên phụ trách / chủ nhiệm
                </label>
                <input
                  type="text"
                  value={clsFormData.homeroomTeacher}
                  onChange={(e) =>
                    setClsFormData({ ...clsFormData, homeroomTeacher: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả lớp</label>
                <textarea
                  rows={2}
                  placeholder="VD: Lớp định hướng ban tự nhiên..."
                  value={clsFormData.description}
                  onChange={(e) => setClsFormData({ ...clsFormData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddClassOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {editingClass ? 'Lưu cập nhật' : 'Thêm lớp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title={`Xác nhận xóa ${deleteTarget?.type === 'class' ? 'lớp học' : 'học sinh'}?`}
        message={`Bạn có chắc chắn muốn xóa ${deleteTarget?.name}? Hành động này sẽ xóa dữ liệu khỏi hệ thống trường THPT Duy Tân.`}
        confirmLabel="Xác nhận xóa"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
