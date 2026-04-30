import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to simulate proximity detection and matching logic.
 * In a real-world scenario, this would interface with Bluetooth LE or Geolocation APIs.
 */
export const useProximity = (isActive) => {
  const [matchingState, setMatchingState] = useState('none'); // none, finding, match_found, bridge
  const [myAnchor, setMyAnchor] = useState('');
  const [theirAnchor, setTheirAnchor] = useState('');
  const [matchData, setMatchData] = useState(null);
  const [distance, setDistance] = useState(100);
  const [signalStrength, setSignalStrength] = useState(0);

  useEffect(() => {
    let timer;
    let walkInterval;

    if (isActive) {
      if (matchingState === 'none') {
        setMatchingState('finding');
        setDistance(100);
        setSignalStrength(1);
      }

      if (matchingState === 'finding') {
        // More granular distance/signal walk
        walkInterval = setInterval(() => {
          setDistance(prev => {
            const delta = Math.floor(Math.random() * 11) - 6; // -6 to 4 (bias towards getting closer)
            const next = Math.max(1, Math.min(100, prev + delta));
            return next;
          });

          setSignalStrength(prev => {
            const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            return Math.max(1, Math.min(5, prev + delta));
          });
        }, 1000);

        // Simulate finding a match after a random delay
        timer = setTimeout(() => {
          setMatchingState('match_found');
          setDistance(Math.floor(Math.random() * 10) + 1); // Jump to close distance
          setSignalStrength(5);
        }, 15000 + Math.random() * 5000); // Increased time for more "search" feel
      }
    } else {
      setMatchingState('none');
      setMyAnchor('');
      setTheirAnchor('');
      setMatchData(null);
      setDistance(100);
      setSignalStrength(0);
      clearInterval(walkInterval);
    }

    return () => {
        clearTimeout(timer);
        clearInterval(walkInterval);
    };
  }, [isActive, matchingState]);

  const acceptMatch = useCallback((anchor, generateHandshakeCallback) => {
    setMyAnchor(anchor);

    // Simulated anchor for the other person
    const sampleAnchors = ['Blue Book', 'Red Cap', 'Green Scarf', 'Corner Table', 'Laptop stickers', 'Yellow bag'];
    const selectedTheirAnchor = sampleAnchors[Math.floor(Math.random() * sampleAnchors.length)];
    setTheirAnchor(selectedTheirAnchor);

    if (generateHandshakeCallback) {
        const handshake = generateHandshakeCallback(anchor, selectedTheirAnchor);
        setMatchData(handshake);
    }

    setMatchingState('bridge');
  }, []);

  const reset = useCallback(() => {
    setMatchingState('none');
    setMyAnchor('');
    setTheirAnchor('');
    setMatchData(null);
    setDistance(100);
    setSignalStrength(0);
  }, []);

  return {
    matchingState,
    myAnchor,
    theirAnchor,
    matchData,
    distance,
    signalStrength,
    acceptMatch,
    reset
  };
};
