import React, { useState, useEffect } from 'react';
import { BoardItem } from './types/miro';
import { UserProfile, UserPlan } from './types/auth';
import { Dashboard } from './components/dashboard/Dashboard';
import { BoardCanvas } from './components/canvas/BoardCanvas';
import { SalesPage } from './components/sales/SalesPage';
import { AuthPage } from './components/auth/AuthPage';
import { UpgradeModal } from './components/dashboard/UpgradeModal';
import { getBoardById } from './utils/storage';
import { getCurrentUser, saveCurrentUser, logoutUser, updateUserPlan } from './utils/auth';
import { 
  queueBoardSave,
  flushBoardSave,
  fetchBoardFromDb,
  saveUserProfileToDb, 
  signOutUser, 
  subscribeToAuthChanges 
} from './services/dbService';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'sales' | 'auth' | 'dashboard' | 'canvas'>('sales');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [currentBoard, setCurrentBoard] = useState<BoardItem | null>(null);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  // Listen to Supabase Auth state in real-time
  useEffect(() => {
    const unsub = subscribeToAuthChanges((user, event) => {
      setCurrentUser(user);
      saveCurrentUser(user);
      // e.g. returning from the Google OAuth redirect
      if (user && event === 'SIGNED_IN') {
        setCurrentPage((page) => (page === 'sales' || page === 'auth' ? 'dashboard' : page));
      }
    });
    return () => unsub();
  }, []);

  // Load the board when currentBoardId changes: database first (source of truth), local copy as fallback
  useEffect(() => {
    if (!currentBoardId) return;
    let cancelled = false;
    (async () => {
      const remote = await fetchBoardFromDb(currentBoardId).catch(() => null);
      if (cancelled) return;
      const b = remote ?? getBoardById(currentBoardId);
      if (b) {
        setCurrentBoard(b);
        setCurrentPage('canvas');
      } else {
        setCurrentBoardId(null);
        setCurrentBoard(null);
        setCurrentPage(currentUser ? 'dashboard' : 'sales');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentBoardId, currentUser?.id]);

  const handleOpenBoard = (boardId: string) => {
    if (!currentUser) {
      setAuthInitialMode('login');
      setCurrentPage('auth');
      return;
    }
    setCurrentBoardId(boardId);
    setCurrentPage('canvas');
  };

  const handleBackToDashboard = () => {
    flushBoardSave();
    setCurrentBoardId(null);
    setCurrentBoard(null);
    setCurrentPage(currentUser ? 'dashboard' : 'sales');
  };

  const handleUpdateCurrentBoard = (updatedBoard: BoardItem) => {
    setCurrentBoard(updatedBoard);
    // Debounced: the canvas reports changes on every drag/pan/zoom frame
    queueBoardSave(updatedBoard);
  };

  const handleEnterPlatformFromSales = (user?: UserProfile) => {
    if (user) {
      handleAuthSuccess(user);
    } else if (currentUser) {
      setCurrentPage('dashboard');
    } else {
      setAuthInitialMode('login');
      setCurrentPage('auth');
    }
  };

  const handleOpenAuthPage = (mode: 'login' | 'register') => {
    setAuthInitialMode(mode);
    setCurrentPage('auth');
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    saveCurrentUser(user);
    saveUserProfileToDb(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    await flushBoardSave();
    await signOutUser();
    logoutUser();
    setCurrentUser(null);
    setCurrentBoardId(null);
    setCurrentBoard(null);
    setCurrentPage('sales');
  };

  const handleUpgradePlan = (plan: UserPlan) => {
    const updated = updateUserPlan(plan);
    if (updated) {
      setCurrentUser(updated);
      saveUserProfileToDb(updated);
    }
  };

  // 0. Board still loading from the database
  if (currentPage === 'canvas' && !currentBoard && currentBoardId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50 text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-indigo-600 animate-spin" />
        <p className="text-sm font-medium">Abrindo quadro…</p>
      </div>
    );
  }

  // 1. Full Canvas Page (Requires authenticated user)
  if (currentPage === 'canvas' && currentBoard) {
    if (!currentUser) {
      return (
        <AuthPage
          onBackToSales={() => setCurrentPage('sales')}
          onEnterPlatform={handleAuthSuccess}
          initialMode="login"
        />
      );
    }
    return (
      <BoardCanvas
        key={currentBoard.id}
        board={currentBoard}
        onBackToDashboard={handleBackToDashboard}
        onUpdateBoard={handleUpdateCurrentBoard}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
      />
    );
  }

  // 2. Full Auth Portal Page
  if (currentPage === 'auth') {
    return (
      <AuthPage
        onBackToSales={() => setCurrentPage('sales')}
        onEnterPlatform={handleAuthSuccess}
        initialMode={authInitialMode}
      />
    );
  }

  // 3. Platform Workspace Dashboard (Requires authenticated user)
  if (currentPage === 'dashboard') {
    if (!currentUser) {
      return (
        <AuthPage
          onBackToSales={() => setCurrentPage('sales')}
          onEnterPlatform={handleAuthSuccess}
          initialMode="login"
        />
      );
    }
    return (
      <>
        <Dashboard
          user={currentUser}
          onOpenBoard={handleOpenBoard}
          onOpenSalesPage={() => setCurrentPage('sales')}
          onLogout={handleLogout}
          onUpgradePlan={handleUpgradePlan}
        />
        <UpgradeModal
          isOpen={isUpgradeOpen}
          onClose={() => setIsUpgradeOpen(false)}
        />
      </>
    );
  }

  // 4. Default: Landing Page
  return (
    <SalesPage
      onEnterPlatform={handleEnterPlatformFromSales}
      onOpenBoard={handleOpenBoard}
    />
  );
}
