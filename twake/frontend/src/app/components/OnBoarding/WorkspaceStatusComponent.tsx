import React, { useEffect, useState } from 'react';
import ModalManager from 'app/components/Modal/ModalManager';
import AddMailsInWorkspace from './popups/AddMailsInWorkspace';
import RouterServices from 'app/services/RouterService';

const WorkspaceStatusProvider = (): JSX.Element => {
  const { workspaceId } = RouterServices.getStateFromRoute();
  const [totalMembers, setMembers] = useState<number>(1);
  const [totalGuests, setGuests] = useState<number>(0);

  useEffect(() => {
    displayAddMailsInWorkspace();
  }, [workspaceId, totalMembers, totalGuests]);

  const isNewWorkspace = (): boolean => {
    const oneDay: number = 1000 * 60 * 60 * 24;
    // workspace created_at
    const createdDay: number = new Date(2021, 2, 1, 1, 1, 1, 1).getTime();
    const currentDay: number = Date.now();
    const currentPeriod: number = Math.round(Math.round(currentDay - createdDay) / oneDay);

    return currentPeriod <= 7 ? true : false;
  };

  const displayAddMailsInWorkspace = (): void => {
    if (!workspaceId) return;

    const onboarding: string | null = localStorage.getItem(`onboarding_${workspaceId}`);
    const shouldDisplayModal: boolean =
      onboarding !== 'completed' && totalMembers === 1 && totalGuests === 0 && isNewWorkspace();

    if (shouldDisplayModal) {
      localStorage.setItem(`onboarding_${workspaceId}`, 'completed');
      return ModalManager.open(<AddMailsInWorkspace />, {
        position: 'center',
        size: { width: '600px' },
      });
    }
  };

  return <></>;
};

export default WorkspaceStatusProvider;
