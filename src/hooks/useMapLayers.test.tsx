import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useMapLayers } from './useMapLayers';
import { PrivacyLevel } from '../types';

const MapLayersTester: React.FC = () => {
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('フル公開');
  const { mapLayers, setMapLayers } = useMapLayers(privacyLevel);

  return (
    <div>
      <button onClick={() => setPrivacyLevel('フル公開')}>full</button>
      <button onClick={() => setPrivacyLevel('限定公開')}>limited</button>
      <button
        onClick={() => setMapLayers((prev) => ({ ...prev, night: true }))}
      >
        night-on
      </button>
      <div data-testid="night-state">{mapLayers.night ? 'on' : 'off'}</div>
    </div>
  );
};

describe('useMapLayers', () => {
  it('disables非許可レイヤー when privacy level is lowered', async () => {
    render(<MapLayersTester />);

    expect(screen.getByTestId('night-state').textContent).toBe('off');

    await userEvent.click(screen.getByText('night-on'));
    expect(screen.getByTestId('night-state').textContent).toBe('on');

    await userEvent.click(screen.getByText('limited'));
    expect(screen.getByTestId('night-state').textContent).toBe('off');
  });
});

