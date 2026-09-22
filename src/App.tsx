import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { DashboardView } from './components/views/DashboardView';
import { ClassesView } from './components/views/ClassesView';
import { TasksView } from './components/views/TasksView';
import { DocumentsView } from './components/views/DocumentsView';
import { ExamsView } from './components/views/ExamsView';
import { ProgressView } from './components/views/ProgressView';

const AppContent: React.FC = () => {
  const { activeTab, userRole, teacherName, currentStudent, schoolName } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'classes':
        return <ClassesView />;
      case 'tasks':
        return <TasksView />;
      case 'documents':
        return <DocumentsView />;
      case 'exams':
        return <ExamsView />;
      case 'progress':
        return <ProgressView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div id="app-wrapper" className="min-h-screen flex flex-col bg-slate-50 font-['Be_Vietnam_Pro',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Persistent Desktop Sidebar & Collapsible Mobile Drawer */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic View Content */}
        <main
          id="main-app-content"
          role="main"
          className="flex-1 min-w-0 pb-12 transition-all duration-150"
        >
          {renderActiveView()}
        </main>
      </div>

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
              DT
            </div>
            <span className="font-semibold text-slate-700">{schoolName}</span>
            <span>•</span>
            <span>Duy Tân Learning Manager</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Phụ trách: </span>
            <strong className="text-slate-600 font-medium">Thầy {teacherName}</strong>
            <span className="mx-1">•</span>
            <span>Phiên bản 2.0 (2025 - 2026)</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
