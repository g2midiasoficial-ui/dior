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

// --- Authentication Service ---

export async function loginWithGoogle(): Promise<UserProfile> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    
    // Check if profile exists in Firestore
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
  } catch (err) {
    console.error('Google Auth Error:', err);
    throw err;
  }
}

export async function logoutFirebase(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (err) {
    console.error('Logout error:', err);
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
  if (!userId) {
    const local = loadBoards();
    onBoardsUpdated(local);
    return () => {};
  }

  const q = query(
    collection(db, BOARDS_COLLECTION),
    where('ownerId', '==', userId)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // Seed initial boards to Firestore if first time
        const local = loadBoards();
        onBoardsUpdated(local);
        return;
      }

      const remoteBoards: BoardItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        remoteBoards.push({
          id: data.id || docSnap.id,
          title: data.title,
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
  const currentUid = userId || auth.currentUser?.uid || 'usr-default-g2';
  
  // 1. Update local storage instantly for zero-latency UX
  const localBoards = loadBoards();
  const existingIdx = localBoards.findIndex((b) => b.id === board.id);
  if (existingIdx !== -1) {
    localBoards[existingIdx] = board;
  } else {
    localBoards.unshift(board);
  }
  saveBoards(localBoards);

  // 2. Persist to Firestore if authenticated
  if (auth.currentUser) {
    const boardDocRef = doc(db, BOARDS_COLLECTION, board.id);
    const sanitized = sanitizeBoardForFirestore(board, auth.currentUser.uid);
    try {
      await setDoc(boardDocRef, sanitized, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${BOARDS_COLLECTION}/${board.id}`);
    }
  }
}

export async function deleteBoardFromDb(boardId: string): Promise<void> {
  // 1. Update local storage
  const localBoards = loadBoards().filter((b) => b.id !== boardId);
  saveBoards(localBoards);

  // 2. Delete from Firestore
  if (auth.currentUser) {
    const boardDocRef = doc(db, BOARDS_COLLECTION, boardId);
    try {
      await deleteDoc(boardDocRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${BOARDS_COLLECTION}/${boardId}`);
    }
  }
}

export async function saveUserProfileToDb(profile: UserProfile): Promise<void> {
  if (auth.currentUser) {
    const userDocRef = doc(db, USERS_COLLECTION, profile.id);
    try {
      await setDoc(userDocRef, {
        id: profile.id,
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
      handleFirestoreError(err, OperationType.WRITE, `${USERS_COLLECTION}/${profile.id}`);
    }
  }
}
