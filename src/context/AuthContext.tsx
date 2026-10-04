import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ClassLevel } from '../types';
import { StorageService } from '../services/storage';
import { INITIAL_STUDENTS, INITIAL_ADMIN } from '../services/initialData';

interface AuthContextType {
  user: User | null;
  selectedClass: ClassLevel;
  setSelectedClass: (cls: ClassLevel) => void;
  loginStudent: (identifier: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  signUpStudent: (data: {
    fullName: string;
    email: string;
    phone: string;
    classLevel: ClassLevel;
    password?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isStudent: boolean;
  quickLoginAs: (role: 'student11' | 'student12' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'cd_academy_current_user_v1';
const SELECTED_CLASS_KEY = 'cd_academy_selected_class_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    // Default to Aarav (Class 11) for immediate friendly demo, or can start logged in
    return INITIAL_STUDENTS[0];
  });

  const [selectedClass, setSelectedClassState] = useState<ClassLevel>(() => {
    const saved = localStorage.getItem(SELECTED_CLASS_KEY);
    if (saved === 'Class 11' || saved === 'Class 12') return saved;
    return (user?.classLevel === 'Class 12' ? 'Class 12' : 'Class 11');
  });

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

  const loginStudent = async (identifier: string, _password?: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const students = StorageService.getStudents();
    const found = students.find(
      s => s.email.toLowerCase() === cleanId || s.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
    );

    if (!found) {
      return { success: false, message: 'Student account not found. Please sign up or check your details.' };
    }

    if (found.status === 'suspended') {
      return { success: false, message: 'Your account has been deactivated by administration. Please contact support.' };
    }

    setUser(found);
    if (found.classLevel === 'Class 11' || found.classLevel === 'Class 12') {
      setSelectedClass(found.classLevel);
    }
    return { success: true };
  };

  const signUpStudent = async (data: {
    fullName: string;
    email: string;
    phone: string;
    classLevel: ClassLevel;
    password?: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const students = StorageService.getStudents();
    const exists = students.some(s => s.email.toLowerCase() === cleanEmail);

    if (exists) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    const newStudent: User = {
      id: `student-${Date.now()}`,
      fullName: data.fullName.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      role: 'student',
      classLevel: data.classLevel,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    StorageService.addStudent(newStudent);
    setUser(newStudent);
    setSelectedClass(data.classLevel);
    return { success: true };
  };

  const loginAdmin = async (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password ? password.trim() : '';

    // Verify admin credentials
    const isAuthorizedEmail =
      cleanEmail === 'cdacademy992@gmail.com' ||
      cleanEmail === 'admin@cdacademy.com' ||
      cleanEmail === 'chinmaykumardash987@gmail.com';

    const isAuthorizedPassword =
      cleanPassword === 'chinmay@2006' ||
      cleanPassword === 'admin123';

    if (isAuthorizedEmail) {
      if (cleanPassword && !isAuthorizedPassword) {
        return {
          success: false,
          message: 'Incorrect admin password. Please enter your configured password.'
        };
      }

      const adminUser: User = {
        ...INITIAL_ADMIN,
        email: cleanEmail
      };
      setUser(adminUser);
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid administrator email. Authorized email: cdacademy992@gmail.com'
    };
  };

  const logout = () => {
    setUser(null);
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
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedClass,
        setSelectedClass,
        loginStudent,
        signUpStudent,
        loginAdmin,
        logout,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
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
