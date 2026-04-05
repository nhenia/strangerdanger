import { useState, useEffect } from 'react';
import { calculateSignalBars, calculateDistance } from '../utils/proximity';

/**
 * Custom hook to simulate the "Searching" lifecycle for Permission.
 * It manages signal strength, distance, and the automatic match-found state.
 */
export const useProximity = (isActive, onMatchFound) => {
  const [signalBars, setSignalBars] = useState(1);
  const [distance, setDistance] = useState(100);

  useEffect(() => {
    let interval;
    let timeout;

    if (isActive) {
      interval = setInterval(() => {
        setSignalBars(prev => calculateSignalBars(prev));
        setDistance(prev => calculateDistance(prev));
      }, 1500);

      // Trigger a "match found" event after 7 seconds of searching
      timeout = setTimeout(() => {
        onMatchFound();
      }, 7000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isActive, onMatchFound]);

  return { signalBars, distance };
};
