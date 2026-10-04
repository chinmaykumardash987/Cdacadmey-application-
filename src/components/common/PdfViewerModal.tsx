import React, { useState } from 'react';
import { X, Download, FileText, ZoomIn, ZoomOut, RotateCw, ExternalLink, CheckCircle, Youtube } from 'lucide-react';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subject: string;
  chapter: string;
  fileUrl: string;
  fileName?: string;
  pageCount?: number;
  fileSize?: string;
  youtubeVideoUrl?: string;
  onOpenVideo?: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  title,
  subject,
  chapter,
  fileUrl,
  fileName = 'CD_Academy_Document.pdf',
  pageCount = 12,
  fileSize = '3.5 MB',
  youtubeVideoUrl,
  onOpenVideo
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloaded(true);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-red-600/90 text-white rounded-lg shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-white truncate">{title}</h3>
              <p className="text-xs text-slate-300 truncate">
                {subject} • {chapter} • {fileSize} • {pageCount} Pages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {youtubeVideoUrl && onOpenVideo && (
              <button
                onClick={() => {
                  onClose();
                  onOpenVideo();
                }}
                className="flex items-center gap-1.5 bg-red-700/80 hover:bg-red-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition border border-red-500/40"
                title="Watch Attached YouTube Lecture"
              >
                <Youtube className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Watch Video</span>
              </button>
            )}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
              {downloaded ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download PDF</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
              className="p-1 hover:bg-white rounded border border-slate-300 transition"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700 w-12 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(160, prev + 15))}
              className="p-1 hover:bg-white rounded border border-slate-300 transition"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 hover:bg-white rounded border border-slate-300 transition"
              title="Reset Zoom"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
          >
            <span>Open in new tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Document Body / Viewer */}
        <div className="flex-1 bg-slate-200 overflow-auto p-4 sm:p-8 flex justify-center">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-2xl bg-white rounded-lg shadow-lg border border-slate-300 min-h-[600px] p-6 sm:p-10 transition-transform flex flex-col justify-between"
          >
            <div>
              {/* Header inside paper */}
              <div className="border-b-2 border-red-600 pb-4 mb-6 flex justify-between items-start">
                <div>
                  <div className="text-xs uppercase tracking-widest font-extrabold text-red-600">
                    CD ACADEMY OFFICIAL STUDY MATERIAL
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{title}</h1>
                  <div className="text-xs text-slate-500 mt-1">
                    Subject: <span className="font-semibold text-slate-700">{subject}</span> | Chapter:{' '}
                    <span className="font-semibold text-slate-700">{chapter}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-1 rounded-md border border-red-200">
                    VERIFIED CONTENT
                  </span>
                </div>
              </div>

              {/* Sample Document Content Rendering */}
              <div className="space-y-4 text-slate-700 text-sm leading-relaxed font-sans">
                <div className="p-3 bg-red-50/50 rounded-lg border-l-4 border-red-600 text-xs">
                  <p className="font-bold text-red-900">Summary & High-Yield Examination Note</p>
                  <p className="text-red-800 mt-0.5">
                    Prepared strictly according to the latest CBSE / State Board & Competitive Exam Syllabus.
                  </p>
                </div>

                <h4 className="font-bold text-slate-900 text-base mt-4">1. Core Concepts & Definitions</h4>
                <p>
                  In this chapter, all foundational theorems, physical quantities, derivations, and formulas are
                  systematically structured for rapid concept mastery and recall.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-900 block mb-1">Key Theorem / Law</span>
                    <p className="text-xs text-slate-600 font-mono">
                      F = dP/dt = m(dv/dt) = m·a
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-900 block mb-1">Dimensional Formula</span>
                    <p className="text-xs text-slate-600 font-mono">[M¹ L¹ T⁻²]</p>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-base">2. Standard Derivations & Diagrams</h4>
                <p>
                  All step-by-step calculus proofs, graphical interpretations, and diagrammatic explanations are
                  contained in this verified PDF.
                </p>

                <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center my-6">
                  <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-800 text-sm">{fileName}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Click download to save the full high-resolution PDF document to your device.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="mt-3 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF ({fileSize})
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 pt-4 mt-8 flex justify-between items-center text-[10px] text-slate-400">
              <span>CD ACADEMY • Har Bachha Padhega</span>
              <span>Page 1 of {pageCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
