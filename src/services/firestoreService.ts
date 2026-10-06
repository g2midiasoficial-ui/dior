import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  signOut as fbSignOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { BoardItem } from '../types/miro';
import { UserProfile, UserPlan } from '../types/auth';
import { INITIAL_BOARDS } from '../data/initialBoards';
import { loadBoards, saveBoards } from '../utils/storage';

const BOARDS_COLLECTION = 'boards';
const USERS_COLLECTION = 'users';

// --- Ensure Active Firebase Auth Session ---
export async function ensureAuthenticatedSession(): Promise<FirebaseUser> {
  if (auth.currentUser) {
    return auth.currentUser;
  }
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    console.warn('Anonymous auth initialization:', err);
    throw err;
  }
}

// --- Authentication Services ---

export async function loginWithGoogle(): Promise<UserProfile> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    
    // Check or create profile in Firestore
    const userDocRef = doc(db, USERS_COLLECTION, fbUser.uid);
    let userProfile: UserProfile;

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        userProfile = snap.data() as UserProfile;
      } else {
        userProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Usuário Diorfy',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fbUser.displayName || 'Diorfy')}`,
          plan: 'pro',
          billingCycle: 'monthly',
          company: 'Workspace Pessoal',
          createdAt: new Date().toISOString().split('T')[0],
        };
        await setDoc(userDocRef, {
          ...userProfile,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    } catch {
      userProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Usuário Diorfy',
        email: fbUser.email || '',
        avatar: fbUser.photoURL || '',
        plan: 'pro',
        billingCycle: 'monthly',
        company: 'Workspace Pessoal',
        createdAt: new Date().toISOString().split('T')[0],
      };
    }

    return userProfile;
  } catch (err: any) {
    // Graceful handling for popup closures and cancellations
    if (
      err?.code === 'auth/popup-closed-by-user' ||
      err?.code === 'auth/cancelled-popup-request' ||
      err?.code === 'auth/popup-blocked'
    ) {
      throw err;
    }
    console.warn('Google Auth note:', err?.message);
    throw err;
  }
}

export async function loginWithEmailOrGuest(
  email: string,
  password?: string,
  name?: string,
  isRegister: boolean = false,
  selectedPlan: UserPlan = 'pro'
): Promise<UserProfile> {
  let fbUser: FirebaseUser | null = null;

  // 1. Try Firebase Email/Password Auth
  if (email && password) {
    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        fbUser = cred.user;
        if (name) {
          await updateProfile(fbUser, { displayName: name });
        }
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        fbUser = cred.user;
      }
    } catch (err: any) {
      console.warn('Firebase Email/Password login fallback to session:', err?.message);
      // Fallback: If email provider is disabled or user already exists, sign in anonymously or use active session
      try {
        const cred = await signInAnonymously(auth);
        fbUser = cred.user;
        if (name) {
          await updateProfile(fbUser, { displayName: name });
        }
      } catch {
        // Continue with local uid
      }
    }
  }

  // 2. Fallback to anonymous auth if still not signed in
  if (!fbUser && !auth.currentUser) {
    try {
      const cred = await signInAnonymously(auth);
      fbUser = cred.user;
    } catch {}
  }

  const activeUid = fbUser?.uid || auth.currentUser?.uid || `usr-${Date.now()}`;
  const displayName = name || fbUser?.displayName || email.split('@')[0] || 'Usuário Diorfy';

  const userProfile: UserProfile = {
    id: activeUid,
    name: displayName,
    email: email.trim().toLowerCase(),
    avatar: fbUser?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
    plan: selectedPlan,
    billingCycle: 'monthly',
    company: 'Workspace Diorfy',
    createdAt: new Date().toISOString().split('T')[0],
  };

  // Save to Firestore
  try {
    const userDocRef = doc(db, USERS_COLLECTION, activeUid);
    await setDoc(userDocRef, {
      ...userProfile,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }, { merge: true });
  } catch (err) {
    console.warn('Could not write user profile to Firestore:', err);
  }

  return userProfile;
}

export async function logoutFirebase(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (err) {
    console.warn('Logout note:', err);
  }
}

export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// --- Firestore Board Data Services ---

export function sanitizeBoardForFirestore(board: BoardItem, userId: string) {
  return {
    id: board.id,
    title: board.title || 'Quadro sem título',
    ownerId: userId,
    ownerName: board.owner || 'G2 midias',
    owner: board.owner || 'G2 midias',
    category: 'Geral',
    isFavorite: Boolean(board.isStarred),
    isStarred: Boolean(board.isStarred),
    isReadOnly: Boolean(board.isReadOnly),
    icon: board.icon || 'folder',
    iconBg: board.iconBg || 'bg-blue-100 text-blue-600',
    description: board.description || '',
    elements: board.elements || [],
    frames: board.frames || [],
    comments: board.comments || [],
    collaborators: [],
    elementsCount: (board.elements?.length || 0),
    thumbnail: '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    openedAt: 'Agora',
  };
}

export function subscribeToUserBoards(
  userId: string,
  onBoardsUpdated: (boards: BoardItem[]) => void
): () => void {
  // Listen to all boards in Firestore
  const boardsCollectionRef = collection(db, BOARDS_COLLECTION);

  const unsubscribe = onSnapshot(
    boardsCollectionRef,
    (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is empty, seed initial boards to Firestore
        const local = loadBoards();
        onBoardsUpdated(local);
        local.forEach((b) => {
          saveBoardToDb(b, userId).catch(() => {});
        });
        return;
      }

      const remoteBoards: BoardItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        remoteBoards.push({
          id: data.id || docSnap.id,
          title: data.title || 'Sem título',
          icon: data.icon || 'folder',
          iconBg: data.iconBg || 'bg-blue-100 text-blue-600',
          isReadOnly: Boolean(data.isReadOnly),
          isStarred: Boolean(data.isStarred || data.isFavorite),
          owner: data.owner || data.ownerName || 'Você',
          updatedAt: 'Recente',
          openedAt: data.openedAt || 'Agora',
          description: data.description || '',
          elements: data.elements || [],
          frames: data.frames || [],
          comments: data.comments || [],
        });
      });

      saveBoards(remoteBoards);
      onBoardsUpdated(remoteBoards);
    },
    (error) => {
      console.warn('Firestore subscription fallback to local storage:', error.message);
      onBoardsUpdated(loadBoards());
    }
  );

  return unsubscribe;
}

export async function saveBoardToDb(board: BoardItem, userId?: string): Promise<void> {
  // 1. Update local storage instantly for zero-latency UX
  const localBoards = loadBoards();
  const existingIdx = localBoards.findIndex((b) => b.id === board.id);
  if (existingIdx !== -1) {
    localBoards[existingIdx] = board;
  } else {
    localBoards.unshift(board);
  }
  saveBoards(localBoards);

  // 2. Ensure we have an authenticated session
  let currentUid = userId || auth.currentUser?.uid;
  if (!auth.currentUser) {
    try {
      const user = await ensureAuthenticatedSession();
      currentUid = user.uid;
    } catch {}
  }

  // 3. Persist directly to Firestore
  try {
    const boardDocRef = doc(db, BOARDS_COLLECTION, board.id);
    const sanitized = sanitizeBoardForFirestore(board, currentUid || 'usr-default');
    await setDoc(boardDocRef, sanitized, { merge: true });
  } catch (err) {
    console.warn('Firestore saveBoardToDb note:', err);
  }
}

export async function deleteBoardFromDb(boardId: string): Promise<void> {
  // 1. Update local storage
  const localBoards = loadBoards().filter((b) => b.id !== boardId);
  saveBoards(localBoards);

  // 2. Ensure auth session and delete from Firestore
  if (!auth.currentUser) {
    try {
      await ensureAuthenticatedSession();
    } catch {}
  }

  try {
    const boardDocRef = doc(db, BOARDS_COLLECTION, boardId);
    await deleteDoc(boardDocRef);
  } catch (err) {
    console.warn('Firestore deleteBoardFromDb note:', err);
  }
}

export async function saveUserProfileToDb(profile: UserProfile): Promise<void> {
  if (!auth.currentUser) {
    try {
      await ensureAuthenticatedSession();
    } catch {}
  }

  try {
    const targetUid = profile.id || auth.currentUser?.uid || 'usr-default';
    const userDocRef = doc(db, USERS_COLLECTION, targetUid);
    await setDoc(userDocRef, {
      id: targetUid,
      email: profile.email,
      name: profile.name,
      plan: profile.plan,
      avatar: profile.avatar || '',
      company: profile.company || '',
      billingCycle: profile.billingCycle || 'monthly',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveUserProfileToDb note:', err);
  }
}
