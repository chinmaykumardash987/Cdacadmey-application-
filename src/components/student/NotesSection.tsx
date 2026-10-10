import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StorageService } from '../../services/storage';
import { Note, Subject, ClassLevel } from '../../types';
import { Search, Filter, BookOpen, Download, Eye, FileText, Calendar, Tag, ChevronRight, Youtube, Play } from 'lucide-react';
import { getYouTubeThumbnail } from '../../utils/youtube';

interface NotesSectionProps {
  onOpenPdf: (note: Note) => void;
  onOpenVideo?: (lecture: any) => void;
}

const ALL_SUBJECTS: Subject[] = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'];

export const NotesSection: React.FC<NotesSectionProps> = ({ onOpenPdf, onOpenVideo }) => {
  const { selectedClass, setSelectedClass } = useAuth();
  const { notes: allNotes } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedChapter, setSelectedChapter] = useState<string>('All');

  // Filter notes by class, subject, chapter, and search
  const classNotes = useMemo(() => {
    return allNotes.filter(n => n.classLevel === selectedClass);
  }, [allNotes, selectedClass]);

  const uniqueChapters = useMemo(() => {
    const chapters = new Set<string>();
    classNotes.forEach(n => {
      if (selectedSubject === 'All' || n.subject === selectedSubject) {
        chapters.add(n.chapter);
      }
    });
    return Array.from(chapters);
  }, [classNotes, selectedSubject]);

  const filteredNotes = useMemo(() => {
    return classNotes.filter(note => {
      const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
      const matchesChapter = selectedChapter === 'All' || note.chapter === selectedChapter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        note.title.toLowerCase().includes(query) ||
        note.chapter.toLowerCase().includes(query) ||
        note.subject.toLowerCase().includes(query) ||
        note.description.toLowerCase().includes(query);

      return matchesSubject && matchesChapter && matchesSearch;
    });
  }, [classNotes, selectedSubject, selectedChapter, searchQuery]);

  const handleDownload = (note: Note, e: React.MouseEvent) => {
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

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Class Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-red-50 text-red-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Study Notes & PDF Material
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Handwritten notes, NCERT line-by-line summaries, and formula handbooks
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

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${selectedClass} notes by title, topic, or keyword...`}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
          />
        </div>

        {/* Subject Filter Pills */}
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

        {/* Chapter Sub-filter if available */}
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

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No Notes Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No notes match your selected filters. Try choosing "All Subjects" or resetting your search query.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubject('All');
              setSelectedChapter('All');
            }}
            className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => onOpenPdf(note)}
              className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-red-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase bg-red-50 text-red-700 px-2 py-0.5 rounded-md border border-red-200">
                      {note.subject}
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {note.classLevel}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3" />
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-red-600 transition leading-snug">
                  {note.title}
                </h3>

                <p className="text-xs font-semibold text-slate-700 mt-1">
                  Chapter: <span className="text-slate-900">{note.chapter}</span>
                </p>

                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {note.description}
                </p>

                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {note.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] font-medium">
                  {note.fileSize} • {note.pageCount} Pages
                </span>

                <div className="flex items-center gap-2">
                  {note.youtubeVideoUrl && onOpenVideo && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenVideo({
                          id: `note-video-${note.id}`,
                          title: note.youtubeVideoTitle || `${note.title} (Video Lecture)`,
                          classLevel: note.classLevel,
                          subject: note.subject,
                          chapter: note.chapter,
                          lectureNumber: 'Ex',
                          description: note.description,
                          videoUrl: note.youtubeVideoUrl!,
                          thumbnailUrl: getYouTubeThumbnail(note.youtubeVideoUrl!) || '',
                          duration: 'Video Lecture',
                          uploaderId: 'admin-1',
                          createdAt: note.createdAt
                        });
                      }}
                      className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2.5 py-1.5 rounded-lg border border-red-200 transition text-xs"
                      title="Watch Explanatory Video"
                    >
                      <Youtube className="w-4 h-4 text-red-600" />
                      <span className="hidden sm:inline">Watch Video</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleDownload(note, e)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-2xs transition text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Note</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
