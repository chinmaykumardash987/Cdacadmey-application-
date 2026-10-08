import {
  Note,
  Lecture,
  DPP,
  User,
  Batch,
  TestItem,
  TestResultItem,
  NotificationItem
} from '../types';
import {
  INITIAL_NOTES,
  INITIAL_LECTURES,
  INITIAL_DPPS,
  INITIAL_STUDENTS,
  INITIAL_BATCHES,
  INITIAL_TESTS,
  INITIAL_NOTIFICATIONS
} from './initialData';
import { FirestoreDataService } from './firestoreData';

const NOTES_KEY = 'cd_academy_notes_v1';
const LECTURES_KEY = 'cd_academy_lectures_v1';
const DPPS_KEY = 'cd_academy_dpps_v1';
const STUDENTS_KEY = 'cd_academy_students_v1';
const BATCHES_KEY = 'cd_academy_batches_v1';
const TESTS_KEY = 'cd_academy_tests_v1';
const NOTIFICATIONS_KEY = 'cd_academy_notifications_v1';
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
    // Background sync to Firestore
    FirestoreDataService.addNote(noteData).catch(e => console.warn('Firestore note sync:', e));
    return newNote;
  },

  updateNote(id: string, updates: Partial<Note>): Note | null {
    const notes = this.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return null;
    const updatedNote = { ...notes[index], ...updates };
    notes[index] = updatedNote;
    this.saveNotes(notes);
    FirestoreDataService.updateNote(id, updates).catch(e => console.warn('Firestore note update:', e));
    return updatedNote;
  },

  deleteNote(id: string): boolean {
    const notes = this.getNotes();
    const filtered = notes.filter(n => n.id !== id);
    if (filtered.length === notes.length) return false;
    this.saveNotes(filtered);
    FirestoreDataService.deleteNote(id).catch(e => console.warn('Firestore note delete:', e));
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
    FirestoreDataService.addLecture(lectureData).catch(e => console.warn('Firestore lecture sync:', e));
    return newLecture;
  },

  updateLecture(id: string, updates: Partial<Lecture>): Lecture | null {
    const lectures = this.getLectures();
    const index = lectures.findIndex(l => l.id === id);
    if (index === -1) return null;
    const updated = { ...lectures[index], ...updates };
    lectures[index] = updated;
    this.saveLectures(lectures);
    FirestoreDataService.updateLecture(id, updates).catch(e => console.warn('Firestore lecture update:', e));
    return updated;
  },

  deleteLecture(id: string): boolean {
    const lectures = this.getLectures();
    const filtered = lectures.filter(l => l.id !== id);
    if (filtered.length === lectures.length) return false;
    this.saveLectures(filtered);
    FirestoreDataService.deleteLecture(id).catch(e => console.warn('Firestore lecture delete:', e));
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
    FirestoreDataService.addDPP(dppData).catch(e => console.warn('Firestore dpp sync:', e));
    return newDPP;
  },

  updateDPP(id: string, updates: Partial<DPP>): DPP | null {
    const dpps = this.getDPPs();
    const index = dpps.findIndex(d => d.id === id);
    if (index === -1) return null;
    const updated = { ...dpps[index], ...updates };
    dpps[index] = updated;
    this.saveDPPs(dpps);
    FirestoreDataService.updateDPP(id, updates).catch(e => console.warn('Firestore dpp update:', e));
    return updated;
  },

  deleteDPP(id: string): boolean {
    const dpps = this.getDPPs();
    const filtered = dpps.filter(d => d.id !== id);
    if (filtered.length === dpps.length) return false;
    this.saveDPPs(filtered);
    FirestoreDataService.deleteDPP(id).catch(e => console.warn('Firestore dpp delete:', e));
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
    const newStatus = current.status === 'active' ? ('suspended' as const) : ('active' as const);
    const updated = {
      ...current,
      status: newStatus,
      isActive: newStatus === 'active'
    };
    students[index] = updated;
    this.saveStudents(students);
    FirestoreDataService.updateUserProfile(id, { status: newStatus, isActive: newStatus === 'active' })
      .catch(e => console.warn('Firestore status toggle:', e));
    return updated;
  },

  // BATCHES
  getBatches(): Batch[] {
    try {
      const data = localStorage.getItem(BATCHES_KEY);
      if (!data) {
        localStorage.setItem(BATCHES_KEY, JSON.stringify(INITIAL_BATCHES));
        return INITIAL_BATCHES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_BATCHES;
    }
  },

  saveBatches(batches: Batch[]): void {
    localStorage.setItem(BATCHES_KEY, JSON.stringify(batches));
  },

  addBatch(batchData: Omit<Batch, 'batchId' | 'createdAt'>): Batch {
    const batches = this.getBatches();
    const newBatch: Batch = {
      ...batchData,
      batchId: `batch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newBatch, ...batches];
    this.saveBatches(updated);
    FirestoreDataService.addBatch(batchData).catch(e => console.warn('Firestore batch sync:', e));
    return newBatch;
  },

  deleteBatch(batchId: string): boolean {
    const batches = this.getBatches();
    const filtered = batches.filter(b => b.batchId !== batchId);
    if (filtered.length === batches.length) return false;
    this.saveBatches(filtered);
    FirestoreDataService.deleteBatch(batchId).catch(e => console.warn('Firestore batch delete:', e));
    return true;
  },

  // TESTS
  getTests(): TestItem[] {
    try {
      const data = localStorage.getItem(TESTS_KEY);
      if (!data) {
        localStorage.setItem(TESTS_KEY, JSON.stringify(INITIAL_TESTS));
        return INITIAL_TESTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TESTS;
    }
  },

  saveTests(tests: TestItem[]): void {
    localStorage.setItem(TESTS_KEY, JSON.stringify(tests));
  },

  addTest(testData: Omit<TestItem, 'testId' | 'createdAt'>): TestItem {
    const tests = this.getTests();
    const newTest: TestItem = {
      ...testData,
      testId: `test-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newTest, ...tests];
    this.saveTests(updated);
    FirestoreDataService.addTest(testData).catch(e => console.warn('Firestore test sync:', e));
    return newTest;
  },

  // NOTIFICATIONS
  getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(NOTIFICATIONS_KEY);
      if (!data) {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications(notifs: NotificationItem[]): void {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  },

  addNotification(notifData: Parameters<typeof FirestoreDataService.triggerNotification>[0]): NotificationItem {
    const notifs = this.getNotifications();
    const newNotif: NotificationItem = {
      ...notifData,
      notificationId: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      isActive: true,
      readBy: []
    };
    const updated = [newNotif, ...notifs];
    this.saveNotifications(updated);
    FirestoreDataService.triggerNotification(notifData).catch(e => console.warn('Firestore notif sync:', e));
    return newNotif;
  },

  markNotificationAsRead(notificationId: string, userId: string): void {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => {
      if (n.notificationId === notificationId) {
        const readBy = n.readBy || [];
        return { ...n, readBy: readBy.includes(userId) ? readBy : [...readBy, userId] };
      }
      return n;
    });
    this.saveNotifications(updated);
    FirestoreDataService.markNotificationAsRead(notificationId, userId).catch(e => console.warn('Mark notif read sync:', e));
  },

  markAllNotificationsAsRead(userId: string): void {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => {
      const readBy = n.readBy || [];
      return { ...n, readBy: readBy.includes(userId) ? readBy : [...readBy, userId] };
    });
    this.saveNotifications(updated);
    FirestoreDataService.markAllNotificationsAsRead(userId).catch(e => console.warn('Mark all notifs read sync:', e));
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

  // LIVE FIRESTORE BACKGROUND SYNC
  async syncFromFirestore(): Promise<void> {
    try {
      const [notes, lectures, dpps, batches, tests, notifs, students] = await Promise.all([
        FirestoreDataService.getNotes(),
        FirestoreDataService.getLectures(),
        FirestoreDataService.getDPPs(),
        FirestoreDataService.getBatches(),
        FirestoreDataService.getTests(),
        FirestoreDataService.getNotifications(),
        FirestoreDataService.getStudents()
      ]);
      if (notes.length) this.saveNotes(notes);
      if (lectures.length) this.saveLectures(lectures);
      if (dpps.length) this.saveDPPs(dpps);
      if (batches.length) this.saveBatches(batches);
      if (tests.length) this.saveTests(tests);
      if (notifs.length) this.saveNotifications(notifs);
      if (students.length) this.saveStudents(students);
    } catch (e) {
      console.warn('Initial Firestore sync note:', e);
    }
  },

  resetToDefaultData(): void {
    localStorage.setItem(NOTES_KEY, JSON.stringify(INITIAL_NOTES));
    localStorage.setItem(LECTURES_KEY, JSON.stringify(INITIAL_LECTURES));
    localStorage.setItem(DPPS_KEY, JSON.stringify(INITIAL_DPPS));
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(BATCHES_KEY, JSON.stringify(INITIAL_BATCHES));
    localStorage.setItem(TESTS_KEY, JSON.stringify(INITIAL_TESTS));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
};
