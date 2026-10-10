import React, { useState, useEffect } from 'react';
import { BoardItem, BoardTemplate } from '../../types/miro';
import { UserProfile, UserPlan } from '../../types/auth';
import { Header } from './Header';
import { Sidebar, DashboardView } from './Sidebar';
import { TemplateCarousel } from './TemplateCarousel';
import { BoardGrid } from './BoardGrid';
import { UpgradeModal } from './UpgradeModal';
import { InviteModal } from './InviteModal';
import { AIModal } from '../canvas/AIModal';
import {
  loadBoards,
  getBoardById,
  createNewBoard,
  duplicateBoard,
  deleteBoard,
  toggleStarBoard,
  updateBoard,
} from '../../utils/storage';
import { 
  subscribeToUserBoards, 
  saveBoardToDb, 
  deleteBoardFromDb 
} from '../../services/dbService';
import confetti from 'canvas-confetti';

interface DashboardProps {
  user?: UserProfile;
  onOpenBoard: (boardId: string) => void;
  onOpenSalesPage?: () => void;
  onLogout?: () => void;
  onUpgradePlan?: (plan: UserPlan) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onOpenBoard,
  onOpenSalesPage,
  onLogout,
  onUpgradePlan,
}) => {
  const [boards, setBoards] = useState<BoardItem[]>(() => loadBoards());
  const [currentView, setCurrentView] = useState<DashboardView>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [teamName, setTeamName] = useState('drop');

  // Modals
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Live Firestore subscription for boards
  useEffect(() => {
    const unsub = subscribeToUserBoards(user?.id || '', (updatedBoards) => {
      setBoards(updatedBoards);
    });
    return () => unsub();
  }, [user?.id]);

  // Refresh boards from storage and db
  const refreshBoards = () => {
    setBoards(loadBoards());
  };

  const handleCreateNewBlankBoard = () => {
    const newBoard = createNewBoard('Sem título');
    saveBoardToDb(newBoard, user?.id);
    refreshBoards();
    onOpenBoard(newBoard.id);
  };

  const handleSelectTemplate = (template: BoardTemplate) => {
    if (template.id === 'blank') {
      handleCreateNewBlankBoard();
      return;
    }
    const newBoard = createNewBoard(
      template.title,
      template.elements,
      template.frames,
      template.description
    );
    saveBoardToDb(newBoard, user?.id);
    refreshBoards();
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}
    onOpenBoard(newBoard.id);
  };

  const handleToggleStar = (boardId: string) => {
    toggleStarBoard(boardId);
    const updated = getBoardById(boardId);
    if (updated) {
      saveBoardToDb(updated, user?.id);
    }
    refreshBoards();
  };

  const handleDuplicate = (boardId: string) => {
    const duplicated = duplicateBoard(boardId);
    if (duplicated) {
      saveBoardToDb(duplicated, user?.id);
    }
    refreshBoards();
  };

  const handleDelete = (boardId: string) => {
    deleteBoard(boardId);
    deleteBoardFromDb(boardId);
    refreshBoards();
  };

  const handleRename = (boardId: string, newTitle: string) => {
    const updated = updateBoard(boardId, (b) => ({ ...b, title: newTitle }));
    if (updated) {
      saveBoardToDb(updated, user?.id);
    }
    refreshBoards();
  };

  const handleToggleReadOnly = (boardId: string) => {
    const updated = updateBoard(boardId, (b) => ({ ...b, isReadOnly: !b.isReadOnly }));
    if (updated) {
      saveBoardToDb(updated, user?.id);
    }
    refreshBoards();
  };

  // Filter boards by sidebar view & search query
  const displayedBoards = boards.filter((b) => {
    if (currentView === 'favorites' && !b.isStarred) return false;
    if (currentView === 'recent') {
      return true;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchElements = b.elements.some((el) => el.content.toLowerCase().includes(q));
      return matchTitle || matchElements;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-screen w-screen bg-[#f5f5f7] overflow-hidden select-none">
      {/* Top Header */}
      <Header
        user={user}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onOpenInvite={() => setIsInviteOpen(true)}
        onOpenAiPlayground={() => setIsAIOpen(true)}
        onToggleMobileSidebar={() => setIsMobileMenuOpen((prev) => !prev)}
        onOpenSalesPage={onOpenSalesPage}
        onLogout={onLogout}
      />

      {/* Main Area: Sidebar + Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onViewChange={(v) => {
            setCurrentView(v);
            setIsMobileMenuOpen(false);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          teamName={teamName}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Right Content Area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
          {/* Top Carousel: Templates */}
          <TemplateCarousel
            onSelectTemplate={handleSelectTemplate}
            onExploreMiroverse={() => setIsAIOpen(true)}
          />

          {/* Boards grid */}
          <BoardGrid
            boards={displayedBoards}
            onOpenBoard={onOpenBoard}
            onCreateNewBoard={handleCreateNewBlankBoard}
            onExploreTemplates={() => setIsAIOpen(true)}
            onToggleStar={handleToggleStar}
            onDuplicateBoard={handleDuplicate}
            onDeleteBoard={handleDelete}
            onRenameBoard={handleRename}
            onToggleReadOnly={handleToggleReadOnly}
          />
        </main>
      </div>

      {/* Modals */}
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        teamName={teamName}
      />
      <AIModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onApplyAIGenerated={(elements, frames, title) => {
          const newBoard = createNewBoard(title || 'Quadro Gerado com Diorfy AI', elements, frames);
          saveBoardToDb(newBoard, user?.id);
          refreshBoards();
          onOpenBoard(newBoard.id);
        }}
      />
    </div>
  );
};
