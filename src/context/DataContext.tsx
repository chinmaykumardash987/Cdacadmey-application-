import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { StorageService } from '../services/storage';
import { FirestoreDataService } from '../services/firestoreData';
import { useAuth } from './AuthContext';
import {
  Note,
  Lecture,
  DPP,
  Batch,
  TestItem,
  TestResultItem,
  NotificationItem,
  User,
  Bookmark,
  BookmarkItemType
} from '../types';

interface DataContextType {
  notes: Note[];
  lectures: Lecture[];
  dpps: DPP[];
  batches: Batch[];
  tests: TestItem[];
  notifications: NotificationItem[];
  students: User[];
  bookmarks: Bookmark[];
  savedNotes: Note[];
  savedLectures: Lecture[];
  savedCount: number;
  isBookmarked: (itemId: string, itemType?: BookmarkItemType) => boolean;
  toggleBookmark: (item: Note | Lecture, itemType: BookmarkItemType) => Promise<boolean>;
  removeBookmark: (bookmarkId: string) => Promise<void>;
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
  deleteTest: (testId: string) => Promise<void>;
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
  const { user } = useAuth();
  const currentUserId = user?.id || 'std_student';

  const [notes, setNotes] = useState<Note[]>(() => StorageService.getNotes());
  const [lectures, setLectures] = useState<Lecture[]>(() => StorageService.getLectures());
  const [dpps, setDPPs] = useState<DPP[]>(() => StorageService.getDPPs());
  const [batches, setBatches] = useState<Batch[]>(() => StorageService.getBatches());
  const [tests, setTests] = useState<TestItem[]>(() => StorageService.getTests());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => StorageService.getNotifications());
  const [students, setStudents] = useState<User[]>(() => StorageService.getStudents());
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => StorageService.getBookmarks(currentUserId));
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
    setBookmarks(StorageService.getBookmarks(currentUserId));
    setLastSyncTime(new Date());
  }, [currentUserId]);

  // Load and subscribe bookmarks when user changes
  useEffect(() => {
    const loaded = StorageService.getBookmarks(currentUserId);
    setBookmarks(loaded);

    // Subscribe to Firestore bookmarks for this student
    const unsubBookmarks = FirestoreDataService.subscribeUserBookmarks(currentUserId, (bms) => {
      setBookmarks(bms);
      StorageService.saveBookmarks(bms, currentUserId);
    });

    return () => unsubBookmarks();
  }, [currentUserId]);

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

  // Bookmarks helper functions
  const isBookmarked = useCallback((itemId: string, itemType?: BookmarkItemType) => {
    return bookmarks.some(b => b.itemId === itemId && (!itemType || b.itemType === itemType));
  }, [bookmarks]);

  const toggleBookmark = useCallback(async (item: Note | Lecture, itemType: BookmarkItemType): Promise<boolean> => {
    const res = await StorageService.toggleBookmark(item, itemType, currentUserId);
    const updated = StorageService.getBookmarks(currentUserId);
    setBookmarks(updated);
    return res.isBookmarked;
  }, [currentUserId]);

  const removeBookmark = useCallback(async (bookmarkId: string): Promise<void> => {
    await StorageService.removeBookmark(bookmarkId, currentUserId);
    const updated = StorageService.getBookmarks(currentUserId);
    setBookmarks(updated);
  }, [currentUserId]);

  // Saved Notes and Lectures mapped to live materials
  const savedNotes = useMemo(() => {
    const noteBookmarks = bookmarks.filter(b => b.itemType === 'note');
    return noteBookmarks.map(b => {
      const live = notes.find(n => n.id === b.itemId);
      if (live) return live;
      return {
        id: b.itemId,
        title: b.title,
        classLevel: b.classLevel,
        subject: b.subject,
        chapter: b.chapter,
        description: b.description || '',
        fileUrl: b.fileUrl || '',
        fileName: b.fileName || `${b.title}.pdf`,
        fileSize: b.fileSize || '2.5 MB',
        pageCount: b.pageCount || 10,
        uploaderId: 'cd-faculty',
        createdAt: b.savedAt,
        youtubeVideoUrl: b.youtubeVideoUrl,
        youtubeVideoTitle: b.youtubeVideoTitle
      } as Note;
    });
  }, [bookmarks, notes]);

  const savedLectures = useMemo(() => {
    const lectureBookmarks = bookmarks.filter(b => b.itemType === 'lecture');
    return lectureBookmarks.map(b => {
      const live = lectures.find(l => l.id === b.itemId);
      if (live) return live;
      return {
        id: b.itemId,
        title: b.title,
        classLevel: b.classLevel,
        subject: b.subject,
        chapter: b.chapter,
        lectureNumber: b.lectureNumber || '01',
        description: b.description || '',
        videoUrl: b.videoUrl || '',
        thumbnailUrl: b.thumbnailUrl || '',
        duration: b.duration || '45 mins',
        uploaderId: 'cd-faculty',
        createdAt: b.savedAt
      } as Lecture;
    });
  }, [bookmarks, lectures]);

  const savedCount = bookmarks.length;

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

  const deleteTest = async (testId: string): Promise<void> => {
    StorageService.deleteTest(testId);
    syncStateFromStorage();
  };

  const submitTestResult = async (resultData: Omit<TestResultItem, 'resultId' | 'submittedAt'>): Promise<TestResultItem> => {
    const res = await FirestoreDataService.submitTestResult(resultData);
    syncStateFromStorage();
    return res;
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
    const notif = await FirestoreDataService.triggerNotification(data);
    syncStateFromStorage();
    return notif;
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
        bookmarks,
        savedNotes,
        savedLectures,
        savedCount,
        isBookmarked,
        toggleBookmark,
        removeBookmark,
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
        deleteTest,
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
