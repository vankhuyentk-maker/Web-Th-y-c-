import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  BookOpen,
  FileCheck2,
  TrendingUp,
  School,
  GraduationCap,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    userRole,
    setUserRole,
    teacherName,
    schoolName,
    currentStudent,
    classes,
    students,
    tasks,
    documents,
    quizzes
  } = useApp();

  const navItems: {
    id: ActiveTab;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: number | string;
    studentBadge?: number | string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      description: userRole === 'teacher' ? 'Bảng điều khiển giáo viên' : 'Góc học tập cá nhân',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'classes',
      label: 'Lớp học & Học sinh',
      description: `${classes.length} lớp • ${students.length} học sinh`,
      icon: <Users className="w-5 h-5" />,
      badge: `${classes.length} lớp`
    },
    {
      id: 'tasks',
      label: 'Nhiệm vụ học tập',
      description: 'Giao bài & theo dõi nộp',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: tasks.length
    },
    {
      id: 'documents',
      label: 'Kho tài liệu',
      description: 'Học liệu & Đề cương số',
      icon: <BookOpen className="w-5 h-5" />,
      badge: documents.length
    },
    {
      id: 'exams',
      label: 'Bài kiểm tra & Điểm',
      description: 'Trắc nghiệm & Sổ điểm',
      icon: <FileCheck2 className="w-5 h-5" />,
      badge: quizzes.length
    },
    {
      id: 'progress',
      label: 'Theo dõi tiến độ',
      description: 'Biểu đồ & Thống kê kết quả',
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden animate-in fade-in duration-150"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        id="app-main-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 xl:w-72 bg-white border-r border-slate-200/80 shadow-xs flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="p-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Hệ thống quản lý học tập
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-blue-600 transition-colors'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="truncate">
                    <div className="text-sm leading-tight truncate">{item.label}</div>
                    <div
                      className={`text-[11px] truncate mt-0.5 ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Profile & Role switcher summary */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 font-bold shadow-xs ${
                  userRole === 'teacher' ? 'bg-blue-600' : 'bg-emerald-600'
                }`}
              >
                {userRole === 'teacher' ? (
                  <School className="w-5 h-5" />
                ) : (
                  <GraduationCap className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      userRole === 'teacher'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {userRole === 'teacher' ? 'Giáo viên quản trị' : 'Học sinh'}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate mt-1">
                  {userRole === 'teacher' ? teacherName : currentStudent?.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {userRole === 'teacher'
                    ? schoolName
                    : `Lớp ${currentStudent?.classId} • ${currentStudent?.code}`}
                </div>
              </div>
            </div>

            {/* Quick role toggler button */}
            <button
              id="sidebar-quick-role-toggle"
              onClick={() => {
                setUserRole(userRole === 'teacher' ? 'student' : 'teacher');
              }}
              className="mt-3 w-full py-1.5 px-2.5 rounded-lg border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50 text-[11px] font-semibold text-slate-700 hover:text-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-slate-400" />
              <span>Chuyển sang: {userRole === 'teacher' ? 'Học sinh' : 'Giáo viên'}</span>
            </button>
          </div>

          <div className="mt-2 text-center text-[10px] text-slate-400">
            Duy Tân Learning Manager • THPT Duy Tân
          </div>
        </div>
      </aside>
    </>
  );
};
