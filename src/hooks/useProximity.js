import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to simulate proximity detection and matching logic.
 * In a real-world scenario, this would interface with Bluetooth LE or Geolocation APIs.
 */
export const useProximity = (isActive) => {
  const [matchingState, setMatchingState] = useState('none'); // none, searching, detecting, approaching, match_found, bridge
  const [myAnchor, setMyAnchor] = useState('');
  const [theirAnchor, setTheirAnchor] = useState('');
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    let timer;
    if (isActive) {
      if (matchingState === 'none') {
        setMatchingState('searching');
      }

      if (matchingState === 'searching') {
        // Simulate detecting a faint signal
        timer = setTimeout(() => {
          setMatchingState('detecting');
        }, 3000 + Math.random() * 2000); // 3-5 seconds
      }

      if (matchingState === 'detecting') {
        // Simulate signal getting stronger
        timer = setTimeout(() => {
          setMatchingState('approaching');
        }, 4000 + Math.random() * 2000); // 4-6 seconds
      }

      if (matchingState === 'approaching') {
        // Finalize match
        timer = setTimeout(() => {
          setMatchingState('match_found');
        }, 3000 + Math.random() * 2000); // 3-5 seconds
      }
    } else {
      setMatchingState('none');
      setMyAnchor('');
      setTheirAnchor('');
      setMatchData(null);
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
    acceptMatch,
    reset
  };
};
