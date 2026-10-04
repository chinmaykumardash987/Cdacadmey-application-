import { Note, Lecture, DPP, User, ClassLevel, Subject } from '../types';
import { INITIAL_NOTES, INITIAL_LECTURES, INITIAL_DPPS, INITIAL_STUDENTS } from './initialData';

const NOTES_KEY = 'cd_academy_notes_v1';
const LECTURES_KEY = 'cd_academy_lectures_v1';
const DPPS_KEY = 'cd_academy_dpps_v1';
const STUDENTS_KEY = 'cd_academy_students_v1';
const FIREBASE_CONFIG_KEY = 'cd_academy_firebase_config_v1';

export interface FirebaseCustomConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const StorageService = {
  // NOTES
  getNotes(): Note[] {
    try {
      const data = localStorage.getItem(NOTES_KEY);
      if (!data) {
        localStorage.setItem(NOTES_KEY, JSON.stringify(INITIAL_NOTES));
        return INITIAL_NOTES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTES;
    }
  },

  saveNotes(notes: Note[]): void {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  },

  addNote(noteData: Omit<Note, 'id' | 'createdAt'>): Note {
    const notes = this.getNotes();
    const newNote: Note = {
      ...noteData,
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newNote, ...notes];
    this.saveNotes(updated);
    return newNote;
  },

  updateNote(id: string, updates: Partial<Note>): Note | null {
    const notes = this.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return null;
    const updatedNote = { ...notes[index], ...updates };
    notes[index] = updatedNote;
    this.saveNotes(notes);
    return updatedNote;
  },

  deleteNote(id: string): boolean {
    const notes = this.getNotes();
    const filtered = notes.filter(n => n.id !== id);
    if (filtered.length === notes.length) return false;
    this.saveNotes(filtered);
    return true;
  },

  // LECTURES
  getLectures(): Lecture[] {
    try {
      const data = localStorage.getItem(LECTURES_KEY);
      if (!data) {
        localStorage.setItem(LECTURES_KEY, JSON.stringify(INITIAL_LECTURES));
        return INITIAL_LECTURES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_LECTURES;
    }
  },

  saveLectures(lectures: Lecture[]): void {
    localStorage.setItem(LECTURES_KEY, JSON.stringify(lectures));
  },

  addLecture(lectureData: Omit<Lecture, 'id' | 'createdAt'>): Lecture {
    const lectures = this.getLectures();
    const newLecture: Lecture = {
      ...lectureData,
      id: `lec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newLecture, ...lectures];
    this.saveLectures(updated);
    return newLecture;
  },

  updateLecture(id: string, updates: Partial<Lecture>): Lecture | null {
    const lectures = this.getLectures();
    const index = lectures.findIndex(l => l.id === id);
    if (index === -1) return null;
    const updated = { ...lectures[index], ...updates };
    lectures[index] = updated;
    this.saveLectures(lectures);
    return updated;
  },

  deleteLecture(id: string): boolean {
    const lectures = this.getLectures();
    const filtered = lectures.filter(l => l.id !== id);
    if (filtered.length === lectures.length) return false;
    this.saveLectures(filtered);
    return true;
  },

  // DPPS
  getDPPs(): DPP[] {
    try {
      const data = localStorage.getItem(DPPS_KEY);
      if (!data) {
        localStorage.setItem(DPPS_KEY, JSON.stringify(INITIAL_DPPS));
        return INITIAL_DPPS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DPPS;
    }
  },

  saveDPPs(dpps: DPP[]): void {
    localStorage.setItem(DPPS_KEY, JSON.stringify(dpps));
  },

  addDPP(dppData: Omit<DPP, 'id' | 'createdAt'>): DPP {
    const dpps = this.getDPPs();
    const newDPP: DPP = {
      ...dppData,
      id: `dpp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newDPP, ...dpps];
    this.saveDPPs(updated);
    return newDPP;
  },

  updateDPP(id: string, updates: Partial<DPP>): DPP | null {
    const dpps = this.getDPPs();
    const index = dpps.findIndex(d => d.id === id);
    if (index === -1) return null;
    const updated = { ...dpps[index], ...updates };
    dpps[index] = updated;
    this.saveDPPs(dpps);
    return updated;
  },

  deleteDPP(id: string): boolean {
    const dpps = this.getDPPs();
    const filtered = dpps.filter(d => d.id !== id);
    if (filtered.length === dpps.length) return false;
    this.saveDPPs(filtered);
    return true;
  },

  // STUDENTS
  getStudents(): User[] {
    try {
      const data = localStorage.getItem(STUDENTS_KEY);
      if (!data) {
        localStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
        return INITIAL_STUDENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  saveStudents(students: User[]): void {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  },

  addStudent(student: User): void {
    const students = this.getStudents();
    const exists = students.some(s => s.email.toLowerCase() === student.email.toLowerCase());
    if (!exists) {
      this.saveStudents([student, ...students]);
    }
  },

  toggleStudentStatus(id: string): User | null {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return null;
    const current = students[index];
    const updated = {
      ...current,
      status: current.status === 'active' ? ('suspended' as const) : ('active' as const)
    };
    students[index] = updated;
    this.saveStudents(students);
    return updated;
  },

  // FIREBASE CONFIG MANAGEMENT
  getFirebaseConfig(): FirebaseCustomConfig | null {
    try {
      const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  saveFirebaseConfig(config: FirebaseCustomConfig): void {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
  },

  resetToDefaultData(): void {
    localStorage.setItem(NOTES_KEY, JSON.stringify(INITIAL_NOTES));
    localStorage.setItem(LECTURES_KEY, JSON.stringify(INITIAL_LECTURES));
    localStorage.setItem(DPPS_KEY, JSON.stringify(INITIAL_DPPS));
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
  }
};
