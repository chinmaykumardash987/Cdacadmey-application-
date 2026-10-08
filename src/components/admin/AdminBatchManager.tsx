import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Batch } from '../../types';
import { Layers, Plus, Edit2, Trash2, Check, X, Search, Calendar, Users, DollarSign, Sparkles } from 'lucide-react';

export const AdminBatchManager: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>(() => StorageService.getBatches());
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  // Form fields
  const [batchName, setBatchName] = useState('');
  const [batchClass, setBatchClass] = useState('Class 11');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(3499);
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2027-03-31');
  const [status, setStatus] = useState<'active' | 'archived' | 'upcoming'>('active');

  const filteredBatches = batches.filter(b =>
    b.batchName.toLowerCase().includes(search.toLowerCase()) ||
    b.class.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingBatch(null);
    setBatchName('');
    setBatchClass('Class 11');
    setDescription('');
    setPrice(3499);
    setStartDate('2026-06-01');
    setEndDate('2027-03-31');
    setStatus('active');
    setShowAddModal(true);
  };

  const handleOpenEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setBatchName(batch.batchName);
    setBatchClass(batch.class);
    setDescription(batch.description);
    setPrice(batch.price || 0);
    setStartDate(batch.startDate || '');
    setEndDate(batch.endDate || '');
    setStatus(batch.status);
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim()) return;

    if (editingBatch) {
      StorageService.saveBatches(
        batches.map(b => b.batchId === editingBatch.batchId ? {
          ...b,
          batchName,
          class: batchClass,
          description,
          price,
          startDate,
          endDate,
          status
        } : b)
      );
      setBatches(StorageService.getBatches());
    } else {
      const created = StorageService.addBatch({
        batchName,
        class: batchClass,
        description,
        price,
        startDate,
        endDate,
        status,
        studentCount: 0
      });
      setBatches([created, ...batches]);
    }
    setShowAddModal(false);
  };

  const handleDelete = (batchId: string) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      StorageService.deleteBatch(batchId);
      setBatches(batches.filter(b => b.batchId !== batchId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Academic Batches</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Batch & Course Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, schedule and manage student batches and enrollment cohorts
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Batch</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search batches by name or class..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <span className="text-xs font-bold text-slate-500 px-2">
          {filteredBatches.length} Batches
        </span>
      </div>

      {/* Batch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBatches.map(b => (
          <div key={b.batchId} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  b.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                  b.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {b.status}
                </span>
                <span className="text-xs font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">
                  {b.class}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm mb-1.5 line-clamp-1">
                {b.batchName}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                {b.description}
              </p>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3.5">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  <span>Fee: <strong className="text-slate-800">₹{b.price}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Enrolled: <strong className="text-slate-800">{b.studentCount || 0}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                  title="Edit Batch"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(b.batchId)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                  title="Delete Batch"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingBatch ? 'Edit Batch' : 'Create New Batch'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Batch Name *</label>
                <input
                  type="text"
                  value={batchName}
                  onChange={e => setBatchName(e.target.value)}
                  placeholder="e.g. UDAAN 1.0 (Class 11 Science)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Target Class *</label>
                  <select
                    value={batchClass}
                    onChange={e => setBatchClass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
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
                  {editingBatch ? 'Save Changes' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
