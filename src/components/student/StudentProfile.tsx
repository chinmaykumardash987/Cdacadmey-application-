import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StorageService } from '../../services/storage';
import { FirestoreDataService } from '../../services/firestoreData';
import { CdAcademyLogo } from '../common/CdAcademyLogo';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Shield,
  Download,
  LogOut,
  CheckCircle2,
  Smartphone,
  BookOpen,
  Video,
  FileCheck,
  Bell,
  Award,
  IdCard,
  Edit2,
  Check,
  Save,
  X,
  Bookmark,
  BookmarkCheck,
  Trash2,
  Search,
  Eye,
  Play,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { ClassLevel, TestResultItem, Note, Lecture, ActiveTab, BookmarkItemType, Subject } from '../../types';

interface StudentProfileProps {
  onOpenPdf?: (note: Note) => void;
  onOpenVideo?: (lecture: Lecture) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  initialSubTab?: 'profile' | 'saved';
}

export const StudentProfile: React.FC<StudentProfileProps> = ({
  onOpenPdf,
  onOpenVideo,
  onNavigateTab,
  initialSubTab = 'profile'
}) => {
  const { user, selectedClass, setSelectedClass, logout, isAdmin, requestNotificationPermission, updateProfile } = useAuth();
  const {
    bookmarks,
    savedNotes,
    savedLectures,
    savedCount,
    removeBookmark,
    notes: allNotes,
    lectures: allLectures
  } = useData();

  // Sub tab selection: 'profile' or 'saved'
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'saved'>(initialSubTab);

  // Saved section filters
  const [savedFilterType, setSavedFilterType] = useState<'all' | 'note' | 'lecture'>('all');
  const [savedSearchQuery, setSavedSearchQuery] = useState('');
  const [savedSubjectFilter, setSavedSubjectFilter] = useState<string>('All');

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [testResults, setTestResults] = useState<TestResultItem[]>([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editBoard, setEditBoard] = useState(user?.board || 'CBSE Board');
  const [editRoll, setEditRoll] = useState(user?.rollNumber || 'CD-1001');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notesCount = allNotes.filter(n => n.classLevel === selectedClass).length;
  const lecturesCount = allLectures.filter(l => l.classLevel === selectedClass).length;
  const dppCount = StorageService.getDPPs().filter(d => d.classLevel === selectedClass).length;

  useEffect(() => {
    if (user?.id) {
      FirestoreDataService.getStudentTestResults(user.id).then(setTestResults);
    }
  }, [user]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      alert('To install CD ACADEMY on your Android phone, tap the browser menu (⋮) and tap "Install app" or "Add to Home screen"!');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      fullName: editName.trim(),
      name: editName.trim(),
      phone: editPhone.trim(),
      board: editBoard.trim(),
      rollNumber: editRoll.trim()
    });
    setSaving(false);
    setEditing(false);
    showToast('Profile updated successfully!');
  };

  const handleDownloadNote = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = note.fileUrl;
    link.download = note.fileName || `${note.title}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemoveBookmark = async (bookmarkId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await removeBookmark(bookmarkId);
    showToast(`Removed "${title}" from saved`);
  };

  // Filtered bookmarks list
  const filteredSavedBookmarks = useMemo(() => {
    return bookmarks.filter(b => {
      // Type filter
      if (savedFilterType !== 'all' && b.itemType !== savedFilterType) {
        return false;
      }
      // Subject filter
      if (savedSubjectFilter !== 'All' && b.subject !== savedSubjectFilter) {
        return false;
      }
      // Query filter
      if (savedSearchQuery.trim()) {
        const q = savedSearchQuery.toLowerCase();
        const matchesTitle = b.title.toLowerCase().includes(q);
        const matchesChapter = b.chapter.toLowerCase().includes(q);
        const matchesSubject = b.subject.toLowerCase().includes(q);
        const matchesDesc = b.description?.toLowerCase().includes(q);
        return matchesTitle || matchesChapter || matchesSubject || matchesDesc;
      }
      return true;
    });
  }, [bookmarks, savedFilterType, savedSubjectFilter, savedSearchQuery]);

  // Unique subjects among saved items
  const savedSubjects = useMemo(() => {
    const set = new Set<string>();
    bookmarks.forEach(b => set.add(b.subject));
    return Array.from(set);
  }, [bookmarks]);

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile Header & Subtab Segmented Switcher */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-center font-black text-xl shadow-sm border-2 border-white ring-2 ring-red-500/20 shrink-0">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">
              {user?.fullName || 'Student Portal'}
            </h2>
            <p className="text-xs text-slate-500 truncate">
              {user?.classLevel || selectedClass} • {user?.board || 'CBSE Board'}
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto self-stretch">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeSubTab === 'profile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-slate-500" />
            <span>Profile & Account</span>
          </button>

          <button
            onClick={() => setActiveSubTab('saved')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 relative ${
              activeSubTab === 'saved'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${activeSubTab === 'saved' ? 'fill-white' : 'text-amber-500'}`} />
            <span>Saved Materials</span>
            {savedCount > 0 && (
              <span
                className={`text-[10px] px-2 py-0.2 rounded-full font-black ${
                  activeSubTab === 'saved'
                    ? 'bg-white text-red-600'
                    : 'bg-red-600 text-white'
                }`}
              >
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* -------------------- TAB 1: SAVED MATERIALS -------------------- */}
      {activeSubTab === 'saved' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Saved Materials Header & Stats */}
          <div className="bg-gradient-to-r from-amber-500/10 via-red-500/5 to-transparent bg-white rounded-3xl p-6 border border-amber-200/60 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
                    <Bookmark className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Saved Study Materials
                    </h1>
                    <p className="text-xs text-slate-500">
                      Quickly access your bookmarked notes, PDFs, and video lectures anytime for revision
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick counts pills */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                  {savedCount} Saved Items
                </span>
              </div>
            </div>

            {/* Filter Pills: All / Notes / Lectures */}
            <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSavedFilterType('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  savedFilterType === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>All Saved</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                  {savedCount}
                </span>
              </button>

              <button
                onClick={() => setSavedFilterType('note')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  savedFilterType === 'note'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Notes & PDFs</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                  {savedNotes.length}
                </span>
              </button>

              <button
                onClick={() => setSavedFilterType('lecture')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  savedFilterType === 'lecture'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Lectures</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                  {savedLectures.length}
                </span>
              </button>

              {/* Subject dropdown if bookmarks span subjects */}
              {savedSubjects.length > 0 && (
                <div className="ml-auto flex items-center gap-1 text-xs">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={savedSubjectFilter}
                    onChange={e => setSavedSubjectFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="All">All Subjects ({savedSubjects.length})</option>
                    {savedSubjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Search input if items exist */}
            {savedCount > 0 && (
              <div className="mt-3 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={savedSearchQuery}
                  onChange={e => setSavedSearchQuery(e.target.value)}
                  placeholder="Filter your saved materials by title, chapter or topic..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                />
              </div>
            )}
          </div>

          {/* Saved Items List / Grid */}
          {filteredSavedBookmarks.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center mb-4 border border-amber-200 shadow-2xs">
                <Bookmark className="w-8 h-8 fill-amber-500/20 text-amber-500" />
              </div>

              {savedCount === 0 ? (
                <>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1.5">
                    No Saved Materials Yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                    Tap the <strong className="text-amber-600">Bookmark icon (🔖)</strong> on any study note or video lecture while browsing to save it here for fast revision before exams.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {onNavigateTab && (
                      <>
                        <button
                          onClick={() => onNavigateTab('notes')}
                          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Browse Study Notes</span>
                        </button>
                        <button
                          onClick={() => onNavigateTab('lectures')}
                          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
                        >
                          <Video className="w-4 h-4" />
                          <span>Explore Video Classes</span>
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-base font-bold text-slate-800 mb-1">
                    No Matching Saved Materials
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                    None of your {savedCount} saved items match "{savedSearchQuery}". Try clearing filters or searching another keyword.
                  </p>
                  <button
                    onClick={() => {
                      setSavedSearchQuery('');
                      setSavedFilterType('all');
                      setSavedSubjectFilter('All');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
                  >
                    Clear Search & Filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSavedBookmarks.map(bookmark => {
                const isNote = bookmark.itemType === 'note';
                // Look up live matching note or lecture
                const liveNote = isNote ? allNotes.find(n => n.id === bookmark.itemId) : null;
                const liveLecture = !isNote ? allLectures.find(l => l.id === bookmark.itemId) : null;

                const effectiveNote: Note = liveNote || {
                  id: bookmark.itemId,
                  title: bookmark.title,
                  classLevel: bookmark.classLevel,
                  subject: bookmark.subject,
                  chapter: bookmark.chapter,
                  description: bookmark.description || '',
                  fileUrl: bookmark.fileUrl || '',
                  fileName: bookmark.fileName || `${bookmark.title}.pdf`,
                  fileSize: bookmark.fileSize || '3.2 MB',
                  pageCount: bookmark.pageCount || 10,
                  uploaderId: 'cd-faculty',
                  createdAt: bookmark.savedAt,
                  youtubeVideoUrl: bookmark.youtubeVideoUrl,
                  youtubeVideoTitle: bookmark.youtubeVideoTitle
                };

                const effectiveLecture: Lecture = liveLecture || {
                  id: bookmark.itemId,
                  title: bookmark.title,
                  classLevel: bookmark.classLevel,
                  subject: bookmark.subject,
                  chapter: bookmark.chapter,
                  lectureNumber: bookmark.lectureNumber || '01',
                  description: bookmark.description || '',
                  videoUrl: bookmark.videoUrl || '',
                  thumbnailUrl: bookmark.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
                  duration: bookmark.duration || '45 mins',
                  uploaderId: 'cd-faculty',
                  createdAt: bookmark.savedAt
                };

                return (
                  <div
                    key={bookmark.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${
                              isNote
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {isNote ? <BookOpen className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                            <span>{isNote ? 'Study Note' : 'Video Class'}</span>
                          </span>

                          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            {bookmark.subject}
                          </span>

                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">
                            {bookmark.classLevel}
                          </span>
                        </div>

                        {/* Remove Bookmark Button */}
                        <button
                          type="button"
                          onClick={(e) => handleRemoveBookmark(bookmark.id, bookmark.title, e)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Remove from Saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Video Thumbnail if Lecture */}
                      {!isNote && (
                        <div
                          onClick={() => onOpenVideo && onOpenVideo(effectiveLecture)}
                          className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-900 cursor-pointer group/thumb"
                        >
                          <img
                            src={effectiveLecture.thumbnailUrl}
                            alt={effectiveLecture.title}
                            className="w-full h-full object-cover group-hover/thumb:scale-105 transition duration-300 opacity-90"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/15 transition flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition">
                              <Play className="w-4 h-4 ml-0.5 fill-white" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{effectiveLecture.duration}</span>
                          </div>
                        </div>
                      )}

                      {/* Title & Info */}
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-red-600 transition leading-snug">
                        {bookmark.title}
                      </h4>

                      <p className="text-xs font-semibold text-slate-700 mt-1">
                        Chapter: <span className="text-slate-900">{bookmark.chapter}</span>
                      </p>

                      {bookmark.description && (
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {bookmark.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Saved: {new Date(bookmark.savedAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        {isNote ? (
                          <>
                            <button
                              type="button"
                              onClick={(e) => handleDownloadNote(effectiveNote, e)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenPdf && onOpenPdf(effectiveNote)}
                              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-2xs transition text-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Open PDF</span>
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenVideo && onOpenVideo(effectiveLecture)}
                            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3.5 py-1.5 rounded-lg shadow-2xs transition text-xs"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Play Video</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* -------------------- TAB 2: PROFILE & ACCOUNT -------------------- */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-md border-4 border-white ring-2 ring-red-500/20 shrink-0">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
              </div>

              <div className="text-center sm:text-left flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 truncate">
                    {user?.fullName || 'Student Name'}
                  </h1>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active Student
                  </span>
                  <button
                    onClick={() => {
                      setEditName(user?.fullName || '');
                      setEditPhone(user?.phone || '');
                      setEditBoard(user?.board || 'CBSE Board');
                      setEditRoll(user?.rollNumber || 'CD-1001');
                      setEditing(true);
                    }}
                    className="text-slate-400 hover:text-red-600 transition p-1"
                    title="Edit Profile"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 mb-3">
                  Enrolled in {user?.classLevel || selectedClass} • {user?.board || 'CBSE Board'} • Roll: <strong className="text-slate-700">{user?.rollNumber || 'CD-1001'}</strong>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="truncate">{user?.email || 'student@cdacademy.com'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{user?.phone || '+91 98765 43210'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate col-span-1 sm:col-span-2">
                    <IdCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">UID: {user?.id?.slice(0, 18) || 'std-guest'}...</span>
                    <span className="text-slate-300">|</span>
                    <span>Created: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Statistics including Bookmarked Items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-center">
              <div
                onClick={() => onNavigateTab && onNavigateTab('notes')}
                className="p-3 bg-red-50/60 hover:bg-red-50 rounded-xl border border-red-100 cursor-pointer transition"
              >
                <BookOpen className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <span className="text-lg font-black text-slate-900 block">{notesCount}</span>
                <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
                  {selectedClass} Notes
                </span>
              </div>

              <div
                onClick={() => onNavigateTab && onNavigateTab('lectures')}
                className="p-3 bg-blue-50/60 hover:bg-blue-50 rounded-xl border border-blue-100 cursor-pointer transition"
              >
                <Video className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <span className="text-lg font-black text-slate-900 block">{lecturesCount}</span>
                <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
                  {selectedClass} Lectures
                </span>
              </div>

              <div
                onClick={() => onNavigateTab && onNavigateTab('dpp')}
                className="p-3 bg-emerald-50/60 hover:bg-emerald-50 rounded-xl border border-emerald-100 cursor-pointer transition"
              >
                <FileCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="text-lg font-black text-slate-900 block">{dppCount}</span>
                <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
                  {selectedClass} DPPs
                </span>
              </div>

              {/* Saved Materials Quick Stat Box */}
              <div
                onClick={() => setActiveSubTab('saved')}
                className="p-3 bg-amber-50 hover:bg-amber-100/80 rounded-xl border border-amber-200 cursor-pointer transition ring-1 ring-amber-400/20"
                title="View your saved notes & lectures"
              >
                <Bookmark className="w-5 h-5 text-amber-600 fill-amber-500 mx-auto mb-1" />
                <span className="text-lg font-black text-amber-900 block">{savedCount}</span>
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                  Saved Items →
                </span>
              </div>
            </div>
          </div>

          {/* Push Notification Controls Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">Push Notifications & Live Alerts</h4>
                <p className="text-[11px] text-slate-500">
                  Status: <span className="font-bold text-emerald-600 capitalize">{user?.notificationPermission || 'Default'}</span> • Real-time notifications for lectures, notes and tests
                </p>
              </div>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition shrink-0"
            >
              {user?.notificationPermission === 'granted' ? 'Alerts Active ✓' : 'Enable Alerts'}
            </button>
          </div>

          {/* Class Level Preference */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-red-600" />
              <span>Active Learning Class</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Switch between Class 11 and Class 12 anytime to review concepts or prepare ahead.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {(['Class 11', 'Class 12'] as ClassLevel[]).map(cls => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                    selectedClass === cls
                      ? 'border-red-600 bg-red-50 text-red-700 shadow-2xs ring-1 ring-red-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{cls}</span>
                  {selectedClass === cls && (
                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-semibold">
                      Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Install as Android App Card */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Install CD ACADEMY Mobile App</h4>
                <p className="text-xs text-red-100 mt-0.5">
                  Add CD ACADEMY to your phone's home screen for fast 1-tap offline-ready access.
                </p>
              </div>
            </div>
            <button
              onClick={handleInstallApp}
              className="bg-white text-red-700 hover:bg-slate-100 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs whitespace-nowrap self-stretch sm:self-auto"
            >
              {isInstallable ? 'Install Android App' : 'Add to Home Screen'}
            </button>
          </div>

          {/* Brand & Mission Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col items-center text-center">
            <CdAcademyLogo variant="badge" size="sm" className="mb-2" />
            <p className="text-xs text-slate-500 max-w-md mt-1">
              CD ACADEMY is dedicated to empowering students of Class 11 and Class 12 with crystal clear fundamentals, quality notes, and guided lectures.
            </p>
            <p className="text-xs font-bold text-red-600 tracking-wider uppercase mt-2">
              "Har Bachha Padhega"
            </p>

            <div className="mt-5 w-full pt-4 border-t border-slate-100 flex justify-center">
              <button
                onClick={logout}
                className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl transition border border-red-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Edit Student Profile</h3>
              <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Board</label>
                  <select
                    value={editBoard}
                    onChange={e => setEditBoard(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="CBSE Board">CBSE Board</option>
                    <option value="CHSE Odisha">CHSE Odisha</option>
                    <option value="State Board">State Board</option>
                    <option value="ICSE / ISC">ICSE / ISC</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Roll / Student ID</label>
                  <input
                    type="text"
                    value={editRoll}
                    onChange={e => setEditRoll(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
