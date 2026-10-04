import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { Lecture, Subject, ClassLevel } from '../../types';
import { Video, Search, Play, Clock, Calendar, CheckCircle2, BookOpen } from 'lucide-react';

interface LecturesSectionProps {
  onOpenVideo: (lecture: Lecture) => void;
  onOpenNotes?: (noteTitle?: string) => void;
}

const ALL_SUBJECTS: Subject[] = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'];

export const LecturesSection: React.FC<LecturesSectionProps> = ({
  onOpenVideo,
  onOpenNotes
}) => {
  const { selectedClass, setSelectedClass } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedChapter, setSelectedChapter] = useState<string>('All');

  const allLectures = StorageService.getLectures();

  const classLectures = useMemo(() => {
    return allLectures.filter(l => l.classLevel === selectedClass);
  }, [allLectures, selectedClass]);

  const uniqueChapters = useMemo(() => {
    const chapters = new Set<string>();
    classLectures.forEach(l => {
      if (selectedSubject === 'All' || l.subject === selectedSubject) {
        chapters.add(l.chapter);
      }
    });
    return Array.from(chapters);
  }, [classLectures, selectedSubject]);

  const filteredLectures = useMemo(() => {
    return classLectures.filter(lec => {
      const matchesSubject = selectedSubject === 'All' || lec.subject === selectedSubject;
      const matchesChapter = selectedChapter === 'All' || lec.chapter === selectedChapter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lec.title.toLowerCase().includes(q) ||
        lec.chapter.toLowerCase().includes(q) ||
        lec.subject.toLowerCase().includes(q) ||
        lec.description.toLowerCase().includes(q);

      return matchesSubject && matchesChapter && matchesSearch;
    });
  }, [classLectures, selectedSubject, selectedChapter, searchQuery]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Class Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Video className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Video Lectures & Masterclasses
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            High quality video lectures with visual derivations, animations & solved problems
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

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${selectedClass} video lectures...`}
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

      {/* Lectures Grid */}
      {filteredLectures.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No Lectures Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No video lectures match your current filters. Clear filters or switch subjects to discover available lectures.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubject('All');
              setSelectedChapter('All');
            }}
            className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLectures.map(lecture => (
            <div
              key={lecture.id}
              onClick={() => onOpenVideo(lecture)}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md hover:border-red-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={lecture.thumbnailUrl}
                    alt={lecture.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Play className="w-5 h-5 ml-0.5 fill-white" />
                    </div>
                  </div>

                  {/* Badges on video */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                      Lec {lecture.lectureNumber}
                    </span>
                    <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {lecture.subject}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{lecture.duration}</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4">
                  <p className="text-[11px] font-semibold text-slate-500 mb-1">
                    {lecture.classLevel} • {lecture.chapter}
                  </p>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-red-600 transition line-clamp-2 leading-snug">
                    {lecture.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {lecture.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px] truncate">
                  By {lecture.uploaderName || 'CD ACADEMY Faculty'}
                </span>

                <button
                  type="button"
                  className="font-bold text-red-600 group-hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Play Lecture</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
