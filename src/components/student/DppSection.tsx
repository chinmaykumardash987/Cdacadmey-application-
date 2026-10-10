import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StorageService } from '../../services/storage';
import { DPP, Subject, ClassLevel } from '../../types';
import { FileCheck, Search, Download, Eye, CheckCircle2, Award, Calendar, HelpCircle, Youtube } from 'lucide-react';
import { getYouTubeThumbnail } from '../../utils/youtube';

interface DppSectionProps {
  onOpenPdf: (dpp: any) => void;
  onOpenVideo?: (lecture: any) => void;
}

const ALL_SUBJECTS: Subject[] = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'];

export const DppSection: React.FC<DppSectionProps> = ({ onOpenPdf, onOpenVideo }) => {
  const { selectedClass, setSelectedClass } = useAuth();
  const { dpps: allDPPs } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedChapter, setSelectedChapter] = useState<string>('All');
  const [completedDpps, setCompletedDpps] = useState<Record<string, boolean>>({});

  const classDPPs = useMemo(() => {
    return allDPPs.filter(d => d.classLevel === selectedClass);
  }, [allDPPs, selectedClass]);

  const uniqueChapters = useMemo(() => {
    const chapters = new Set<string>();
    classDPPs.forEach(d => {
      if (selectedSubject === 'All' || d.subject === selectedSubject) {
        chapters.add(d.chapter);
      }
    });
    return Array.from(chapters);
  }, [classDPPs, selectedSubject]);

  const filteredDPPs = useMemo(() => {
    return classDPPs.filter(dpp => {
      const matchesSubject = selectedSubject === 'All' || dpp.subject === selectedSubject;
      const matchesChapter = selectedChapter === 'All' || dpp.chapter === selectedChapter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        dpp.title.toLowerCase().includes(q) ||
        dpp.chapter.toLowerCase().includes(q) ||
        dpp.subject.toLowerCase().includes(q) ||
        dpp.description.toLowerCase().includes(q);

      return matchesSubject && matchesChapter && matchesSearch;
    });
  }, [classDPPs, selectedSubject, selectedChapter, searchQuery]);

  const toggleSolved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedDpps(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDownload = (dpp: DPP, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = dpp.fileUrl;
    link.download = `${dpp.title.replace(/\s+/g, '_')}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Class Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <FileCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Daily Practice Problems (DPP)
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Daily question sheets with step-by-step solutions to build speed and accuracy
          </p>
        </div>

        {/* Class Switcher */}
        <div className="flex items-center gap-2">
          {(['Class 11', 'Class 12'] as ClassLevel[]).map(cls => (
            <button
              key={cls}
              onClick={() => {
                setSelectedClass(cls);
                setSelectedChapter('All');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedClass === cls
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Online Test Readiness Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-emerald-900 block">
              Automated Scoring & Online Test Engine Ready
            </span>
            <span className="text-emerald-700">
              Solve questions on paper or download sheets. In upcoming updates, answer keys will be auto-evaluated!
            </span>
          </div>
        </div>
        <div className="bg-emerald-600 text-white px-3 py-1 rounded-full font-bold text-[11px] whitespace-nowrap self-end sm:self-auto">
          {Object.values(completedDpps).filter(Boolean).length} / {filteredDPPs.length} Solved
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${selectedClass} practice problem sheets...`}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
          />
        </div>

        {/* Subjects */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => {
              setSelectedSubject('All');
              setSelectedChapter('All');
            }}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
              selectedSubject === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Subjects
          </button>
          {ALL_SUBJECTS.map(subject => (
            <button
              key={subject}
              onClick={() => {
                setSelectedSubject(subject);
                setSelectedChapter('All');
              }}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
                selectedSubject === subject
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Chapter Subfilter */}
        {uniqueChapters.length > 0 && (
          <div className="flex items-center gap-2 text-xs pt-2 border-t border-slate-100">
            <span className="font-semibold text-slate-400 shrink-0">Chapter:</span>
            <select
              value={selectedChapter}
              onChange={e => setSelectedChapter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="All">All Chapters ({uniqueChapters.length})</option>
              {uniqueChapters.map(ch => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* DPP Grid */}
      {filteredDPPs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No DPP Sheets Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No practice problem sheets currently match your chosen criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubject('All');
              setSelectedChapter('All');
            }}
            className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDPPs.map(dpp => {
            const isSolved = !!completedDpps[dpp.id];
            return (
              <div
                key={dpp.id}
                onClick={() => onOpenPdf({ ...dpp, pageCount: 6, fileSize: '1.8 MB' })}
                className={`group bg-white rounded-2xl p-5 border shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
                  isSolved ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 hover:border-red-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                        {dpp.subject}
                      </span>
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {dpp.classLevel}
                      </span>
                      {dpp.questionsCount && (
                        <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-md">
                          {dpp.questionsCount} Questions
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => toggleSolved(dpp.id, e)}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1 transition ${
                        isSolved
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                      title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isSolved ? 'Solved' : 'Mark Done'}</span>
                    </button>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-red-600 transition leading-snug">
                    {dpp.title}
                  </h3>

                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    Chapter: <span className="text-slate-900">{dpp.chapter}</span>
                  </p>

                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {dpp.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(dpp.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {dpp.youtubeVideoUrl && onOpenVideo && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenVideo({
                            id: `dpp-video-${dpp.id}`,
                            title: dpp.youtubeVideoTitle || `${dpp.title} (Solution Video)`,
                            classLevel: dpp.classLevel,
                            subject: dpp.subject,
                            chapter: dpp.chapter,
                            lectureNumber: 'Sol',
                            description: dpp.description,
                            videoUrl: dpp.youtubeVideoUrl!,
                            thumbnailUrl: getYouTubeThumbnail(dpp.youtubeVideoUrl!) || '',
                            duration: 'Video Solution',
                            uploaderId: 'admin-1',
                            createdAt: dpp.createdAt
                          });
                        }}
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2.5 py-1.5 rounded-lg border border-red-200 transition text-xs"
                        title="Watch YouTube Video Solution"
                      >
                        <Youtube className="w-4 h-4 text-red-600" />
                        <span className="hidden sm:inline">Solution Video</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDownload(dpp, e)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                      title="Download DPP Sheet"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 bg-slate-900 group-hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg shadow-2xs transition text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Practice Now</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
