import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TopNav from './TopNav';
import { PrivacyLevel } from '../../../types';

const TopNavWrapper: React.FC = () => {
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('限定公開');
  const [showSettings, setShowSettings] = useState(false);

  return (
    <TopNav
      privacyLevel={privacyLevel}
      setPrivacyLevel={setPrivacyLevel}
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      onMenuClick={() => {}}
    />
  );
};

describe('TopNav privacy selector', () => {
  it('updates privacy level selection and closes the menu', async () => {
    render(<TopNavWrapper />);

    const triggerButton = screen.getByRole('button', { name: /限定公開/ });
    await userEvent.click(triggerButton);

    const minimalRadio = screen.getByRole('radio', { name: /最小公開/ });
    await userEvent.click(minimalRadio);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /最小公開/ })).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByRole('radio', { name: '最小公開' })).not.toBeInTheDocument();
    });
  });
});
