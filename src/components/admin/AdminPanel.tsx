import React, { useState } from 'react';
import { AdminNav } from './AdminNav';
import { AdminDashboard } from './AdminDashboard';
import { AdminStudentManager } from './AdminStudentManager';
import { AdminNotesManager } from './AdminNotesManager';
import { AdminLecturesManager } from './AdminLecturesManager';
import { AdminDppManager } from './AdminDppManager';
import { AdminBatchManager } from './AdminBatchManager';
import { AdminTestManager } from './AdminTestManager';
import { AdminNotificationManager } from './AdminNotificationManager';
import { AdminDeploymentGuide } from './AdminDeploymentGuide';
import { AdminSettings } from './AdminSettings';
import { PdfViewerModal } from '../common/PdfViewerModal';
import { VideoModal } from '../common/VideoModal';
import { AdminTab, Note, Lecture, DPP } from '../../types';

interface AdminPanelProps {
  onSwitchToStudentView: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSwitchToStudentView }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Preview Modals
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [previewLecture, setPreviewLecture] = useState<Lecture | null>(null);
  const [previewDpp, setPreviewDpp] = useState<DPP | null>(null);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Sidebar Navigation */}
      <AdminNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSwitchToStudentView={onSwitchToStudentView}
      />

      {/* Main Admin Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={setActiveTab} />}
        {activeTab === 'students' && <AdminStudentManager />}
        {activeTab === 'batches' && <AdminBatchManager />}
        {activeTab === 'notes' && (
          <AdminNotesManager
            onPreviewNote={setPreviewNote}
            onPreviewVideo={setPreviewLecture}
          />
        )}
        {activeTab === 'lectures' && <AdminLecturesManager onPreviewVideo={setPreviewLecture} />}
        {activeTab === 'dpp' && (
          <AdminDppManager
            onPreviewDpp={setPreviewDpp}
            onPreviewVideo={setPreviewLecture}
          />
        )}
        {activeTab === 'tests' && <AdminTestManager />}
        {activeTab === 'notifications' && <AdminNotificationManager />}
        {activeTab === 'guide' && <AdminDeploymentGuide />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>

      {/* Modals */}
      {previewNote && (
        <PdfViewerModal
          isOpen={true}
          onClose={() => setPreviewNote(null)}
          title={previewNote.title}
          subject={previewNote.subject}
          chapter={previewNote.chapter}
          fileUrl={previewNote.fileUrl}
          fileName={previewNote.fileName}
          pageCount={previewNote.pageCount}
          fileSize={previewNote.fileSize}
          youtubeVideoUrl={previewNote.youtubeVideoUrl}
          onOpenVideo={() => {
            setPreviewLecture({
              id: `lec-note-${previewNote.id}`,
              title: previewNote.youtubeVideoTitle || `${previewNote.title} (Video Lecture)`,
              classLevel: previewNote.classLevel,
              subject: previewNote.subject,
              chapter: previewNote.chapter,
              lectureNumber: 'Ex',
              description: previewNote.description,
              videoUrl: previewNote.youtubeVideoUrl!,
              thumbnailUrl: '',
              duration: 'Video Lecture',
              uploaderId: 'admin-1',
              createdAt: previewNote.createdAt
            });
          }}
        />
      )}

      {previewDpp && (
        <PdfViewerModal
          isOpen={true}
          onClose={() => setPreviewDpp(null)}
          title={previewDpp.title}
          subject={previewDpp.subject}
          chapter={previewDpp.chapter}
          fileUrl={previewDpp.fileUrl}
          fileName={`${previewDpp.title.replace(/\s+/g, '_')}.pdf`}
          pageCount={6}
          fileSize="1.9 MB"
        />
      )}

      {previewLecture && (
        <VideoModal
          isOpen={true}
          onClose={() => setPreviewLecture(null)}
          lecture={previewLecture}
        />
      )}
    </div>
  );
};
