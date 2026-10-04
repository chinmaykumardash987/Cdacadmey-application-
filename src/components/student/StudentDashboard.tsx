import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { ActiveTab, ClassLevel, Subject } from '../../types';
import {
  BookOpen,
  Video,
  FileCheck,
  BarChart3,
  ArrowRight,
  Play,
  FileText,
  Sparkles,
  CheckCircle2,
  Atom,
  FlaskConical,
  Calculator,
  Dna,
  BookA,
  Zap,
  HelpCircle,
  Award,
  Grid,
  LayoutList,
  Compass,
  Check,
  Search,
  Flame,
  GraduationCap,
  Clock,
  Youtube,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Smartphone
} from 'lucide-react';
import { ApkDownloadModal } from '../common/ApkDownloadModal';

interface StudentDashboardProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenPdf: (note: any) => void;
  onOpenVideo: (lecture: any) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigateTab,
  onOpenPdf,
  onOpenVideo
}) => {
  const { user, selectedClass, setSelectedClass } = useAuth();
  const [viewMode, setViewMode] = useState<'icon' | 'card'>('icon');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showApkModal, setShowApkModal] = useState(false);

  const allNotes = StorageService.getNotes();
  const allLectures = StorageService.getLectures();
  const allDPPs = StorageService.getDPPs();

  const filteredNotes = allNotes.filter(n => n.classLevel === selectedClass);
  const filteredLectures = allLectures.filter(l => l.classLevel === selectedClass);
  const filteredDPPs = allDPPs.filter(d => d.classLevel === selectedClass);

  const recentLecture = filteredLectures[0] || null;
  const recentNote = filteredNotes[0] || null;

  // Time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // Quick Icon Type Launchers
  const iconTypeItems = [
    {
      id: 'notes' as ActiveTab,
      label: 'Study Notes',
      sublabel: 'Handwritten & NCERT',
      icon: BookOpen,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50 text-rose-600 border-rose-100',
      badge: `${filteredNotes.length}`,
      badgeColor: 'bg-rose-600 text-white'
    },
    {
      id: 'lectures' as ActiveTab,
      label: 'Video Classes',
      sublabel: 'Topic Lectures',
      icon: Video,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50 text-blue-600 border-blue-100',
      badge: `${filteredLectures.length}`,
      badgeColor: 'bg-blue-600 text-white'
    },
    {
      id: 'dpp' as ActiveTab,
      label: 'Daily DPP',
      sublabel: 'Practice Problems',
      icon: FileCheck,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badge: `${filteredDPPs.length}`,
      badgeColor: 'bg-emerald-600 text-white'
    },
    {
      id: 'tests' as ActiveTab,
      label: 'Mock Tests',
      sublabel: 'Online CBT Series',
      icon: BarChart3,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50 text-purple-600 border-purple-100',
      badge: 'CBT',
      badgeColor: 'bg-purple-600 text-white'
    },
    {
      id: 'notes' as ActiveTab,
      label: 'Formula Sheet',
      sublabel: 'Quick Revision',
      icon: Zap,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: 'High Yield',
      badgeColor: 'bg-amber-600 text-white'
    },
    {
      id: 'lectures' as ActiveTab,
      label: 'YouTube Videos',
      sublabel: 'Attached Lectures',
      icon: Youtube,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50 text-red-600 border-red-100',
      badge: 'HD Video',
      badgeColor: 'bg-red-600 text-white'
    },
    {
      id: 'profile' as ActiveTab,
      label: 'My Progress',
      sublabel: 'Badges & Stats',
      icon: Award,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badge: 'Profile',
      badgeColor: 'bg-indigo-600 text-white'
    },
    {
      id: 'dpp' as ActiveTab,
      label: 'Video Solutions',
      sublabel: 'DPP Walkthrough',
      icon: HelpCircle,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50 text-teal-600 border-teal-100',
      badge: 'Step-by-Step',
      badgeColor: 'bg-teal-600 text-white'
    },
    {
      id: 'dashboard' as ActiveTab,
      label: 'Android APK',
      sublabel: 'Install Native App',
      icon: Smartphone,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badge: 'APK App',
      badgeColor: 'bg-emerald-600 text-white',
      onClick: () => setShowApkModal(true)
    }
  ];

  // Subject Cards data
  const subjectCards: {
    subject: Subject;
    icon: React.FC<{ className?: string }>;
    accentColor: string;
    badgeBg: string;
    summary: string;
    notesCount: number;
    lecturesCount: number;
    dppCount: number;
  }[] = [
    {
      subject: 'Physics',
      icon: Atom,
      accentColor: 'text-red-600',
      badgeBg: 'bg-red-50 border-red-200 text-red-700',
      summary: selectedClass === 'Class 11' ? 'Mechanics, Gravitation, Waves & Heat' : 'Electrostatics, Optics, Magnetism & Modern Physics',
      notesCount: filteredNotes.filter(n => n.subject === 'Physics').length,
      lecturesCount: filteredLectures.filter(l => l.subject === 'Physics').length,
      dppCount: filteredDPPs.filter(d => d.subject === 'Physics').length
    },
    {
      subject: 'Chemistry',
      icon: FlaskConical,
      accentColor: 'text-blue-600',
      badgeBg: 'bg-blue-50 border-blue-200 text-blue-700',
      summary: selectedClass === 'Class 11' ? 'Structure of Atom, Bonding & Thermodynamics' : 'Solutions, Electrochemistry, Coordination & Organic',
      notesCount: filteredNotes.filter(n => n.subject === 'Chemistry').length,
      lecturesCount: filteredLectures.filter(l => l.subject === 'Chemistry').length,
      dppCount: filteredDPPs.filter(d => d.subject === 'Chemistry').length
    },
    {
      subject: 'Mathematics',
      icon: Calculator,
      accentColor: 'text-amber-600',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
      summary: selectedClass === 'Class 11' ? 'Sets, Relations, Trigonometry & Coordinate' : 'Calculus, Vectors, 3D Geometry & Probability',
      notesCount: filteredNotes.filter(n => n.subject === 'Mathematics').length,
      lecturesCount: filteredLectures.filter(l => l.subject === 'Mathematics').length,
      dppCount: filteredDPPs.filter(d => d.subject === 'Mathematics').length
    },
    {
      subject: 'Biology',
      icon: Dna,
      accentColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      summary: selectedClass === 'Class 11' ? 'Cell Biology, Plant Physiology & Diversity' : 'Genetics, Evolution, Reproduction & Biotechnology',
      notesCount: filteredNotes.filter(n => n.subject === 'Biology').length,
      lecturesCount: filteredLectures.filter(l => l.subject === 'Biology').length,
      dppCount: filteredDPPs.filter(d => d.subject === 'Biology').length
    },
    {
      subject: 'English',
      icon: BookA,
      accentColor: 'text-violet-600',
      badgeBg: 'bg-violet-50 border-violet-200 text-violet-700',
      summary: 'Prose, Poetry, Reading Comprehension & Advanced Writing',
      notesCount: filteredNotes.filter(n => n.subject === 'English').length,
      lecturesCount: filteredLectures.filter(l => l.subject === 'English').length,
      dppCount: filteredDPPs.filter(d => d.subject === 'English').length
    }
  ];

  const coreSections = [
    {
      id: 'notes' as ActiveTab,
      title: 'Study Notes & PDFs',
      icon: BookOpen,
      iconBg: 'bg-red-50 text-red-600 border-red-200',
      count: filteredNotes.length,
      unit: 'Chapters Ready',
      description: 'Handwritten chapter notes, formula handbooks & NCERT derivations.',
      actionText: 'Browse Notes'
    },
    {
      id: 'lectures' as ActiveTab,
      title: 'Video Lectures',
      icon: Video,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
      count: filteredLectures.length,
      unit: 'Video Classes',
      description: 'Topic-wise concept video lectures with visual derivations and problem solving.',
      actionText: 'Watch Classes'
    },
    {
      id: 'dpp' as ActiveTab,
      title: 'Daily Practice Problems',
      icon: FileCheck,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      count: filteredDPPs.length,
      unit: 'Practice Sheets',
      description: 'Daily practice problem sheets with step-by-step solutions.',
      actionText: 'Solve Problems'
    },
    {
      id: 'tests' as ActiveTab,
      title: 'Online Mock Tests',
      icon: BarChart3,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      count: 3,
      unit: 'Scheduled Tests',
      description: 'Timed CBT mock exams with negative marking and instant rank assessment.',
      actionText: 'View Tests'
    }
  ];

  return (
    <div className="space-y-7 pb-20">
      {/* 1. HERO BANNER - Attractive Gradient & Student Command Center */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white p-6 sm:p-9 shadow-xl border border-slate-800/80 overflow-hidden">
        {/* Ambient atmospheric glow rings */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-red-300 border border-white/10 mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>CD ACADEMY • Har Bachha Padhega</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {greeting}, {user?.fullName || 'Student'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Welcome to your master learning workspace. Explore high-yield handwritten notes, topic-wise video classes, and daily practice problem sheets.
          </p>

          {/* Interactive Class Switcher & Metrics Strip */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Curriculum:
              </span>
              <div className="inline-flex bg-black/50 backdrop-blur-md p-1 rounded-2xl border border-white/15">
                {(['Class 11', 'Class 12'] as ClassLevel[]).map(cls => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      selectedClass === cls
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{selectedClass} Enrolled</span>
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1 text-amber-300">
                <Flame className="w-3.5 h-3.5" />
                <span>Active Learning Batch</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. QUICK LEARNING HUB (Icon Type Grid) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Quick Learning Hub
              </h2>
              <p className="text-xs text-slate-500">
                1-tap direct shortcuts for {selectedClass} curriculum
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('icon')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'icon'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-red-600" />
              <span>Icon View</span>
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'card'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5 text-slate-600" />
              <span>Card View</span>
            </button>
          </div>
        </div>

        {/* ICON VIEW (Attractive Squircle Grid) */}
        {viewMode === 'icon' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5 animate-in fade-in duration-200">
            {iconTypeItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => item.onClick ? item.onClick() : onNavigateTab(item.id)}
                  className="group relative flex flex-col items-center text-center p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-red-300 transition-all duration-200 cursor-pointer active:scale-95"
                >
                  {/* Badge */}
                  <span
                    className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-2xs ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>

                  {/* Icon Squircle */}
                  <div
                    className={`w-13 h-13 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${item.bgColor}`}
                  >
                    <Icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>

                  {/* Text */}
                  <span className="text-xs font-bold text-slate-900 mt-2.5 group-hover:text-red-600 transition truncate w-full">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium truncate w-full mt-0.5">
                    {item.sublabel}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          /* CARD VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
            {coreSections.map(section => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  onClick={() => onNavigateTab(section.id)}
                  className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-red-300 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-2xl border ${section.iconBg} shadow-2xs`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {section.count} {section.unit}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 group-hover:text-red-600 transition">
                      {section.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {section.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-600 group-hover:translate-x-1 transition-transform">
                    <span>{section.actionText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. SUBJECT MASTERY CARDS (Interactive Course Grid) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {selectedClass} Subject Modules
            </h2>
            <p className="text-xs text-slate-500">
              Complete syllabus coverage with NCERT line-by-line & board exam derivation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectCards.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.subject}
                className="group bg-slate-50/70 hover:bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-red-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                        <Icon className={`w-5 h-5 ${card.accentColor}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-red-600 transition">
                          {card.subject}
                        </h3>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {selectedClass} Foundation
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                    {card.summary}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200/60 font-medium">
                    <span>{card.notesCount} Notes</span>
                    <span aria-hidden="true">·</span>
                    <span>{card.lecturesCount} Lectures</span>
                    <span aria-hidden="true">·</span>
                    <span>{card.dppCount} DPPs</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-2">
                  <button
                    onClick={() => onNavigateTab('notes')}
                    className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition text-center"
                  >
                    View Notes
                  </button>
                  <button
                    onClick={() => onNavigateTab('lectures')}
                    className="w-full py-2 bg-slate-900 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition text-center shadow-2xs"
                  >
                    Watch Classes
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. FEATURED LECTURE & LATEST NOTES SHOWCASE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Featured Video Lecture */}
        {recentLecture && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-red-600 fill-red-600" />
                  <span>Featured Video Masterclass</span>
                </span>
                <span className="text-xs font-bold text-red-600">
                  {recentLecture.subject}
                </span>
              </div>

              <div
                onClick={() => onOpenVideo(recentLecture)}
                className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group mb-3.5 shadow-sm"
              >
                <img
                  src={recentLecture.thumbnailUrl}
                  alt={recentLecture.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                />
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition flex items-center justify-center">
                  <div className="w-13 h-13 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{recentLecture.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-700">{recentLecture.classLevel}</span>
                <span aria-hidden="true">·</span>
                <span>{recentLecture.chapter}</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 line-clamp-1 leading-snug">
                {recentLecture.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {recentLecture.description}
              </p>
            </div>

            <button
              onClick={() => onOpenVideo(recentLecture)}
              className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Play Video Lecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Latest Chapter Handwritten Notes */}
        {recentNote && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>Latest Handwritten Notes</span>
                </span>
                <span className="text-xs font-bold text-red-600">
                  {recentNote.subject}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-3.5">
                <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 font-medium">
                  <span className="font-bold text-red-600 uppercase text-[11px]">
                    PDF Notes
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{recentNote.fileSize}</span>
                  <span aria-hidden="true">·</span>
                  <span>{recentNote.pageCount} Pages</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug">
                  {recentNote.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {recentNote.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Chapter: <strong className="text-slate-700">{recentNote.chapter}</strong></span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => onOpenPdf(recentNote)}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Read Notes</span>
              </button>
              <button
                onClick={() => onNavigateTab('notes')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <span>Browse All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Android APK Download & Installation Modal */}
      <ApkDownloadModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
      />
    </div>
  );
};
