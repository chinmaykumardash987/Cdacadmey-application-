import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BarChart3, Clock, HelpCircle, CheckCircle, Calendar, Sparkles, Award } from 'lucide-react';

export const TestsSection: React.FC = () => {
  const { selectedClass } = useAuth();

  const testSchedules = [
    {
      id: 'test-1',
      title: `${selectedClass} Physics - Weekly Chapter Mock Test 01`,
      subject: 'Physics',
      date: 'Next Sunday, 10:00 AM IST',
      duration: '60 mins',
      totalQuestions: 30,
      marks: 120,
      status: 'upcoming'
    },
    {
      id: 'test-2',
      title: `${selectedClass} Chemistry - Atomic Structure & Periodic Table`,
      subject: 'Chemistry',
      date: 'Upcoming Wednesday, 06:00 PM IST',
      duration: '45 mins',
      totalQuestions: 25,
      marks: 100,
      status: 'upcoming'
    },
    {
      id: 'test-3',
      title: `${selectedClass} Mathematics - Full Length Foundation Test`,
      subject: 'Mathematics',
      date: 'Coming Soon',
      duration: '90 mins',
      totalQuestions: 40,
      marks: 160,
      status: 'draft'
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {selectedClass} Online Test Series & CBT Portal
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Chapter tests, timing simulations, negative marking, and instant AI-ready result analysis
        </p>
      </div>

      {/* Feature Readiness Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-purple-300 mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architecture Prepared for Full CBT Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Upcoming Online Examination System
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            The CD ACADEMY test engine supports timed MCQ tests with single-choice, multiple-choice, numerical integer inputs, instant rank calculation, and deep strength/weakness analysis.
          </p>
        </div>
      </div>

      {/* Upcoming Test Schedule Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Scheduled Mock Tests ({selectedClass})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testSchedules.map(test => (
            <div
              key={test.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-200">
                    {test.subject}
                  </span>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200">
                    Upcoming
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-900">{test.title}</h4>

                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Questions</span>
                    <span className="text-xs font-bold text-slate-800">{test.totalQuestions}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Duration</span>
                    <span className="text-xs font-bold text-slate-800">{test.duration}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Total Marks</span>
                    <span className="text-xs font-bold text-slate-800">{test.marks}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  {test.date}
                </span>

                <button
                  type="button"
                  className="bg-slate-100 text-slate-500 font-bold px-3 py-1.5 rounded-lg text-xs cursor-not-allowed"
                >
                  Starts Soon
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
