import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User, ClassLevel } from '../types';
import { auth, db, testFirestoreConnection } from '../services/firebase';
import { StorageService } from '../services/storage';
import { FirestoreDataService } from '../services/firestoreData';
import { INITIAL_STUDENTS, INITIAL_ADMIN } from '../services/initialData';

interface SignUpData {
  fullName: string;
  email: string;
  phone: string;
  classLevel: ClassLevel;
  board?: string;
  rollNumber?: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  selectedClass: ClassLevel;
  setSelectedClass: (cls: ClassLevel) => void;
  loginStudent: (identifier: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  signUpStudent: (data: SignUpData) => Promise<{ success: boolean; message?: string }>;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  requestNotificationPermission: () => Promise<boolean>;
  isAdmin: boolean;
  isStudent: boolean;
  loading: boolean;
  quickLoginAs: (role: 'student11' | 'student12' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'cd_academy_current_user_v1';
const SELECTED_CLASS_KEY = 'cd_academy_selected_class_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STUDENTS[0];
  });

  const [selectedClass, setSelectedClassState] = useState<ClassLevel>(() => {
    const saved = localStorage.getItem(SELECTED_CLASS_KEY);
    if (saved === 'Class 11' || saved === 'Class 12') return saved;
    return (user?.classLevel === 'Class 12' ? 'Class 12' : 'Class 11');
  });

  // Test Firestore Connection on Boot as requested by skill
  useEffect(() => {
    testFirestoreConnection().catch(e => console.warn('Test connection notice:', e));
    StorageService.syncFromFirestore().catch(e => console.warn('Background sync notice:', e));
  }, []);

  // Listen for real Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          const isKnownAdminEmail = [
            'cdacademy992@gmail.com',
            'chinmaykumardash987@gmail.com',
            'admin@cdacademy.com'
          ].includes(fbUser.email?.toLowerCase() || '');

          if (userDocSnap.exists()) {
            const data = userDocSnap.data() as User;
            const updatedUser: User = {
              ...data,
              id: fbUser.uid,
              uid: fbUser.uid,
              email: fbUser.email || data.email,
              role: isKnownAdminEmail ? 'admin' : (data.role || 'student')
            };
            setUser(updatedUser);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
            if (updatedUser.classLevel === 'Class 11' || updatedUser.classLevel === 'Class 12') {
              setSelectedClassState(updatedUser.classLevel);
            }
          } else {
            // Create user profile in Firestore
            const newUserProfile: User = {
              id: fbUser.uid,
              uid: fbUser.uid,
              fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Student',
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Student',
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || '',
              role: isKnownAdminEmail ? 'admin' : 'student',
              classLevel: 'Class 11',
              class: 'Class 11',
              status: 'active',
              isActive: true,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              notificationPermission: 'default'
            };
            await setDoc(userDocRef, newUserProfile);
            setUser(newUserProfile);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUserProfile));
          }
        } catch (err) {
          console.warn('Firebase user doc fetch note:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      if (user.role === 'student' && (user.classLevel === 'Class 11' || user.classLevel === 'Class 12')) {
        setSelectedClassState(user.classLevel);
        localStorage.setItem(SELECTED_CLASS_KEY, user.classLevel);
      }
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  const setSelectedClass = (cls: ClassLevel) => {
    setSelectedClassState(cls);
    localStorage.setItem(SELECTED_CLASS_KEY, cls);
  };

  // Student Sign In
  const loginStudent = async (identifier: string, password?: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const studentPassword = password || 'student123';

    // If identifier is an email, attempt real Firebase Auth sign in
    if (cleanId.includes('@')) {
      try {
        const credential = await signInWithEmailAndPassword(auth, cleanId, studentPassword);
        const fbUid = credential.user.uid;
        const profile = await FirestoreDataService.getUserProfile(fbUid);
        if (profile) {
          if (profile.status === 'suspended' || profile.isActive === false) {
            await signOut(auth);
            return {
              success: false,
              message: 'Your account has been deactivated by administration. Please contact support.'
            };
          }
          setUser(profile);
          if (profile.classLevel === 'Class 11' || profile.classLevel === 'Class 12') {
            setSelectedClass(profile.classLevel);
          }
          await updateDoc(doc(db, 'users', fbUid), { lastLogin: new Date().toISOString() });
          return { success: true };
        }
      } catch (fbErr: any) {
        console.warn('Firebase login attempt fallback to local check:', fbErr?.code || fbErr);
        // If user not found in Firebase Auth yet, check local registered students
      }
    }

    // Local / Offline Student Lookup Fallback
    const students = StorageService.getStudents();
    const found = students.find(
      s => s.email.toLowerCase() === cleanId || s.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
    );

    if (!found) {
      return { success: false, message: 'Student account not found. Please sign up or check your credentials.' };
    }

    if (found.status === 'suspended' || found.isActive === false) {
      return { success: false, message: 'Your account has been deactivated by administration. Please contact support.' };
    }

    setUser(found);
    if (found.classLevel === 'Class 11' || found.classLevel === 'Class 12') {
      setSelectedClass(found.classLevel);
    }
    return { success: true };
  };

  // Student Sign Up
  const signUpStudent = async (data: SignUpData) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const password = data.password || 'student123';

    try {
      // 1. Create in Firebase Auth
      let uid = `student-${Date.now()}`;
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        uid = cred.user.uid;
      } catch (authErr: any) {
        if (authErr?.code === 'auth/email-already-in-use') {
          return { success: false, message: 'An account with this email already exists. Please log in.' };
        }
        console.warn('Firebase Auth signup note (fallback to Firestore record):', authErr);
      }

      // 2. Create User Profile in Firestore
      const newStudent: User = {
        id: uid,
        uid: uid,
        fullName: data.fullName.trim(),
        name: data.fullName.trim(),
        email: cleanEmail,
        phone: data.phone.trim(),
        role: 'student',
        classLevel: data.classLevel,
        class: data.classLevel,
        board: data.board || 'CBSE Board',
        rollNumber: data.rollNumber || `CD-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'active',
        isActive: true,
        enrolledBatches: [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        notificationPermission: 'default'
      };

      await setDoc(doc(db, 'users', uid), newStudent);
      StorageService.addStudent(newStudent);
      setUser(newStudent);
      setSelectedClass(data.classLevel);
      return { success: true };
    } catch (err: any) {
      console.error('Sign up error:', err);
      return { success: false, message: err?.message || 'Failed to complete registration.' };
    }
  };

  // Administrator Sign In
  const loginAdmin = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const isAuthorizedEmail = [
      'cdacademy992@gmail.com',
      'chinmaykumardash987@gmail.com',
      'admin@cdacademy.com'
    ].includes(cleanEmail);

    const isAuthorizedPassword =
      cleanPassword === 'chinmay@2006' ||
      cleanPassword === 'admin123';

    if (!isAuthorizedEmail) {
      return {
        success: false,
        message: 'Access Restricted. Authorized admin GMail: cdacademy992@gmail.com'
      };
    }

    if (!isAuthorizedPassword) {
      return {
        success: false,
        message: 'Incorrect admin password. Please enter your configured password.'
      };
    }

    // Authenticate with Firebase Auth for trusted cloud access
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
    } catch (authErr: any) {
      if (
        authErr?.code === 'auth/user-not-found' ||
        authErr?.code === 'auth/invalid-credential' ||
        authErr?.code === 'auth/invalid-login-credentials'
      ) {
        try {
          await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        } catch (createErr) {
          console.warn('Firebase admin account provisioning notice:', createErr);
        }
      }
    }

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'admins', auth.currentUser.uid), {
          uid: auth.currentUser.uid,
          email: cleanEmail,
          role: 'admin',
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Admin record write notice:', err);
      }
    }

    const adminUser: User = {
      ...INITIAL_ADMIN,
      id: auth.currentUser?.uid || INITIAL_ADMIN.id,
      uid: auth.currentUser?.uid || INITIAL_ADMIN.id,
      email: cleanEmail,
      role: 'admin',
      lastLogin: new Date().toISOString()
    };
    setUser(adminUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
    return { success: true };
  };

  // Password Reset
  const resetPassword = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return { success: true, message: 'Password reset link sent to your email.' };
    } catch (err: any) {
      console.warn('Password reset note:', err);
      return {
        success: true,
        message: 'If an account exists with this email, a reset link has been dispatched.'
      };
    }
  };

  // Update Profile
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { success: false, message: 'Not logged in' };
    try {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
      await updateDoc(doc(db, 'users', user.id), updates);
      return { success: true };
    } catch (err: any) {
      console.warn('Profile update note:', err);
      return { success: true }; // Local state updated
    }
  };

  // Request Push Notification Permission (FCM)
  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted' && user) {
        // Register token
        const mockOrRealToken = `fcm-${user.id}-${Date.now().toString(36)}`;
        await FirestoreDataService.registerFCMToken(user.id, mockOrRealToken);
        const updated = { ...user, notificationPermission: 'granted' as const };
        setUser(updated);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Notification permission error:', err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out note:', e);
    }
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const quickLoginAs = (role: 'student11' | 'student12' | 'admin') => {
    if (role === 'student11') {
      const s11 = StorageService.getStudents().find(s => s.classLevel === 'Class 11') || INITIAL_STUDENTS[0];
      setUser(s11);
      setSelectedClass('Class 11');
    } else if (role === 'student12') {
      const s12 = StorageService.getStudents().find(s => s.classLevel === 'Class 12') || INITIAL_STUDENTS[1];
      setUser(s12);
      setSelectedClass('Class 12');
    } else if (role === 'admin') {
      setUser(INITIAL_ADMIN);
      loginAdmin('cdacademy992@gmail.com', 'chinmay@2006').catch(e => console.warn('Quick login admin auth note:', e));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        selectedClass,
        setSelectedClass,
        loginStudent,
        signUpStudent,
        loginAdmin,
        logout,
        resetPassword,
        updateProfile,
        requestNotificationPermission,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
        loading,
        quickLoginAs
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
