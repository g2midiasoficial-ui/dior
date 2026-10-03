import React from 'react';
import { DiorfyLandingPage } from '../landing/DiorfyLandingPage';

interface SalesPageProps {
  onEnterPlatform: () => void;
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
