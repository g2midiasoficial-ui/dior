import React from 'react';
import { DiorfyLandingPage } from '../landing/DiorfyLandingPage';
import { UserProfile } from '../../types/auth';

interface SalesPageProps {
  onEnterPlatform: (user?: UserProfile) => void;
  onOpenBoard?: (boardId: string) => void;
}

export const SalesPage: React.FC<SalesPageProps> = ({
  onEnterPlatform,
  onOpenBoard,
}) => {
  return (
    <DiorfyLandingPage
      onEnterPlatform={onEnterPlatform}
      onOpenBoard={onOpenBoard}
    />
  );
};
