import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
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

// Local storage fallback cache keys for instant offline startup
const CACHE_KEYS = {
  NOTES: 'cd_academy_fs_notes',
  LECTURES: 'cd_academy_fs_lectures',
  DPP: 'cd_academy_fs_dpp',
  STUDENTS: 'cd_academy_fs_students',
  BATCHES: 'cd_academy_fs_batches',
  TESTS: 'cd_academy_fs_tests',
  NOTIFICATIONS: 'cd_academy_fs_notifications',
  RESULTS: 'cd_academy_fs_results'
};

function getLocalCache<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Cache write failed:', e);
  }
}

export const FirestoreDataService = {
  // ==========================================
  // 1. NOTES
  // ==========================================
  async getNotes(): Promise<Note[]> {
    try {
      const snap = await getDocs(collection(db, 'notes'));
      if (snap.empty) {
        return await this.seedNotes();
      }
      const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Note));
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setLocalCache(CACHE_KEYS.NOTES, list);
      return list;
    } catch (err) {
      console.warn('Firestore getNotes fallback to cache/seed:', err);
      return getLocalCache(CACHE_KEYS.NOTES, INITIAL_NOTES);
    }
  },

  async seedNotes(): Promise<Note[]> {
    try {
      for (const n of INITIAL_NOTES) {
        await setDoc(doc(db, 'notes', n.id), n, { merge: true });
      }
      setLocalCache(CACHE_KEYS.NOTES, INITIAL_NOTES);
      return INITIAL_NOTES;
    } catch (e) {
      console.warn('Seed notes notice:', e);
      return INITIAL_NOTES;
    }
  },

  subscribeNotes(callback: (notes: Note[]) => void): () => void {
    try {
      return onSnapshot(
        collection(db, 'notes'),
        (snap) => {
          if (snap.empty) {
            this.seedNotes().then(callback).catch(() => callback(getLocalCache(CACHE_KEYS.NOTES, INITIAL_NOTES)));
            return;
          }
          const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Note));
          list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setLocalCache(CACHE_KEYS.NOTES, list);
          callback(list);
        },
        (err) => {
          console.warn('Realtime notes subscription warning:', err);
          callback(getLocalCache(CACHE_KEYS.NOTES, INITIAL_NOTES));
        }
      );
    } catch (e) {
      console.warn('subscribeNotes fallback:', e);
      callback(getLocalCache(CACHE_KEYS.NOTES, INITIAL_NOTES));
      return () => {};
    }
  },

  async addNote(noteData: Omit<Note, 'id' | 'createdAt'>): Promise<Note> {
    const id = `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newNote: Note = {
      ...noteData,
      id,
      noteId: id,
      createdAt: new Date().toISOString(),
      uploadedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'notes', id), newNote);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `notes/${id}`);
    }
    const current = getLocalCache<Note[]>(CACHE_KEYS.NOTES, INITIAL_NOTES);
    setLocalCache(CACHE_KEYS.NOTES, [newNote, ...current]);
    // Auto Notification
    this.triggerNotification({
      title: 'New Notes Uploaded 📚',
      message: `New ${newNote.classLevel} ${newNote.subject} notes for "${newNote.chapter}" are now available.`,
      targetType: 'class',
      targetClass: newNote.classLevel,
      actionTab: 'notes'
    }).catch(e => console.warn('Notification trigger notice:', e));
    return newNote;
  },

  async updateNote(id: string, updates: Partial<Note>): Promise<void> {
    try {
      await updateDoc(doc(db, 'notes', id), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `notes/${id}`);
    }
    const current = getLocalCache<Note[]>(CACHE_KEYS.NOTES, INITIAL_NOTES);
    setLocalCache(CACHE_KEYS.NOTES, current.map(n => n.id === id ? { ...n, ...updates } : n));
  },

  async deleteNote(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `notes/${id}`);
    }
    const current = getLocalCache<Note[]>(CACHE_KEYS.NOTES, INITIAL_NOTES);
    setLocalCache(CACHE_KEYS.NOTES, current.filter(n => n.id !== id));
  },

  // ==========================================
  // 2. LECTURES
  // ==========================================
  async getLectures(): Promise<Lecture[]> {
    try {
      const snap = await getDocs(collection(db, 'lectures'));
      if (snap.empty) {
        return await this.seedLectures();
      }
      const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Lecture));
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setLocalCache(CACHE_KEYS.LECTURES, list);
      return list;
    } catch (err) {
      console.warn('Firestore getLectures fallback to cache/seed:', err);
      return getLocalCache(CACHE_KEYS.LECTURES, INITIAL_LECTURES);
    }
  },

  async seedLectures(): Promise<Lecture[]> {
    try {
      for (const l of INITIAL_LECTURES) {
        await setDoc(doc(db, 'lectures', l.id), l, { merge: true });
      }
      setLocalCache(CACHE_KEYS.LECTURES, INITIAL_LECTURES);
      return INITIAL_LECTURES;
    } catch (e) {
      console.warn('Seed lectures notice:', e);
      return INITIAL_LECTURES;
    }
  },

  subscribeLectures(callback: (lectures: Lecture[]) => void): () => void {
    try {
      return onSnapshot(
        collection(db, 'lectures'),
        (snap) => {
          if (snap.empty) {
            this.seedLectures().then(callback).catch(() => callback(getLocalCache(CACHE_KEYS.LECTURES, INITIAL_LECTURES)));
            return;
          }
          const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Lecture));
          list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setLocalCache(CACHE_KEYS.LECTURES, list);
          callback(list);
        },
        (err) => {
          console.warn('Realtime lectures subscription warning:', err);
          callback(getLocalCache(CACHE_KEYS.LECTURES, INITIAL_LECTURES));
        }
      );
    } catch (e) {
      console.warn('subscribeLectures fallback:', e);
      callback(getLocalCache(CACHE_KEYS.LECTURES, INITIAL_LECTURES));
      return () => {};
    }
  },

  async addLecture(lectureData: Omit<Lecture, 'id' | 'createdAt'>): Promise<Lecture> {
    const id = `lec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newLec: Lecture = {
      ...lectureData,
      id,
      lectureId: id,
      createdAt: new Date().toISOString(),
      uploadedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'lectures', id), newLec);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `lectures/${id}`);
    }
    const current = getLocalCache<Lecture[]>(CACHE_KEYS.LECTURES, INITIAL_LECTURES);
    setLocalCache(CACHE_KEYS.LECTURES, [newLec, ...current]);
    // Auto Notification
    this.triggerNotification({
      title: 'New Lecture Available 🎥',
      message: `Your new ${newLec.classLevel} ${newLec.subject} lecture "${newLec.title}" is now available. Start learning now.`,
      targetType: 'class',
      targetClass: newLec.classLevel,
      actionTab: 'lectures'
    }).catch(e => console.warn('Notification trigger notice:', e));
    return newLec;
  },

  async updateLecture(id: string, updates: Partial<Lecture>): Promise<void> {
    try {
      await updateDoc(doc(db, 'lectures', id), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `lectures/${id}`);
    }
    const current = getLocalCache<Lecture[]>(CACHE_KEYS.LECTURES, INITIAL_LECTURES);
    setLocalCache(CACHE_KEYS.LECTURES, current.map(l => l.id === id ? { ...l, ...updates } : l));
  },

  async deleteLecture(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'lectures', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `lectures/${id}`);
    }
    const current = getLocalCache<Lecture[]>(CACHE_KEYS.LECTURES, INITIAL_LECTURES);
    setLocalCache(CACHE_KEYS.LECTURES, current.filter(l => l.id !== id));
  },

  // ==========================================
  // 3. DPPs
  // ==========================================
  async getDPPs(): Promise<DPP[]> {
    try {
      const snap = await getDocs(collection(db, 'dpp'));
      if (snap.empty) {
        return await this.seedDPPs();
      }
      const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as DPP));
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setLocalCache(CACHE_KEYS.DPP, list);
      return list;
    } catch (err) {
      console.warn('Firestore getDPPs fallback to cache/seed:', err);
      return getLocalCache(CACHE_KEYS.DPP, INITIAL_DPPS);
    }
  },

  async seedDPPs(): Promise<DPP[]> {
    try {
      for (const d of INITIAL_DPPS) {
        await setDoc(doc(db, 'dpp', d.id), d, { merge: true });
      }
      setLocalCache(CACHE_KEYS.DPP, INITIAL_DPPS);
      return INITIAL_DPPS;
    } catch (e) {
      console.warn('Seed DPPs notice:', e);
      return INITIAL_DPPS;
    }
  },

  subscribeDPPs(callback: (dpps: DPP[]) => void): () => void {
    try {
      return onSnapshot(
        collection(db, 'dpp'),
        (snap) => {
          if (snap.empty) {
            this.seedDPPs().then(callback).catch(() => callback(getLocalCache(CACHE_KEYS.DPP, INITIAL_DPPS)));
            return;
          }
          const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as DPP));
          list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setLocalCache(CACHE_KEYS.DPP, list);
          callback(list);
        },
        (err) => {
          console.warn('Realtime DPP subscription warning:', err);
          callback(getLocalCache(CACHE_KEYS.DPP, INITIAL_DPPS));
        }
      );
    } catch (e) {
      console.warn('subscribeDPPs fallback:', e);
      callback(getLocalCache(CACHE_KEYS.DPP, INITIAL_DPPS));
      return () => {};
    }
  },

  async addDPP(dppData: Omit<DPP, 'id' | 'createdAt'>): Promise<DPP> {
    const id = `dpp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newDPP: DPP = {
      ...dppData,
      id,
      dppId: id,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'dpp', id), newDPP);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `dpp/${id}`);
    }
    const current = getLocalCache<DPP[]>(CACHE_KEYS.DPP, INITIAL_DPPS);
    setLocalCache(CACHE_KEYS.DPP, [newDPP, ...current]);
    // Auto Notification
    this.triggerNotification({
      title: "Today's DPP is Live 📝",
      message: `Practice today's ${newDPP.classLevel} ${newDPP.subject} DPP and improve your preparation score.`,
      targetType: 'class',
      targetClass: newDPP.classLevel,
      actionTab: 'dpp'
    }).catch(e => console.warn('Notification trigger notice:', e));
    return newDPP;
  },

  async updateDPP(id: string, updates: Partial<DPP>): Promise<void> {
    try {
      await updateDoc(doc(db, 'dpp', id), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `dpp/${id}`);
    }
    const current = getLocalCache<DPP[]>(CACHE_KEYS.DPP, INITIAL_DPPS);
    setLocalCache(CACHE_KEYS.DPP, current.map(d => d.id === id ? { ...d, ...updates } : d));
  },

  async deleteDPP(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'dpp', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `dpp/${id}`);
    }
    const current = getLocalCache<DPP[]>(CACHE_KEYS.DPP, INITIAL_DPPS);
    setLocalCache(CACHE_KEYS.DPP, current.filter(d => d.id !== id));
  },

  // ==========================================
  // 4. BATCHES
  // ==========================================
  async getBatches(): Promise<Batch[]> {
    try {
      const snap = await getDocs(collection(db, 'batches'));
      if (snap.empty) {
        return await this.seedBatches();
      }
      const list = snap.docs.map(d => ({ ...d.data(), batchId: d.id } as Batch));
      setLocalCache(CACHE_KEYS.BATCHES, list);
      return list;
    } catch (err) {
      console.warn('Firestore getBatches fallback to cache/seed:', err);
      return getLocalCache(CACHE_KEYS.BATCHES, INITIAL_BATCHES);
    }
  },

  async seedBatches(): Promise<Batch[]> {
    try {
      for (const b of INITIAL_BATCHES) {
        await setDoc(doc(db, 'batches', b.batchId), b, { merge: true });
      }
      setLocalCache(CACHE_KEYS.BATCHES, INITIAL_BATCHES);
      return INITIAL_BATCHES;
    } catch (e) {
      console.warn('Seed batches notice:', e);
      return INITIAL_BATCHES;
    }
  },

  subscribeBatches(callback: (batches: Batch[]) => void): () => void {
    try {
      return onSnapshot(
        collection(db, 'batches'),
        (snap) => {
          if (snap.empty) {
            this.seedBatches().then(callback).catch(() => callback(getLocalCache(CACHE_KEYS.BATCHES, INITIAL_BATCHES)));
            return;
          }
          const list = snap.docs.map(d => ({ ...d.data(), batchId: d.id } as Batch));
          setLocalCache(CACHE_KEYS.BATCHES, list);
          callback(list);
        },
        (err) => {
          console.warn('Realtime batches subscription warning:', err);
          callback(getLocalCache(CACHE_KEYS.BATCHES, INITIAL_BATCHES));
        }
      );
    } catch (e) {
      console.warn('subscribeBatches fallback:', e);
      callback(getLocalCache(CACHE_KEYS.BATCHES, INITIAL_BATCHES));
      return () => {};
    }
  },

  async addBatch(batchData: Omit<Batch, 'batchId' | 'createdAt'>): Promise<Batch> {
    const batchId = `batch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newBatch: Batch = {
      ...batchData,
      batchId,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'batches', batchId), newBatch);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `batches/${batchId}`);
    }
    const current = getLocalCache<Batch[]>(CACHE_KEYS.BATCHES, INITIAL_BATCHES);
    setLocalCache(CACHE_KEYS.BATCHES, [newBatch, ...current]);
    return newBatch;
  },

  async updateBatch(batchId: string, updates: Partial<Batch>): Promise<void> {
    try {
      await updateDoc(doc(db, 'batches', batchId), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `batches/${batchId}`);
    }
    const current = getLocalCache<Batch[]>(CACHE_KEYS.BATCHES, INITIAL_BATCHES);
    setLocalCache(CACHE_KEYS.BATCHES, current.map(b => b.batchId === batchId ? { ...b, ...updates } : b));
  },

  async deleteBatch(batchId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'batches', batchId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `batches/${batchId}`);
    }
    const current = getLocalCache<Batch[]>(CACHE_KEYS.BATCHES, INITIAL_BATCHES);
    setLocalCache(CACHE_KEYS.BATCHES, current.filter(b => b.batchId !== batchId));
  },

  // ==========================================
  // 5. TESTS & CBT
  // ==========================================
  async getTests(): Promise<TestItem[]> {
    try {
      const snap = await getDocs(collection(db, 'tests'));
      if (snap.empty) {
        return await this.seedTests();
      }
      const list = snap.docs.map(d => ({ ...d.data(), testId: d.id } as TestItem));
      setLocalCache(CACHE_KEYS.TESTS, list);
      return list;
    } catch (err) {
      console.warn('Firestore getTests fallback to cache/seed:', err);
      return getLocalCache(CACHE_KEYS.TESTS, INITIAL_TESTS);
    }
  },

  async seedTests(): Promise<TestItem[]> {
    try {
      for (const t of INITIAL_TESTS) {
        await setDoc(doc(db, 'tests', t.testId), t, { merge: true });
      }
      setLocalCache(CACHE_KEYS.TESTS, INITIAL_TESTS);
      return INITIAL_TESTS;
    } catch (e) {
      console.warn('Seed tests notice:', e);
      return INITIAL_TESTS;
    }
  },

  subscribeTests(callback: (tests: TestItem[]) => void): () => void {
    try {
      return onSnapshot(
        collection(db, 'tests'),
        (snap) => {
          if (snap.empty) {
            this.seedTests().then(callback).catch(() => callback(getLocalCache(CACHE_KEYS.TESTS, INITIAL_TESTS)));
            return;
          }
          const list = snap.docs.map(d => ({ ...d.data(), testId: d.id } as TestItem));
          setLocalCache(CACHE_KEYS.TESTS, list);
          callback(list);
        },
        (err) => {
          console.warn('Realtime tests subscription warning:', err);
          callback(getLocalCache(CACHE_KEYS.TESTS, INITIAL_TESTS));
        }
      );
    } catch (e) {
      console.warn('subscribeTests fallback:', e);
      callback(getLocalCache(CACHE_KEYS.TESTS, INITIAL_TESTS));
      return () => {};
    }
  },

  async addTest(testData: Omit<TestItem, 'testId' | 'createdAt'>): Promise<TestItem> {
    const testId = `test-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newTest: TestItem = {
      ...testData,
      testId,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'tests', testId), newTest);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `tests/${testId}`);
    }
    const current = getLocalCache<TestItem[]>(CACHE_KEYS.TESTS, INITIAL_TESTS);
    setLocalCache(CACHE_KEYS.TESTS, [newTest, ...current]);
    // Auto Notification
    this.triggerNotification({
      title: 'New Test Available 🏆',
      message: `Your new ${newTest.class} ${newTest.subject} test "${newTest.title}" is now live. Test your preparation.`,
      targetType: 'class',
      targetClass: newTest.class,
      actionTab: 'tests'
    }).catch(e => console.warn('Notification trigger notice:', e));
    return newTest;
  },

  async submitTestResult(resultData: Omit<TestResultItem, 'resultId' | 'submittedAt'>): Promise<TestResultItem> {
    const resultId = `res-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newResult: TestResultItem = {
      ...resultData,
      resultId,
      submittedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'testResults', resultId), newResult);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `testResults/${resultId}`);
    }
    const current = getLocalCache<TestResultItem[]>(CACHE_KEYS.RESULTS, []);
    setLocalCache(CACHE_KEYS.RESULTS, [newResult, ...current]);
    return newResult;
  },

  async getStudentTestResults(userId: string): Promise<TestResultItem[]> {
    try {
      const q = query(collection(db, 'testResults'), where('userId', '==', userId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ ...d.data(), resultId: d.id } as TestResultItem));
    } catch (err) {
      console.warn('Firestore getStudentTestResults fallback:', err);
      const current = getLocalCache<TestResultItem[]>(CACHE_KEYS.RESULTS, []);
      return current.filter(r => r.userId === userId);
    }
  },

  // ==========================================
  // 6. STUDENTS & USERS
  // ==========================================
  async getStudents(): Promise<User[]> {
    try {
      const snap = await getDocs(collection(db, 'users'));
      if (snap.empty) {
        return await this.seedStudents();
      }
      const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as User));
      setLocalCache(CACHE_KEYS.STUDENTS, list);
      return list;
    } catch (err) {
      console.warn('Firestore getStudents fallback to cache/seed:', err);
      return getLocalCache(CACHE_KEYS.STUDENTS, INITIAL_STUDENTS);
    }
  },

  async seedStudents(): Promise<User[]> {
    try {
      for (const s of INITIAL_STUDENTS) {
        await setDoc(doc(db, 'users', s.id), s, { merge: true });
      }
      setLocalCache(CACHE_KEYS.STUDENTS, INITIAL_STUDENTS);
      return INITIAL_STUDENTS;
    } catch (e) {
      console.warn('Seed students notice:', e);
      return INITIAL_STUDENTS;
    }
  },

  subscribeStudents(callback: (students: User[]) => void): () => void {
    try {
      return onSnapshot(
        collection(db, 'users'),
        (snap) => {
          if (snap.empty) {
            this.seedStudents().then(callback).catch(() => callback(getLocalCache(CACHE_KEYS.STUDENTS, INITIAL_STUDENTS)));
            return;
          }
          const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as User));
          setLocalCache(CACHE_KEYS.STUDENTS, list);
          callback(list);
        },
        (err) => {
          console.warn('Realtime students subscription warning:', err);
          callback(getLocalCache(CACHE_KEYS.STUDENTS, INITIAL_STUDENTS));
        }
      );
    } catch (e) {
      console.warn('subscribeStudents fallback:', e);
      callback(getLocalCache(CACHE_KEYS.STUDENTS, INITIAL_STUDENTS));
      return () => {};
    }
  },

  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (snap.exists()) {
        return { ...snap.data(), id: snap.id } as User;
      }
      return null;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${userId}`);
      return null;
    }
  },

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
    const current = getLocalCache<User[]>(CACHE_KEYS.STUDENTS, INITIAL_STUDENTS);
    setLocalCache(CACHE_KEYS.STUDENTS, current.map(s => s.id === userId ? { ...s, ...updates } : s));
  },

  // ==========================================
  // 7. NOTIFICATIONS & FCM TOKENS
  // ==========================================
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const snap = await getDocs(collection(db, 'notifications'));
      if (snap.empty) {
        return await this.seedNotifications();
      }
      const list = snap.docs.map(d => ({ ...d.data(), notificationId: d.id } as NotificationItem));
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setLocalCache(CACHE_KEYS.NOTIFICATIONS, list);
      return list;
    } catch (err) {
      console.warn('Firestore getNotifications fallback:', err);
      return getLocalCache(CACHE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    }
  },

  async seedNotifications(): Promise<NotificationItem[]> {
    try {
      for (const n of INITIAL_NOTIFICATIONS) {
        await setDoc(doc(db, 'notifications', n.notificationId), n, { merge: true });
      }
      setLocalCache(CACHE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      return INITIAL_NOTIFICATIONS;
    } catch (e) {
      console.warn('Seed notifications notice:', e);
      return INITIAL_NOTIFICATIONS;
    }
  },

  subscribeNotifications(callback: (notifs: NotificationItem[]) => void): () => void {
    try {
      return onSnapshot(
        collection(db, 'notifications'),
        (snap) => {
          if (snap.empty) {
            this.seedNotifications().then(callback).catch(() => callback(getLocalCache(CACHE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)));
            return;
          }
          const list = snap.docs.map(d => ({ ...d.data(), notificationId: d.id } as NotificationItem));
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setLocalCache(CACHE_KEYS.NOTIFICATIONS, list);
          callback(list);
        },
        (err) => {
          console.warn('Realtime notifications subscription warning:', err);
          callback(getLocalCache(CACHE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS));
        }
      );
    } catch (e) {
      console.warn('subscribeNotifications fallback:', e);
      callback(getLocalCache(CACHE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS));
      return () => {};
    }
  },

  async triggerNotification(data: {
    title: string;
    message: string;
    targetType: 'all' | 'class' | 'batch' | 'student';
    targetClass?: string;
    targetBatch?: string;
    targetStudentId?: string;
    actionTab?: any;
    imageURL?: string;
  }): Promise<NotificationItem> {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newNotif: NotificationItem = {
      ...data,
      notificationId: id,
      createdAt: new Date().toISOString(),
      isActive: true,
      readBy: []
    };
    try {
      await setDoc(doc(db, 'notifications', id), newNotif);
    } catch (e) {
      console.warn('Notification save warning:', e);
    }
    const current = getLocalCache<NotificationItem[]>(CACHE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setLocalCache(CACHE_KEYS.NOTIFICATIONS, [newNotif, ...current]);
    return newNotif;
  },

  async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const ref = doc(db, 'notifications', notificationId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const notif = snap.data() as NotificationItem;
        const readBy = notif.readBy || [];
        if (!readBy.includes(userId)) {
          await updateDoc(ref, {
            readBy: [...readBy, userId]
          });
        }
      }
    } catch (e) {
      console.warn('markNotificationAsRead notice:', e);
    }
    const current = getLocalCache<NotificationItem[]>(CACHE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setLocalCache(
      CACHE_KEYS.NOTIFICATIONS,
      current.map(n => {
        if (n.notificationId === notificationId) {
          const readBy = n.readBy || [];
          return { ...n, readBy: readBy.includes(userId) ? readBy : [...readBy, userId] };
        }
        return n;
      })
    );
  },

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const notifs = await this.getNotifications();
    for (const n of notifs) {
      const readBy = n.readBy || [];
      if (!readBy.includes(userId)) {
        await this.markNotificationAsRead(n.notificationId, userId);
      }
    }
  },

  async registerFCMToken(userId: string, token: string): Promise<void> {
    const tokenId = `token-${userId}-${Date.now()}`;
    const device = navigator.userAgent.includes('Android') ? 'Android APK / Device' : 'Web Browser';
    const platform = navigator.userAgent.includes('Android') ? 'android' : 'web';
    try {
      await setDoc(doc(db, 'notificationTokens', tokenId), {
        tokenId,
        userId,
        FCMToken: token,
        device,
        platform,
        updatedAt: new Date().toISOString()
      });
      // Update user doc
      await updateDoc(doc(db, 'users', userId), {
        notificationPermission: 'granted',
        lastLogin: new Date().toISOString()
      });
    } catch (err) {
      console.warn('FCM token registration warning:', err);
    }
  },

  // Seed all initial content if Firestore database is fresh
  async seedAllIfEmpty(): Promise<void> {
    try {
      const notesSnap = await getDocs(collection(db, 'notes'));
      if (notesSnap.empty) {
        await this.seedNotes();
      }
      const lecSnap = await getDocs(collection(db, 'lectures'));
      if (lecSnap.empty) {
        await this.seedLectures();
      }
      const dppSnap = await getDocs(collection(db, 'dpp'));
      if (dppSnap.empty) {
        await this.seedDPPs();
      }
      const batchSnap = await getDocs(collection(db, 'batches'));
      if (batchSnap.empty) {
        await this.seedBatches();
      }
      const testSnap = await getDocs(collection(db, 'tests'));
      if (testSnap.empty) {
        await this.seedTests();
      }
      const notifSnap = await getDocs(collection(db, 'notifications'));
      if (notifSnap.empty) {
        await this.seedNotifications();
      }
    } catch (e) {
      console.warn('seedAllIfEmpty notice:', e);
    }
  }
};
