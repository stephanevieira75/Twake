import React, { useEffect, useState } from 'react';

import Banner from 'app/components/Banner/Banner';
import { Button, Typography } from 'antd';
import Languages from 'services/languages/languages.js';
import ModalManager from 'app/components/Modal/ModalManager';
import UnverifiedAccount from './popups/UnverifiedAccount';
import BlockedAccount from './popups/BlockedAccount';

const AccountStatusComponent = (): JSX.Element => {
  const [period, setPeriod] = useState<number>(0);
  const [displayBanner, setDisplayBanner] = useState<boolean>(false);
  const periodLimit: number = 30;

  useEffect(() => {
    calculateTrialPeriod();
    isBlockedAccount();
  }, [period, displayBanner]);

  const calculateTrialPeriod = (): void => {
    const oneDay: number = 1000 * 60 * 60 * 24;
    // user created_at
    const createdDay: number = new Date(2021, 2, 1, 1, 1, 1, 1).getTime();
    const currentDay: number = Date.now();
    const shouldDisplayBanner: boolean =
      period > periodLimit - 7 && period < periodLimit ? true : false;
    const currentPeriod: number = Math.round(Math.round(currentDay - createdDay) / oneDay);

    setPeriod(currentPeriod);
    return setDisplayBanner(shouldDisplayBanner);
  };

  const calculateDaysLeft = (period: number) => Math.trunc(period);

  const onClickButton = () =>
    ModalManager.open(<UnverifiedAccount period={calculateDaysLeft(periodLimit - period)} />, {
      position: 'center',
      size: { width: '600px' },
    });

  const isBlockedAccount = () => {
    if (period >= periodLimit)
      return ModalManager.open(
        <BlockedAccount />,
        {
          position: 'center',
          size: { width: '600px' },
        },
        false,
      );
  };

  return (
    <>
      {displayBanner && (
        <Banner
          type="important"
          content={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography.Title level={5} style={{ marginBottom: 0, color: 'var(--white)' }}>
                {Languages.t('components.account_verification_status_sentence', [
                  Languages.t('components.account_verication_status_unverified'),
                ])}
              </Typography.Title>
              <Button
                style={{ marginLeft: 17, height: 32, color: 'var(--red)' }}
                onClick={onClickButton}
              >
                {Languages.t('general.verify')}
              </Button>
            </div>
          }
        />
      )}
    </>
  );
};

export default AccountStatusComponent;
