import React from 'react';
import { X, Play, Clock, BookOpen, ExternalLink, CheckCircle } from 'lucide-react';
import { Lecture } from '../../types';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: Lecture | null;
  onOpenNotes?: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  lecture,
  onOpenNotes
}) => {
  if (!isOpen || !lecture) return null;

  // Extract YouTube ID if valid
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      }
      if (url.includes('youtube.com/embed/')) {
        return url;
      }
    } catch {
      // fallback
    }
    return url;
  };

  const embedUrl = getEmbedUrl(lecture.videoUrl);
  const isEmbeddable = embedUrl.includes('youtube.com/embed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-md">
              Lec {lecture.lectureNumber}
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-white truncate">{lecture.title}</h3>
              <p className="text-xs text-slate-300 truncate">
                {lecture.classLevel} • {lecture.subject} • {lecture.chapter}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative w-full aspect-video bg-black shrink-0">
          {isEmbeddable ? (
            <iframe
              src={embedUrl}
              title={lecture.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white p-6 bg-slate-900">
              <Play className="w-12 h-12 text-red-500 mb-3" />
              <p className="text-base font-bold text-white mb-2">Streaming Video Link</p>
              <p className="text-xs text-slate-400 max-w-md text-center mb-4 truncate">{lecture.videoUrl}</p>
              <a
                href={lecture.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                <span>Watch on Video Provider</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Video Information & Actions */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                  {lecture.subject}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {lecture.duration}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{lecture.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Instructor: {lecture.uploaderName || 'CD ACADEMY Faculty'} • Added on{' '}
                {new Date(lecture.createdAt).toLocaleDateString()}
              </p>
            </div>

            {onOpenNotes && (
              <button
                onClick={onOpenNotes}
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition shrink-0 border border-slate-300"
              >
                <BookOpen className="w-4 h-4 text-red-600" />
                <span>View Chapter Notes</span>
              </button>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Lecture Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {lecture.description}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Study Tip:</strong> Watch at 1.0x or 1.25x speed, maintain running notes, and solve the matching DPP
              after completing this lecture!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
