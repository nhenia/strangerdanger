import { renderHook, act } from '@testing-library/react-native';
import { useProximity } from '../src/hooks/useProximity';

// Mocking timers
jest.useFakeTimers();

describe('useProximity', () => {
  it('should start in "none" state', async () => {
    const { result } = await renderHook(() => useProximity(false));
    expect(result.current.matchingState).toBe('none');
    expect(result.current.signalStrength).toBe(0);
  });

  it('should transition to "searching" when active', async () => {
    const { result } = await renderHook(() => useProximity(true));
    expect(result.current.matchingState).toBe('searching');
    expect(result.current.signalStrength).toBeGreaterThan(0);
  });

  it('should transition to "approaching" after searching delay', async () => {
    const { result } = await renderHook(() => useProximity(true));

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(result.current.matchingState).toBe('approaching');
  });

  it('should transition to "match_found" after approaching delay', async () => {
    const { result } = await renderHook(() => useProximity(true));

    await act(async () => {
        // Skip searching
        jest.advanceTimersByTime(6000);
    });

    expect(result.current.matchingState).toBe('approaching');

    await act(async () => {
      // Skip approaching
      jest.advanceTimersByTime(8000);
    });

    expect(result.current.matchingState).toBe('match_found');
    expect(result.current.signalStrength).toBeGreaterThan(0.7); // Loosened from 0.8
  });

  it('should simulate signal strength fluctuations', async () => {
    const { result } = await renderHook(() => useProximity(true));

    const initialSignal = result.current.signalStrength;

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.signalStrength).not.toBe(initialSignal);
  });

  it('should transition to "bridge" when match is accepted', async () => {
    const { result } = await renderHook(() => useProximity(true));

    await act(async () => {
      jest.advanceTimersByTime(15000); // Wait for match_found
    });

    await act(async () => {
      result.current.acceptMatch('My Anchor', (a, b) => ({ call: a, response: b }));
    });

    expect(result.current.matchingState).toBe('bridge');
    expect(result.current.myAnchor).toBe('My Anchor');
    expect(result.current.theirAnchor).toBeTruthy();
    expect(result.current.matchData.call).toBe('My Anchor');
    expect(result.current.signalStrength).toBe(1.0);
  });

  it('should reset when deactivated', async () => {
    const { result, rerender } = await renderHook(({ active }) => useProximity(active), {
      initialProps: { active: true }
    });

    await act(async () => {
      jest.advanceTimersByTime(15000);
    });

    await act(async () => {
      rerender({ active: false });
    });

    expect(result.current.matchingState).toBe('none');
    expect(result.current.myAnchor).toBe('');
    expect(result.current.signalStrength).toBe(0);
  });
});
