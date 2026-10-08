import React, { useState, useMemo } from 'react';
import { StorageService } from '../../services/storage';
import { User, ClassLevel } from '../../types';
import { Users, Search, Power, CheckCircle, Ban, Filter, Phone, Mail, Calendar, ShieldAlert, Eye, X, BookOpen, Award, IdCard } from 'lucide-react';

export const AdminStudentManager: React.FC = () => {
  const [students, setStudents] = useState<User[]>(() => StorageService.getStudents());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [inspectStudent, setInspectStudent] = useState<User | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchClass = filterClass === 'All' || student.classLevel === filterClass;
      const matchStatus = filterStatus === 'All' || student.status === filterStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        student.fullName.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        student.phone.includes(q);

      return matchClass && matchStatus && matchQuery;
    });
  }, [students, filterClass, filterStatus, searchQuery]);

  const handleToggleStatus = (id: string) => {
    const updated = StorageService.toggleStudentStatus(id);
    if (updated) {
      setStudents(StorageService.getStudents());
      if (inspectStudent && inspectStudent.id === id) {
        setInspectStudent(updated);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Registered Student Management
          </h1>
          <p className="text-xs text-slate-500">
            Monitor registered student accounts, manage Class 11 & 12 enrollments, and toggle account access
          </p>
        </div>

        <div className="bg-slate-100 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 self-start sm:self-auto">
          Total Enrolled: {students.length} Students
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or mobile..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <select
          value={filterClass}
          onChange={e => setFilterClass(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="All">All Classes (Class 11 & 12)</option>
          <option value="Class 11">Class 11 Students</option>
          <option value="Class 12">Class 12 Students</option>
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="All">All Account Statuses</option>
          <option value="active">Active Only</option>
          <option value="suspended">Suspended Only</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Mobile Number</th>
                <th className="py-3 px-3">Enrolled Class</th>
                <th className="py-3 px-3">Registration Date</th>
                <th className="py-3 px-3">Account Status</th>
                <th className="py-3 px-4 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No students match your query.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const isActive = student.status === 'active';
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {student.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-bold text-slate-900 text-sm">{student.fullName}</div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                        {student.email}
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {student.phone}
                      </td>
                      <td className="py-3 px-3 font-semibold">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                          {student.classLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px] font-mono">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <Ban className="w-3 h-3 text-red-600" />
                              <span>Suspended</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectStudent(student)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                            title="View Student Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(student.id)}
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                              isActive
                                ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            <Power className="w-3 h-3" />
                            <span>{isActive ? 'Disable Access' : 'Enable Access'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
