import { useState, useEffect } from 'react';
import { RegistryAlert } from '../types';

export const useInfoTip = (alerts: RegistryAlert[], selectedId: number | null) => {
  const [showInfoTip, setShowInfoTip] = useState(false);
  const [tipAlert, setTipAlert] = useState<RegistryAlert | null>(
    alerts?.[0] ?? null
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const shouldShow = Math.random() < 0.5;
      setShowInfoTip(shouldShow);
      if (shouldShow && alerts?.length) {
        setTipAlert(alerts[Math.floor(Math.random() * alerts.length)]);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [alerts]);

  useEffect(() => {
    if (selectedId !== null) {
      const shouldShow = Math.random() < 0.7;
      setShowInfoTip(shouldShow);
      if (shouldShow && alerts?.length) {
        setTipAlert(alerts[Math.floor(Math.random() * alerts.length)]);
      }
    }
  }, [selectedId, alerts]);

  return {
    showInfoTip,
    setShowInfoTip,
    tipAlert,
  };
};