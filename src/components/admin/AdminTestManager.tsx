import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storage';
import { FirestoreDataService } from '../../services/firestoreData';
import { TestItem, TestQuestion, TestResultItem, Subject } from '../../types';
import { HelpCircle, Plus, Edit2, Trash2, Check, X, Search, Clock, Award, Users, Sparkles } from 'lucide-react';

export const AdminTestManager: React.FC = () => {
  const [tests, setTests] = useState<TestItem[]>(() => StorageService.getTests());
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingResults, setViewingResults] = useState<string | null>(null);
  const [resultsList, setResultsList] = useState<TestResultItem[]>([]);

  // Form
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<Subject>('Physics');
  const [targetClass, setTargetClass] = useState('Class 11');
  const [duration, setDuration] = useState(60);
  const [totalMarks, setTotalMarks] = useState(40);
  const [qText, setQText] = useState('');
  const [qOpt0, setQOpt0] = useState('');
  const [qOpt1, setQOpt1] = useState('');
  const [qOpt2, setQOpt2] = useState('');
  const [qOpt3, setQOpt3] = useState('');
  const [qCorrect, setQCorrect] = useState(0);

  const filteredTests = tests.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.class.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const questions: TestQuestion[] = [
      {
        id: `q-${Date.now()}-1`,
        question: qText || `Sample examination question for ${title}`,
        options: [qOpt0 || 'Option A', qOpt1 || 'Option B', qOpt2 || 'Option C', qOpt3 || 'Option D'],
        correctAnswer: qCorrect,
        marks: Math.round(totalMarks / 1)
      }
    ];

    const newTest = StorageService.addTest({
      title,
      subject,
      class: targetClass,
      duration,
      totalMarks,
      status: 'live',
      questions
    });

    setTests([newTest, ...tests]);
    setShowAddModal(false);
    // Reset form
    setTitle('');
    setQText('');
    setQOpt0('');
    setQOpt1('');
    setQOpt2('');
    setQOpt3('');
  };

  const handleViewResults = async (testId: string) => {
    setViewingResults(testId);
    try {
      const allResults = await FirestoreDataService.getStudentTestResults('all');
      setResultsList(allResults.filter(r => r.testId === testId));
    } catch {
      setResultsList([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Online CBT Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Test Series & Mock Exam Manager
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create mock tests, configure timed CBT examinations and review student submissions
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Test</span>
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search test series by title, subject or class..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <span className="text-xs font-bold text-slate-500 px-2">
          {filteredTests.length} Tests
        </span>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTests.map(t => (
          <div key={t.testId} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                  {t.subject}
                </span>
                <span className="text-xs font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">
                  {t.class}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm mb-2">{t.title}</h3>

              <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Duration</span>
                  <strong className="text-slate-800">{t.duration} Mins</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Marks</span>
                  <strong className="text-slate-800">{t.totalMarks} Pts</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Questions</span>
                  <strong className="text-slate-800">{t.questions?.length || 1}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[11px] text-slate-400 font-medium">
                {new Date(t.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleViewResults(t.testId)}
                className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 transition"
              >
                <span>Student Results ({resultsList.filter(r => r.testId === t.testId).length}) →</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Create New CBT Test</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Test Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Kinematics & Newton Laws Grand CBT"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value as Subject)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Class</label>
                  <select
                    value={targetClass}
                    onChange={e => setTargetClass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={e => setTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">Sample Question #1</span>
                <textarea
                  value={qText}
                  onChange={e => setQText(e.target.value)}
                  placeholder="Enter sample question text..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={qOpt0}
                    onChange={e => setQOpt0(e.target.value)}
                    placeholder="Option A"
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={qOpt1}
                    onChange={e => setQOpt1(e.target.value)}
                    placeholder="Option B"
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={qOpt2}
                    onChange={e => setQOpt2(e.target.value)}
                    placeholder="Option C"
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={qOpt3}
                    onChange={e => setQOpt3(e.target.value)}
                    placeholder="Option D"
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="mt-2">
                  <label className="block font-bold text-slate-600 text-[11px] mb-1">Correct Option</label>
                  <select
                    value={qCorrect}
                    onChange={e => setQCorrect(Number(e.target.value))}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Publish Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results View Modal */}
      {viewingResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Student Test Submissions</h3>
              <button onClick={() => setViewingResults(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {resultsList.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  No submissions recorded yet for this test.
                </div>
              ) : (
                resultsList.map(r => (
                  <div key={r.resultId} className="py-2.5 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-800 block">User ID: {r.userId.slice(0, 12)}</strong>
                      <span className="text-[11px] text-slate-400">{new Date(r.submittedAt).toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-emerald-600">{r.score}/{r.totalMarks}</span>
                      <span className="text-[10px] text-slate-400 block">{r.percentage}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
