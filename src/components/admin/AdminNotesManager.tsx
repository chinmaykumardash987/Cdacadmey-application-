import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { StorageService } from '../../services/storage';
import { Note, Subject, ClassLevel } from '../../types';
import { Plus, Search, Trash2, Edit2, Download, FileText, Check, X, AlertTriangle, Upload, Eye, Video, Youtube, ExternalLink, Play } from 'lucide-react';
import { extractYouTubeId, getYouTubeThumbnail, isValidYouTubeUrl } from '../../utils/youtube';

const ALL_SUBJECTS: Subject[] = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'];

interface AdminNotesManagerProps {
  onPreviewNote?: (note: Note) => void;
  onPreviewVideo?: (lecture: any) => void;
}

export const AdminNotesManager: React.FC<AdminNotesManagerProps> = ({ onPreviewNote, onPreviewVideo }) => {
  const { notes, addNote, updateNote, deleteNote } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>('All');
  const [filterSubject, setFilterSubject] = useState<string>('All');

  // Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>('Class 11');
  const [subject, setSubject] = useState<Subject>('Physics');
  const [chapter, setChapter] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('3.5 MB');
  const [pageCount, setPageCount] = useState<number>(20);
  const [tags, setTags] = useState('');
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
  const [youtubeVideoTitle, setYoutubeVideoTitle] = useState('');

  // Delete confirmation modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchClass = filterClass === 'All' || n.classLevel === filterClass;
      const matchSub = filterSubject === 'All' || n.subject === filterSubject;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.chapter.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q);
      return matchClass && matchSub && matchQuery;
    });
  }, [notes, filterClass, filterSubject, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingNote(null);
    setTitle('');
    setClassLevel('Class 11');
    setSubject('Physics');
    setChapter('');
    setDescription('');
    setFileUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    setFileName('Study_Notes.pdf');
    setFileSize('3.2 MB');
    setPageCount(18);
    setTags('');
    setYoutubeVideoUrl('');
    setYoutubeVideoTitle('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setClassLevel(note.classLevel);
    setSubject(note.subject);
    setChapter(note.chapter);
    setDescription(note.description);
    setFileUrl(note.fileUrl);
    setFileName(note.fileName);
    setFileSize(note.fileSize);
    setPageCount(note.pageCount);
    setTags((note.tags || []).join(', '));
    setYoutubeVideoUrl(note.youtubeVideoUrl || '');
    setYoutubeVideoTitle(note.youtubeVideoTitle || '');
    setIsModalOpen(true);
  };

  // Local file upload handler converting to object URL / Base64 for instant testing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chapter.trim()) {
      alert('Please fill in title and chapter');
      return;
    }

    const parsedTags = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingNote) {
      // Update
      await updateNote(editingNote.id, {
        title,
        classLevel,
        subject,
        chapter,
        description,
        fileUrl,
        fileName,
        fileSize,
        pageCount: Number(pageCount) || 15,
        tags: parsedTags,
        youtubeVideoUrl: youtubeVideoUrl.trim() || undefined,
        youtubeVideoTitle: youtubeVideoTitle.trim() || (youtubeVideoUrl ? `${title} Video Lecture` : undefined)
      });
    } else {
      // Create
      await addNote({
        title,
        classLevel,
        subject,
        chapter,
        description,
        fileUrl,
        fileName: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
        fileSize: fileSize || '2.8 MB',
        pageCount: Number(pageCount) || 16,
        uploaderId: 'admin-1',
        uploaderName: 'Admin',
        tags: parsedTags,
        youtubeVideoUrl: youtubeVideoUrl.trim() || undefined,
        youtubeVideoTitle: youtubeVideoTitle.trim() || (youtubeVideoUrl ? `${title} Video Lecture` : undefined)
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Study Notes Management
          </h1>
          <p className="text-xs text-slate-500">
            Upload, update, search and manage Class 11 and Class 12 chapter PDF materials
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Note</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <select
          value={filterClass}
          onChange={e => setFilterClass(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="All">All Classes (Class 11 & 12)</option>
          <option value="Class 11">Class 11</option>
          <option value="Class 12">Class 12</option>
        </select>

        <select
          value={filterSubject}
          onChange={e => setFilterSubject(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="All">All Subjects</option>
          {ALL_SUBJECTS.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Notes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Title & Description</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3">Chapter</th>
                <th className="py-3 px-3">Pages / Size</th>
                <th className="py-3 px-3">Uploaded</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No notes found. Click "Upload New Note" to add one!
                  </td>
                </tr>
              ) : (
                filteredNotes.map(n => (
                  <tr key={n.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 text-sm line-clamp-1">{n.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{n.description}</div>
                      {n.youtubeVideoUrl && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 w-fit px-1.5 py-0.5 rounded border border-red-200">
                          <Youtube className="w-3 h-3 text-red-600" />
                          <span>Attached Video Available</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100">{n.classLevel}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-red-700">
                      <span className="px-2 py-0.5 rounded bg-red-50 border border-red-200">
                        {n.subject}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{n.chapter}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {n.pageCount} pgs • {n.fileSize}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {n.youtubeVideoUrl && onPreviewVideo && (
                          <button
                            onClick={() =>
                              onPreviewVideo({
                                id: `lec-attached-${n.id}`,
                                title: n.youtubeVideoTitle || `${n.title} (Video Lecture)`,
                                classLevel: n.classLevel,
                                subject: n.subject,
                                chapter: n.chapter,
                                lectureNumber: 'Ex',
                                description: n.description,
                                videoUrl: n.youtubeVideoUrl!,
                                thumbnailUrl: getYouTubeThumbnail(n.youtubeVideoUrl!) || '',
                                duration: 'Video Lecture',
                                uploaderId: 'admin-1',
                                createdAt: n.createdAt
                              })
                            }
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                            title="Watch Attached YouTube Lecture"
                          >
                            <Youtube className="w-3.5 h-3.5 text-red-600" />
                          </button>
                        )}
                        {onPreviewNote && (
                          <button
                            onClick={() => onPreviewNote(n)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                            title="Preview PDF"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditModal(n)}
                          className="p-1.5 hover:bg-slate-100 text-blue-600 rounded-lg transition"
                          title="Edit Note"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(n.id)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                          title="Delete Note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                {editingNote ? 'Edit Study Note' : 'Upload New Study Note'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Note Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Kinematics - Complete Formula Sheet & Notes"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Class & Subject */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Class *
                  </label>
                  <select
                    value={classLevel}
                    onChange={e => setClassLevel(e.target.value as ClassLevel)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject *
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value as Subject)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    {ALL_SUBJECTS.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chapter */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Chapter Name *
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={e => setChapter(e.target.value)}
                  placeholder="e.g. Motion in a Straight Line"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description / Topic Summary
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Key concepts, derivation highlights, NCERT exercise solutions..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* PDF File Upload or URL */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  PDF Document Upload
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                />
                <div className="mt-2">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Or PDF Web URL:</span>
                  <input
                    type="url"
                    value={fileUrl}
                    onChange={e => setFileUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* ATTACH FEATURE: LINK YOUTUBE VIDEO */}
              <div className="bg-red-50/60 p-3.5 rounded-xl border border-red-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                    <Youtube className="w-4 h-4 text-red-600" />
                    <span>Attach Feature: Link YouTube Video</span>
                  </label>
                  <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                    Optional Video Attachment
                  </span>
                </div>

                <p className="text-[11px] text-red-800 leading-tight">
                  Attach an explanatory YouTube video lecture to this study note. Students will see a direct "Watch Video" button on their notes screen!
                </p>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                      YouTube Video URL
                    </label>
                    <input
                      type="url"
                      value={youtubeVideoUrl}
                      onChange={e => setYoutubeVideoUrl(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      className="w-full px-2.5 py-1.5 bg-white border border-red-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                      Attached Video Title / Topic
                    </label>
                    <input
                      type="text"
                      value={youtubeVideoTitle}
                      onChange={e => setYoutubeVideoTitle(e.target.value)}
                      placeholder="e.g. Complete Kinematics Concept & Derivations Explained"
                      className="w-full px-2.5 py-1.5 bg-white border border-red-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Instant Live Preview of Attached YouTube Video */}
                {youtubeVideoUrl && isValidYouTubeUrl(youtubeVideoUrl) && (
                  <div className="mt-2 p-2 bg-white rounded-lg border border-red-200 flex items-center gap-2.5 animate-in fade-in">
                    <div className="relative w-20 aspect-video rounded overflow-hidden bg-black shrink-0">
                      <img
                        src={getYouTubeThumbnail(youtubeVideoUrl) || ''}
                        alt="YouTube Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 text-white fill-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-slate-900 truncate">
                        {youtubeVideoTitle || 'Attached Video Ready'}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                        <Check className="w-3 h-3" />
                        <span>Valid YouTube URL Verified</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Page Count and Tags */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Estimated Pages
                  </label>
                  <input
                    type="number"
                    value={pageCount}
                    onChange={e => setPageCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    placeholder="Formulas, NCERT, Derivations"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs"
                >
                  {editingNote ? 'Save Changes' : 'Publish Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl text-center">
            <AlertTriangle className="w-10 h-10 text-red-600 mx-auto mb-2" />
            <h3 className="font-bold text-base text-slate-900">Delete this Note?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              This action cannot be undone. Students will no longer be able to view or download this note.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
