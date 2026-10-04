import React, { useState, useMemo } from 'react';
import { StorageService } from '../../services/storage';
import { Lecture, Subject, ClassLevel } from '../../types';
import { Plus, Search, Trash2, Edit2, Video, Play, X, AlertTriangle, ExternalLink, Youtube, Check, Sparkles } from 'lucide-react';
import { extractYouTubeId, getYouTubeThumbnail, isValidYouTubeUrl } from '../../utils/youtube';

const ALL_SUBJECTS: Subject[] = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'];

interface AdminLecturesManagerProps {
  onPreviewVideo?: (lecture: Lecture) => void;
}

export const AdminLecturesManager: React.FC<AdminLecturesManagerProps> = ({ onPreviewVideo }) => {
  const [lectures, setLectures] = useState<Lecture[]>(() => StorageService.getLectures());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>('All');
  const [filterSubject, setFilterSubject] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>('Class 11');
  const [subject, setSubject] = useState<Subject>('Physics');
  const [chapter, setChapter] = useState('');
  const [lectureNumber, setLectureNumber] = useState('01');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('45:00 min');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredLectures = useMemo(() => {
    return lectures.filter(l => {
      const matchClass = filterClass === 'All' || l.classLevel === filterClass;
      const matchSub = filterSubject === 'All' || l.subject === filterSubject;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.chapter.toLowerCase().includes(q) ||
        l.subject.toLowerCase().includes(q);
      return matchClass && matchSub && matchQuery;
    });
  }, [lectures, filterClass, filterSubject, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingLecture(null);
    setTitle('');
    setClassLevel('Class 11');
    setSubject('Physics');
    setChapter('');
    setLectureNumber(`0${lectures.length + 1}`);
    setDescription('');
    setVideoUrl('https://www.youtube.com/watch?v=b1t41Q3xRM8');
    setThumbnailUrl('https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80');
    setDuration('45:00 min');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lec: Lecture) => {
    setEditingLecture(lec);
    setTitle(lec.title);
    setClassLevel(lec.classLevel);
    setSubject(lec.subject);
    setChapter(lec.chapter);
    setLectureNumber(lec.lectureNumber);
    setDescription(lec.description);
    setVideoUrl(lec.videoUrl);
    setThumbnailUrl(lec.thumbnailUrl);
    setDuration(lec.duration);
    setIsModalOpen(true);
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chapter.trim() || !videoUrl.trim()) {
      alert('Please fill in lecture title, chapter and video URL');
      return;
    }

    if (editingLecture) {
      const updated = StorageService.updateLecture(editingLecture.id, {
        title,
        classLevel,
        subject,
        chapter,
        lectureNumber,
        description,
        videoUrl,
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
        duration
      });
      if (updated) {
        setLectures(StorageService.getLectures());
      }
    } else {
      StorageService.addLecture({
        title,
        classLevel,
        subject,
        chapter,
        lectureNumber,
        description,
        videoUrl,
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
        duration,
        uploaderId: 'admin-1',
        uploaderName: 'Admin'
      });
      setLectures(StorageService.getLectures());
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    StorageService.deleteLecture(id);
    setLectures(StorageService.getLectures());
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Video Lectures Management
          </h1>
          <p className="text-xs text-slate-500">
            Publish, edit, organize YouTube video URLs and class chapters
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lecture</span>
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
            placeholder="Search lectures..."
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

      {/* Lectures Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Lecture Info</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3">Chapter</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Date Added</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLectures.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No lectures found. Click "Add New Lecture" to get started!
                  </td>
                </tr>
              ) : (
                filteredLectures.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="bg-red-600 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded shrink-0">
                          #{l.lectureNumber}
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-sm truncate">{l.title}</div>
                          <div className="text-[10px] text-slate-400 truncate">{l.videoUrl}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100">{l.classLevel}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-blue-700">
                      <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                        {l.subject}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{l.chapter}</td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">{l.duration}</td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(l.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onPreviewVideo && (
                          <button
                            onClick={() => onPreviewVideo(l)}
                            className="p-1.5 hover:bg-slate-100 text-red-600 rounded-lg transition"
                            title="Play Video"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditModal(l)}
                          className="p-1.5 hover:bg-slate-100 text-blue-600 rounded-lg transition"
                          title="Edit Lecture"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(l.id)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                          title="Delete Lecture"
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

      {/* Add / Edit Lecture Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                {editingLecture ? 'Edit Video Lecture' : 'Add New Video Lecture'}
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
                  Lecture Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Lec 01: Introduction to Vectors and Coordinates"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Class *
                  </label>
                  <select
                    value={classLevel}
                    onChange={e => setClassLevel(e.target.value as ClassLevel)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
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
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    {ALL_SUBJECTS.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Lec Number
                  </label>
                  <input
                    type="text"
                    value={lectureNumber}
                    onChange={e => setLectureNumber(e.target.value)}
                    placeholder="01"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-center"
                  />
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
                  placeholder="e.g. Motion in a Plane"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                    <Youtube className="w-4 h-4 text-red-600" />
                    <span>YouTube or Video Streaming URL *</span>
                  </label>
                  {isValidYouTubeUrl(videoUrl) && (
                    <button
                      type="button"
                      onClick={() => {
                        const thumb = getYouTubeThumbnail(videoUrl, 'hq');
                        if (thumb) setThumbnailUrl(thumb);
                      }}
                      className="text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-Set YouTube Thumbnail</span>
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={e => {
                    const val = e.target.value;
                    setVideoUrl(val);
                    if (isValidYouTubeUrl(val) && (!thumbnailUrl || thumbnailUrl.includes('unsplash'))) {
                      const ytThumb = getYouTubeThumbnail(val, 'hq');
                      if (ytThumb) setThumbnailUrl(ytThumb);
                    }
                  }}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />

                {/* Instant YouTube Validation and Thumbnail Preview */}
                {videoUrl && isValidYouTubeUrl(videoUrl) && (
                  <div className="mt-2 p-2.5 bg-red-50/70 border border-red-200 rounded-xl flex items-center gap-3">
                    <div className="relative w-20 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                      <img
                        src={getYouTubeThumbnail(videoUrl) || ''}
                        alt="YouTube Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        YouTube Video Attached Successfully
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Ready for high definition playback in student app</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={e => setThumbnailUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                  <div className="mt-1.5">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Or upload image:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-slate-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder="45:00 min"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Topics covered, derivation details, key exam tricks..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                />
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
                  className="px-5 py-2 font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs"
                >
                  {editingLecture ? 'Save Changes' : 'Publish Lecture'}
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
            <h3 className="font-bold text-base text-slate-900">Delete Lecture?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Are you sure you want to remove this lecture? This action cannot be undone.
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
