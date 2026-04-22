import { useState, useEffect, useCallback, useRef } from 'react';

export const useIdleTimer = (timeoutMs = 30000) => {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, timeoutMs);
  }, [timeoutMs]);

  const resetTimer = useCallback(() => {
    setIsIdle(false);
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [startTimer]);

  return { isIdle, resetTimer };
};
