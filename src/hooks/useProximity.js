import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to simulate proximity detection and matching logic.
 * In a real-world scenario, this would interface with Bluetooth LE or Geolocation APIs.
 */
export const useProximity = (isActive) => {
  const [matchingState, setMatchingState] = useState('none'); // none, searching, approaching, locking, match_found, bridge
  const [myAnchor, setMyAnchor] = useState('');
  const [theirAnchor, setTheirAnchor] = useState('');
  const [matchData, setMatchData] = useState(null);
  const [distance, setDistance] = useState(100);
  const [signalStrength, setSignalStrength] = useState(0);

  useEffect(() => {
    let timer;
    if (isActive) {
      if (matchingState === 'none') {
        setMatchingState('searching');
        setDistance(100);
        setSignalStrength(1);
      }

      if (matchingState === 'searching') {
        timer = setTimeout(() => {
          setMatchingState('approaching');
          setDistance(45 + Math.random() * 10);
          setSignalStrength(2);
        }, 3000 + Math.random() * 2000);
      }

      if (matchingState === 'approaching') {
        timer = setTimeout(() => {
          setMatchingState('locking');
          setDistance(5 + Math.random() * 5);
          setSignalStrength(4);
        }, 3000 + Math.random() * 2000);
      }

      if (matchingState === 'locking') {
        timer = setTimeout(() => {
          setMatchingState('match_found');
          setDistance(1 + Math.random() * 2);
          setSignalStrength(5);
        }, 2000 + Math.random() * 1000);
      }
    } else {
      setMatchingState('none');
      setMyAnchor('');
      setTheirAnchor('');
      setMatchData(null);
      setDistance(100);
      setSignalStrength(0);
    }

    return () => clearTimeout(timer);
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
