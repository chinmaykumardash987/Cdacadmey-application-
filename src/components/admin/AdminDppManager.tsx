import React, { useState, useMemo } from 'react';
import { StorageService } from '../../services/storage';
import { DPP, Subject, ClassLevel } from '../../types';
import { Plus, Search, Trash2, Edit2, FileCheck, X, AlertTriangle, Eye, Upload, Youtube, Check, Play } from 'lucide-react';
import { extractYouTubeId, getYouTubeThumbnail, isValidYouTubeUrl } from '../../utils/youtube';

const ALL_SUBJECTS: Subject[] = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'];

interface AdminDppManagerProps {
  onPreviewDpp?: (dpp: DPP) => void;
  onPreviewVideo?: (lecture: any) => void;
}

export const AdminDppManager: React.FC<AdminDppManagerProps> = ({ onPreviewDpp, onPreviewVideo }) => {
  const [dpps, setDpps] = useState<DPP[]>(() => StorageService.getDPPs());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>('All');
  const [filterSubject, setFilterSubject] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDpp, setEditingDpp] = useState<DPP | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>('Class 11');
  const [subject, setSubject] = useState<Subject>('Physics');
  const [chapter, setChapter] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [questionsCount, setQuestionsCount] = useState<number>(15);
  const [maxMarks, setMaxMarks] = useState<number>(60);
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
  const [youtubeVideoTitle, setYoutubeVideoTitle] = useState('');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredDpps = useMemo(() => {
    return dpps.filter(d => {
      const matchClass = filterClass === 'All' || d.classLevel === filterClass;
      const matchSub = filterSubject === 'All' || d.subject === filterSubject;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.chapter.toLowerCase().includes(q) ||
        d.subject.toLowerCase().includes(q);
      return matchClass && matchSub && matchQuery;
    });
  }, [dpps, filterClass, filterSubject, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingDpp(null);
    setTitle(`DPP #${dpps.length + 1} - `);
    setClassLevel('Class 11');
    setSubject('Physics');
    setChapter('');
    setDescription('Practice questions for mastery with step-by-step solutions.');
    setFileUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    setQuestionsCount(15);
    setMaxMarks(60);
    setYoutubeVideoUrl('');
    setYoutubeVideoTitle('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dpp: DPP) => {
    setEditingDpp(dpp);
    setTitle(dpp.title);
    setClassLevel(dpp.classLevel);
    setSubject(dpp.subject);
    setChapter(dpp.chapter);
    setDescription(dpp.description);
    setFileUrl(dpp.fileUrl);
    setQuestionsCount(dpp.questionsCount);
    setMaxMarks(dpp.maxMarks || 60);
    setYoutubeVideoUrl(dpp.youtubeVideoUrl || '');
    setYoutubeVideoTitle(dpp.youtubeVideoTitle || '');
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chapter.trim()) {
      alert('Please fill in title and chapter');
      return;
    }

    if (editingDpp) {
      const updated = StorageService.updateDPP(editingDpp.id, {
        title,
        classLevel,
        subject,
        chapter,
        description,
        fileUrl,
        questionsCount: Number(questionsCount) || 15,
        maxMarks: Number(maxMarks) || 60,
        youtubeVideoUrl: youtubeVideoUrl.trim() || undefined,
        youtubeVideoTitle: youtubeVideoTitle.trim() || (youtubeVideoUrl ? `${title} Video Solution` : undefined)
      });
      if (updated) {
        setDpps(StorageService.getDPPs());
      }
    } else {
      StorageService.addDPP({
        title,
        classLevel,
        subject,
        chapter,
        description,
        fileUrl,
        questionsCount: Number(questionsCount) || 15,
        maxMarks: Number(maxMarks) || 60,
        uploaderId: 'admin-1',
        uploaderName: 'Admin',
        youtubeVideoUrl: youtubeVideoUrl.trim() || undefined,
        youtubeVideoTitle: youtubeVideoTitle.trim() || (youtubeVideoUrl ? `${title} Video Solution` : undefined)
      });
      setDpps(StorageService.getDPPs());
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    StorageService.deleteDPP(id);
    setDpps(StorageService.getDPPs());
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            DPP (Daily Practice Problems) Management
          </h1>
          <p className="text-xs text-slate-500">
            Create, upload, update and configure question sheets for Class 11 and 12
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New DPP</span>
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
            placeholder="Search DPP sheets..."
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

      {/* DPP Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">DPP Title</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3">Chapter</th>
                <th className="py-3 px-3">Questions / Marks</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDpps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No DPP sheets found. Click "Upload New DPP" to add one!
                  </td>
                </tr>
              ) : (
                filteredDpps.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 text-sm line-clamp-1">{d.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{d.description}</div>
                      {d.youtubeVideoUrl && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 w-fit px-1.5 py-0.5 rounded border border-emerald-200">
                          <Youtube className="w-3 h-3 text-red-600" />
                          <span>Video Solution Attached</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100">{d.classLevel}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                        {d.subject}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{d.chapter}</td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {d.questionsCount} Qs • {d.maxMarks || 60} M
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {d.youtubeVideoUrl && onPreviewVideo && (
                          <button
                            onClick={() =>
                              onPreviewVideo({
                                id: `dpp-video-${d.id}`,
                                title: d.youtubeVideoTitle || `${d.title} (Solution Video)`,
                                classLevel: d.classLevel,
                                subject: d.subject,
                                chapter: d.chapter,
                                lectureNumber: 'Sol',
                                description: d.description,
                                videoUrl: d.youtubeVideoUrl!,
                                thumbnailUrl: getYouTubeThumbnail(d.youtubeVideoUrl!) || '',
                                duration: 'Video Solution',
                                uploaderId: 'admin-1',
                                createdAt: d.createdAt
                              })
                            }
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                            title="Watch YouTube Solution Video"
                          >
                            <Youtube className="w-3.5 h-3.5 text-red-600" />
                          </button>
                        )}
                        {onPreviewDpp && (
                          <button
                            onClick={() => onPreviewDpp(d)}
                            className="p-1.5 hover:bg-slate-100 text-emerald-600 rounded-lg transition"
                            title="Preview DPP"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditModal(d)}
                          className="p-1.5 hover:bg-slate-100 text-blue-600 rounded-lg transition"
                          title="Edit DPP"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(d.id)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                          title="Delete DPP"
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

      {/* Add / Edit DPP Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                {editingDpp ? 'Edit DPP Sheet' : 'Upload New DPP Sheet'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  DPP Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. DPP #02 - Motion Under Gravity & Free Fall"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

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

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Question distribution, target difficulty, instructions..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  DPP Question PDF File
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-emerald-600 file:text-white"
                />
                <div className="mt-2">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Or PDF URL:</span>
                  <input
                    type="url"
                    value={fileUrl}
                    onChange={e => setFileUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* ATTACH FEATURE: LINK YOUTUBE VIDEO SOLUTION */}
              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                    <Youtube className="w-4 h-4 text-red-600" />
                    <span>Attach Feature: Link YouTube Video Solution</span>
                  </label>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    Optional Video Solution
                  </span>
                </div>

                <p className="text-[11px] text-emerald-800 leading-tight">
                  Attach a YouTube video walkthrough explaining the solutions to these practice questions!
                </p>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                      YouTube Solution Video URL
                    </label>
                    <input
                      type="url"
                      value={youtubeVideoUrl}
                      onChange={e => setYoutubeVideoUrl(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                      Solution Video Title / Topic
                    </label>
                    <input
                      type="text"
                      value={youtubeVideoTitle}
                      onChange={e => setYoutubeVideoTitle(e.target.value)}
                      placeholder="e.g. DPP Question 1 to 15 Full Step-by-Step Video Solution"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Instant Live Preview of Attached YouTube Video */}
                {youtubeVideoUrl && isValidYouTubeUrl(youtubeVideoUrl) && (
                  <div className="mt-2 p-2 bg-white rounded-lg border border-emerald-200 flex items-center gap-2.5 animate-in fade-in">
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
                        {youtubeVideoTitle || 'Attached Video Solution Ready'}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                        <Check className="w-3 h-3" />
                        <span>Valid YouTube URL Verified</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Questions Count
                  </label>
                  <input
                    type="number"
                    value={questionsCount}
                    onChange={e => setQuestionsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={e => setMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

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
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  {editingDpp ? 'Save Changes' : 'Publish DPP'}
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
            <h3 className="font-bold text-base text-slate-900">Delete DPP Sheet?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Are you sure you want to remove this practice sheet? This action cannot be reversed.
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
