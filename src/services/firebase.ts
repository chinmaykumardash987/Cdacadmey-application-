import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import { StorageService } from './storage';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, authInstance?: Auth | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: authInstance?.currentUser?.uid || null,
      email: authInstance?.currentUser?.email || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

const defaultFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCDAcademyKeyMockOrCustomEnv',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'cd-academy-app.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cd-academy-app',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'cd-academy-app.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1029384756',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1029384756:web:987654321fedcba'
};

export const app: FirebaseApp = (() => {
  const customConfig = StorageService.getFirebaseConfig();
  const config = (customConfig && customConfig.apiKey && customConfig.projectId)
    ? customConfig
    : defaultFirebaseConfig;

  if (getApps().length > 0) {
    return getApps()[0];
  }
  return initializeApp(config);
})();

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export function initFirebase() {
  return { app, db, auth, isConfigured: true };
}

export async function testFirestoreConnection(database: Firestore | null = db) {
  if (!database) return false;
  try {
    await getDocFromServer(doc(database, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase offline or project not reachable.');
    }
    return false;
  }
}
