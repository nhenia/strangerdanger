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
  const [signalBars, setSignalBars] = useState(1);

  useEffect(() => {
    let timer;
    let interval;

    if (isActive) {
      if (matchingState === 'none') {
        setMatchingState('finding');
        setDistance(100);
        setSignalBars(1);
      }

      if (matchingState === 'finding') {
        // Simulate finding a match after a random delay
        timer = setTimeout(() => {
          if (interval) clearInterval(interval);
          setMatchingState('match_found');
          setDistance(0);
          setSignalBars(5);
        }, 7000 + Math.random() * 3000); // 7-10 seconds

        // Random walk for signal/distance simulation while finding
        interval = setInterval(() => {
          setSignalBars(prev => {
            const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            return Math.max(1, Math.min(5, prev + delta));
          });
          setDistance(prev => {
            // Gradually decrease distance
            const decrease = Math.floor(Math.random() * 10) + 5; // 5-15 meters per interval
            return Math.max(5, prev - decrease);
          });
        }, 1500);
      }
    } else {
      setMatchingState('none');
      setMyAnchor('');
      setTheirAnchor('');
      setMatchData(null);
      setDistance(100);
      setSignalBars(1);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isActive, matchingState]);

  const acceptMatch = useCallback((anchor, generateHandshakeCallback) => {
    setMyAnchor(anchor);

    // Simulated anchor for the other person
    const sampleAnchors = [
      'Blue Book', 'Red Cap', 'Green Scarf', 'Corner Table',
      'Laptop stickers', 'Yellow bag', 'Silver Watch', 'Denim Jacket',
      'White Headphones', 'Coffee cup', 'Black umbrella', 'Patterned tote'
    ];
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
    signalBars,
    acceptMatch,
    reset
  };
};
