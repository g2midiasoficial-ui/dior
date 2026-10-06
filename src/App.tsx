import React, { useState, useEffect } from 'react';
import { BoardItem } from './types/miro';
import { UserProfile, UserPlan } from './types/auth';
import { Dashboard } from './components/dashboard/Dashboard';
import { BoardCanvas } from './components/canvas/BoardCanvas';
import { SalesPage } from './components/sales/SalesPage';
import { AuthPage } from './components/auth/AuthPage';
import { UpgradeModal } from './components/dashboard/UpgradeModal';
import { loadBoards, getBoardById, updateBoard } from './utils/storage';
import { getCurrentUser, saveCurrentUser, logoutUser, updateUserPlan } from './utils/auth';
import { 
  saveBoardToDb, 
  saveUserProfileToDb, 
  logoutFirebase, 
  subscribeToAuthChanges 
} from './services/firestoreService';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'sales' | 'auth' | 'dashboard' | 'canvas'>('sales');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [currentBoard, setCurrentBoard] = useState<BoardItem | null>(null);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  // Listen to Firebase Auth state in real-time
  useEffect(() => {
    const unsub = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      if (user) {
        saveCurrentUser(user);
      } else {
        saveCurrentUser(null);
      }
    });
    return () => unsub();
  }, []);

  // Sync board data when currentBoardId changes
  useEffect(() => {
    if (currentBoardId) {
      const b = getBoardById(currentBoardId);
      if (b) {
        setCurrentBoard(b);
        setCurrentPage('canvas');
      } else {
        setCurrentBoardId(null);
        setCurrentBoard(null);
        setCurrentPage(currentUser ? 'dashboard' : 'sales');
      }
    }
  }, [currentBoardId, currentUser]);

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
    setCurrentBoardId(null);
    setCurrentBoard(null);
    setCurrentPage(currentUser ? 'dashboard' : 'sales');
  };

  const handleUpdateCurrentBoard = (updatedBoard: BoardItem) => {
    setCurrentBoard(updatedBoard);
    updateBoard(updatedBoard.id, () => updatedBoard);
    if (currentUser) {
      saveBoardToDb(updatedBoard, currentUser.id);
    }
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
    await logoutFirebase();
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
