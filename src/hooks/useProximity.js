import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to simulate proximity detection and matching logic.
 * In a real-world scenario, this would interface with Bluetooth LE or Geolocation APIs.
 *
 * States:
 * - none: Inactive
 * - broadcasting: Establishing presence (0-3s)
 * - scanning: Looking for peers (3-7s)
 * - pinging: Peer detected, establishing contact (7-11s)
 * - matching: Negotiating handshake (11-16s)
 * - pinpointing: Finalizing location (16-20s)
 * - match_found: Ready for handshake (>20s)
 * - bridge: Handshake established
 */
export const useProximity = (isActive) => {
  const [matchingState, setMatchingState] = useState('none');
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
        setMatchingState('broadcasting');
        setDistance(100);
        setSignalBars(1);
      }

      // Progression logic
      if (matchingState !== 'match_found' && matchingState !== 'bridge') {
        const states = [
          { state: 'broadcasting', duration: 3000 },
          { state: 'scanning', duration: 4000 },
          { state: 'pinging', duration: 4000 },
          { state: 'matching', duration: 5000 },
          { state: 'pinpointing', duration: 4000 },
        ];

        const currentIndex = states.findIndex(s => s.state === matchingState);
        if (currentIndex !== -1) {
          timer = setTimeout(() => {
            const nextIndex = currentIndex + 1;
            if (nextIndex < states.length) {
              setMatchingState(states[nextIndex].state);
            } else {
              setMatchingState('match_found');
              setDistance(0);
              setSignalBars(5);
            }
          }, states[currentIndex].duration);
        }

        // Random walk for signal/distance simulation while finding
        interval = setInterval(() => {
          setSignalBars(prev => {
            if (matchingState === 'broadcasting') return 1;
            if (matchingState === 'pinpointing') return 4 + (Math.random() > 0.5 ? 1 : 0);
            const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            return Math.max(1, Math.min(5, prev + delta));
          });

          setDistance(prev => {
            if (matchingState === 'broadcasting') return 100;
            if (matchingState === 'match_found') return 0;
            if (matchingState === 'pinpointing') return Math.max(1, Math.min(5, prev + (Math.floor(Math.random() * 3) - 1)));

            // Gradually decrease distance based on state
            const decrease = Math.floor(Math.random() * 5) + 2;
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
    setDistance(100);
    setSignalBars(1);
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
