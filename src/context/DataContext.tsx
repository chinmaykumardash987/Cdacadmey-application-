import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storage';
import { FirestoreDataService } from '../services/firestoreData';
import {
  Note,
  Lecture,
  DPP,
  Batch,
  TestItem,
  TestResultItem,
  NotificationItem,
  User
} from '../types';

interface DataContextType {
  notes: Note[];
  lectures: Lecture[];
  dpps: DPP[];
  batches: Batch[];
  tests: TestItem[];
  notifications: NotificationItem[];
  students: User[];
  isRealtimeActive: boolean;
  isOnline: boolean;
  lastSyncTime: Date | null;
  // Operations that write to Firebase and propagate across all devices in real-time
  addNote: (noteData: Omit<Note, 'id' | 'createdAt'>) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addLecture: (lectureData: Omit<Lecture, 'id' | 'createdAt'>) => Promise<Lecture>;
  updateLecture: (id: string, updates: Partial<Lecture>) => Promise<void>;
  deleteLecture: (id: string) => Promise<void>;
  addDPP: (dppData: Omit<DPP, 'id' | 'createdAt'>) => Promise<DPP>;
  updateDPP: (id: string, updates: Partial<DPP>) => Promise<void>;
  deleteDPP: (id: string) => Promise<void>;
  addBatch: (batchData: Omit<Batch, 'batchId' | 'createdAt'>) => Promise<Batch>;
  updateBatch: (id: string, updates: Partial<Batch>) => Promise<void>;
  deleteBatch: (id: string) => Promise<void>;
  addTest: (testData: Omit<TestItem, 'testId' | 'createdAt'>) => Promise<TestItem>;
  submitTestResult: (resultData: Omit<TestResultItem, 'resultId' | 'submittedAt'>) => Promise<TestResultItem>;
  triggerNotification: (data: {
    title: string;
    message: string;
    targetType: 'all' | 'class' | 'batch' | 'student';
    targetClass?: string;
    targetBatch?: string;
    targetStudentId?: string;
    actionTab?: any;
    imageURL?: string;
  }) => Promise<NotificationItem>;
  markNotificationAsRead: (notificationId: string, userId: string) => Promise<void>;
  markAllNotificationsAsRead: (userId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(() => StorageService.getNotes());
  const [lectures, setLectures] = useState<Lecture[]>(() => StorageService.getLectures());
  const [dpps, setDPPs] = useState<DPP[]>(() => StorageService.getDPPs());
  const [batches, setBatches] = useState<Batch[]>(() => StorageService.getBatches());
  const [tests, setTests] = useState<TestItem[]>(() => StorageService.getTests());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => StorageService.getNotifications());
  const [students, setStudents] = useState<User[]>(() => StorageService.getStudents());
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(new Date());

  const syncStateFromStorage = useCallback(() => {
    setNotes(StorageService.getNotes());
    setLectures(StorageService.getLectures());
    setDPPs(StorageService.getDPPs());
    setBatches(StorageService.getBatches());
    setTests(StorageService.getTests());
    setNotifications(StorageService.getNotifications());
    setStudents(StorageService.getStudents());
    setLastSyncTime(new Date());
  }, []);

  // Set up realtime Firestore sync and change listeners
  useEffect(() => {
    // 1. Start live Firestore listeners
    const cleanupRealtime = StorageService.initRealtimeSync();

    // 2. Listen for change events from StorageService
    const unsubscribeStorage = StorageService.onDataChange(() => {
      syncStateFromStorage();
    });

    // 3. Online/Offline detection
    const handleOnline = () => {
      setIsOnline(true);
      StorageService.syncFromFirestore().then(() => syncStateFromStorage());
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial sync
    StorageService.syncFromFirestore().then(() => {
      syncStateFromStorage();
      setIsRealtimeActive(true);
    });

    return () => {
      cleanupRealtime();
      unsubscribeStorage();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncStateFromStorage]);

  // Operations
  const addNote = async (noteData: Omit<Note, 'id' | 'createdAt'>): Promise<Note> => {
    const created = StorageService.addNote(noteData);
    syncStateFromStorage();
    return created;
  };

  const updateNote = async (id: string, updates: Partial<Note>): Promise<void> => {
    StorageService.updateNote(id, updates);
    syncStateFromStorage();
  };

  const deleteNote = async (id: string): Promise<void> => {
    StorageService.deleteNote(id);
    syncStateFromStorage();
  };

  const addLecture = async (lectureData: Omit<Lecture, 'id' | 'createdAt'>): Promise<Lecture> => {
    const created = StorageService.addLecture(lectureData);
    syncStateFromStorage();
    return created;
  };

  const updateLecture = async (id: string, updates: Partial<Lecture>): Promise<void> => {
    StorageService.updateLecture(id, updates);
    syncStateFromStorage();
  };

  const deleteLecture = async (id: string): Promise<void> => {
    StorageService.deleteLecture(id);
    syncStateFromStorage();
  };

  const addDPP = async (dppData: Omit<DPP, 'id' | 'createdAt'>): Promise<DPP> => {
    const created = StorageService.addDPP(dppData);
    syncStateFromStorage();
    return created;
  };

  const updateDPP = async (id: string, updates: Partial<DPP>): Promise<void> => {
    StorageService.updateDPP(id, updates);
    syncStateFromStorage();
  };

  const deleteDPP = async (id: string): Promise<void> => {
    StorageService.deleteDPP(id);
    syncStateFromStorage();
  };

  const addBatch = async (batchData: Omit<Batch, 'batchId' | 'createdAt'>): Promise<Batch> => {
    const created = StorageService.addBatch(batchData);
    syncStateFromStorage();
    return created;
  };

  const updateBatch = async (id: string, updates: Partial<Batch>): Promise<void> => {
    StorageService.updateBatch(id, updates);
    syncStateFromStorage();
  };

  const deleteBatch = async (id: string): Promise<void> => {
    StorageService.deleteBatch(id);
    syncStateFromStorage();
  };

  const addTest = async (testData: Omit<TestItem, 'testId' | 'createdAt'>): Promise<TestItem> => {
    const created = StorageService.addTest(testData);
    syncStateFromStorage();
    return created;
  };

  const submitTestResult = async (resultData: Omit<TestResultItem, 'resultId' | 'submittedAt'>): Promise<TestResultItem> => {
    const created = await FirestoreDataService.submitTestResult(resultData);
    return created;
  };

  const triggerNotification = async (data: {
    title: string;
    message: string;
    targetType: 'all' | 'class' | 'batch' | 'student';
    targetClass?: string;
    targetBatch?: string;
    targetStudentId?: string;
    actionTab?: any;
    imageURL?: string;
  }): Promise<NotificationItem> => {
    const created = StorageService.addNotification(data);
    syncStateFromStorage();
    return created;
  };

  const markNotificationAsRead = async (notificationId: string, userId: string): Promise<void> => {
    StorageService.markNotificationAsRead(notificationId, userId);
    syncStateFromStorage();
  };

  const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
    StorageService.markAllNotificationsAsRead(userId);
    syncStateFromStorage();
  };

  const refreshData = async (): Promise<void> => {
    await StorageService.syncFromFirestore();
    syncStateFromStorage();
  };

  return (
    <DataContext.Provider
      value={{
        notes,
        lectures,
        dpps,
        batches,
        tests,
        notifications,
        students,
        isRealtimeActive,
        isOnline,
        lastSyncTime,
        addNote,
        updateNote,
        deleteNote,
        addLecture,
        updateLecture,
        deleteLecture,
        addDPP,
        updateDPP,
        deleteDPP,
        addBatch,
        updateBatch,
        deleteBatch,
        addTest,
        submitTestResult,
        triggerNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        refreshData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
