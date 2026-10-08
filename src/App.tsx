import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { StudentBottomNav } from './components/common/StudentBottomNav';
import { StudentDashboard } from './components/student/StudentDashboard';
import { NotesSection } from './components/student/NotesSection';
import { LecturesSection } from './components/student/LecturesSection';
import { DppSection } from './components/student/DppSection';
import { TestsSection } from './components/student/TestsSection';
import { StudentProfile } from './components/student/StudentProfile';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { AdminPanel } from './components/admin/AdminPanel';
import { PdfViewerModal } from './components/common/PdfViewerModal';
import { VideoModal } from './components/common/VideoModal';
import { ActiveTab, Note, Lecture, DPP } from './types';

type AuthView = 'login' | 'signup' | 'adminLogin';

function MainAppContent() {
  const { user, isAdmin } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [adminViewActive, setAdminViewActive] = useState(false);

  // Automatically open Admin Panel when admin signs in
  React.useEffect(() => {
    if (isAdmin) {
      setAdminViewActive(true);
    }
  }, [isAdmin]);

  // Active Modals
  const [activePdfNote, setActivePdfNote] = useState<Note | null>(null);
  const [activeVideoLecture, setActiveVideoLecture] = useState<Lecture | null>(null);

  // 1. If not logged in, render appropriate Auth Page
  if (!user) {
    if (authView === 'signup') {
      return <SignUpPage onGoToLogin={() => setAuthView('login')} />;
    }
    if (authView === 'adminLogin') {
      return <AdminLoginPage onBackToStudentPortal={() => setAuthView('login')} />;
    }
    return (
      <LoginPage
        onGoToSignUp={() => setAuthView('signup')}
        onGoToAdminLogin={() => setAuthView('adminLogin')}
      />
    );
  }

  // 2. If user is Admin and in Admin View mode, render Admin Panel
  if (isAdmin && (adminViewActive || !activeTab)) {
    return (
      <AdminPanel
        onSwitchToStudentView={() => {
          setAdminViewActive(false);
          setActiveTab('dashboard');
        }}
      />
    );
  }

  // 3. Otherwise render Student Learning Workspace
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
        onOpenAdmin={() => setAdminViewActive(true)}
      />

      {/* Main Student Screen Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        {/* Admin Bar notice if admin is previewing student portal */}
        {isAdmin && (
          <div className="mb-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs flex items-center justify-between shadow-xs">
            <span className="font-semibold text-slate-300">
              Viewing as Student Preview Mode
            </span>
            <button
              onClick={() => setAdminViewActive(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-lg text-xs transition"
            >
              Return to Admin Panel →
            </button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <StudentDashboard
            onNavigateTab={setActiveTab}
            onOpenPdf={setActivePdfNote}
            onOpenVideo={setActiveVideoLecture}
          />
        )}

        {activeTab === 'notes' && (
          <NotesSection
            onOpenPdf={setActivePdfNote}
            onOpenVideo={setActiveVideoLecture}
          />
        )}

        {activeTab === 'lectures' && (
          <LecturesSection
            onOpenVideo={setActiveVideoLecture}
            onOpenNotes={() => setActiveTab('notes')}
          />
        )}

        {activeTab === 'dpp' && (
          <DppSection
            onOpenPdf={setActivePdfNote}
            onOpenVideo={setActiveVideoLecture}
          />
        )}

        {activeTab === 'tests' && (
          <TestsSection />
        )}

        {activeTab === 'profile' && (
          <StudentProfile />
        )}
      </main>

      {/* Student Bottom Navigation (Mobile First) */}
      <StudentBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Fullscreen Document / PDF Reader Modal */}
      {activePdfNote && (
        <PdfViewerModal
          isOpen={true}
          onClose={() => setActivePdfNote(null)}
          title={activePdfNote.title}
          subject={activePdfNote.subject}
          chapter={activePdfNote.chapter}
          fileUrl={activePdfNote.fileUrl}
          fileName={activePdfNote.fileName}
          pageCount={activePdfNote.pageCount}
          fileSize={activePdfNote.fileSize}
          youtubeVideoUrl={activePdfNote.youtubeVideoUrl}
          onOpenVideo={() => {
            setActiveVideoLecture({
              id: `note-video-${activePdfNote.id}`,
              title: activePdfNote.youtubeVideoTitle || `${activePdfNote.title} (Video Lecture)`,
              classLevel: activePdfNote.classLevel,
              subject: activePdfNote.subject,
              chapter: activePdfNote.chapter,
              lectureNumber: 'Ex',
              description: activePdfNote.description,
              videoUrl: activePdfNote.youtubeVideoUrl!,
              thumbnailUrl: '',
              duration: 'Video Lecture',
              uploaderId: 'admin-1',
              createdAt: activePdfNote.createdAt
            });
          }}
        />
      )}

      {/* Video Lecture Player Modal */}
      {activeVideoLecture && (
        <VideoModal
          isOpen={true}
          onClose={() => setActiveVideoLecture(null)}
          lecture={activeVideoLecture}
          onOpenNotes={() => {
            setActiveVideoLecture(null);
            setActiveTab('notes');
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
