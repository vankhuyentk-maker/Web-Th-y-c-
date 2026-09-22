import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  School,
  Volume2,
  VolumeX,
  Bell,
  RotateCcw,
  Check,
  ChevronDown,
  UserCheck,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import { RoleSwitchModal } from './RoleSwitchModal';
import { ConfirmModal } from './ConfirmModal';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const {
    userRole,
    teacherName,
    schoolName,
    currentStudent,
    soundEnabled,
    toggleSound,
    notifications,
    unreadNotifCount,
    markNotificationRead,
    markAllNotificationsRead,
    resetToDemoData
  } = useApp();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header
        id="app-main-navbar"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-4 lg:px-6 h-16 flex items-center justify-between"
      >
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            id="btn-mobile-sidebar-toggle"
            onClick={onToggleMobileMenu}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Mở menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 shrink-0">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-base tracking-tight">
                  Duy Tân <span className="text-blue-600 font-extrabold">Learning Manager</span>
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                  THPT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none hidden md:block">
                {schoolName} • Quản trị học tập thông minh
              </p>
            </div>
          </div>
        </div>

        {/* Right: Sound, Notifications, Reset, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={toggleSound}
            className={`p-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              soundEnabled
                ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
            title={soundEnabled ? 'Đang bật âm thanh phản hồi (Bấm để tắt)' : 'Đang tắt âm thanh (Bấm để bật)'}
            aria-label="Bật tắt âm thanh"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] hidden xl:inline">Âm thanh: Bật</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] hidden xl:inline">Âm thanh: Tắt</span>
              </>
            )}
          </button>

          {/* Reset Demo Data Button */}
          <button
            id="btn-reset-demo-data"
            onClick={() => setIsResetConfirmOpen(true)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
            title="Khôi phục lại dữ liệu mẫu gốc ban đầu"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-[11px] hidden xl:inline font-medium">Đặt lại mẫu</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              id="btn-open-notifications"
              onClick={() => setIsNotifDropdownOpen((prev) => !prev)}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
              title="Thông báo hệ thống"
              aria-label="Thông báo"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Dropdown panel */}
            {isNotifDropdownOpen && (
              <div
                id="notifications-dropdown-menu"
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="p-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900 uppercase tracking-wider">
                      Thông báo từ nhà trường
                    </span>
                    {unreadNotifCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold">
                        {unreadNotifCount} mới
                      </span>
                    )}
                  </div>
                  {unreadNotifCount > 0 && (
                    <button
                      id="btn-mark-all-read"
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    >
                      Đã đọc tất cả
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      Không có thông báo nào.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-left ${
                          !n.isRead ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-semibold text-slate-800 leading-snug">
                            {n.title}
                          </h5>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                          {n.message}
                        </p>
                        <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
                          <span>{n.timestamp}</span>
                          {n.isRead && <span className="text-slate-400">Đã đọc</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Role Switcher Button */}
          <button
            id="btn-switch-role-trigger"
            onClick={() => setIsRoleModalOpen(true)}
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
              userRole === 'teacher'
                ? 'bg-blue-50/80 border-blue-200 hover:bg-blue-100/80'
                : 'bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100/80'
            }`}
            title="Nhấn để đổi vai trò giữa Giáo viên và Học sinh"
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 ${
                userRole === 'teacher' ? 'bg-blue-600' : 'bg-emerald-600'
              }`}
            >
              {userRole === 'teacher' ? (
                <UserCheck className="w-4 h-4" />
              ) : (
                <GraduationCap className="w-4 h-4" />
              )}
            </div>
            <div className="leading-none text-left hidden sm:block">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {userRole === 'teacher' ? 'Giáo viên' : 'Học sinh'}
              </div>
              <div className="text-xs font-bold text-slate-900 truncate max-w-[130px] mt-0.5">
                {userRole === 'teacher' ? teacherName.replace('Thầy ', '') : currentStudent?.name}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>
        </div>
      </header>

      {/* Role Switcher Modal */}
      <RoleSwitchModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} />

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Khôi phục dữ liệu mẫu THPT Duy Tân?"
        message="Hành động này sẽ khôi phục lại danh sách lớp học, học sinh, nhiệm vụ, tài liệu và điểm kiểm tra mẫu gốc của trường. Dữ liệu bạn vừa chỉnh sửa sẽ được đặt lại."
        confirmLabel="Khôi phục lại"
        cancelLabel="Giữ dữ liệu hiện tại"
        isDestructive={false}
        onConfirm={resetToDemoData}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </>
  );
};
