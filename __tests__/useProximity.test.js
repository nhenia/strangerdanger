import { renderHook, act } from '@testing-library/react-native';
import { useProximity } from '../src/hooks/useProximity';

// Mocking setTimeout
jest.useFakeTimers();

describe('useProximity', () => {
  it('should start in "none" state', async () => {
    const { result } = await renderHook(() => useProximity(false));
    expect(result.current.matchingState).toBe('none');
  });

  it('should transition through states when active', async () => {
    const { result } = await renderHook(() => useProximity(true));
    expect(result.current.matchingState).toBe('searching');

    await act(async () => {
      jest.advanceTimersByTime(5001); // max for searching -> detecting
    });
    expect(result.current.matchingState).toBe('detecting');

    await act(async () => {
      jest.advanceTimersByTime(5001); // max for detecting -> handshaking
    });
    expect(result.current.matchingState).toBe('handshaking');

    await act(async () => {
      jest.advanceTimersByTime(4001); // max for handshaking -> match_found
    });
    expect(result.current.matchingState).toBe('match_found');
  });

  it('should update distance and signal strength', async () => {
    const { result } = await renderHook(() => useProximity(true));

    await act(async () => {
      jest.advanceTimersByTime(1001); // Trigger interval
    });

    // In searching, target distance is 75, starting 100. Should decrease.
    expect(result.current.distance).toBeLessThan(100);
    expect(result.current.signalStrength).toBeGreaterThanOrEqual(1);
  });

  it('should transition to "bridge" when match is accepted', async () => {
    const { result } = await renderHook(() => useProximity(true));

    await act(async () => {
      jest.advanceTimersByTime(15000); // Pass all states
    });

    await act(async () => {
      result.current.acceptMatch('My Anchor', ['conversation'], (types, a, b) => ({ call: a, response: b, type: types[0] }));
    });

    expect(result.current.matchingState).toBe('bridge');
    expect(result.current.myAnchor).toBe('My Anchor');
    expect(result.current.theirAnchor).toBeTruthy();
    expect(result.current.matchData.call).toBe('My Anchor');
    expect(result.current.matchData.type).toBe('conversation');
  });

  it('should reset when deactivated', async () => {
    const { result, rerender } = await renderHook(({ active }) => useProximity(active), {
      initialProps: { active: true }
    });

    await act(async () => {
      jest.advanceTimersByTime(15000);
    });

    await act(async () => {
      await rerender({ active: false });
    });

    expect(result.current.matchingState).toBe('none');
    expect(result.current.myAnchor).toBe('');
    expect(result.current.distance).toBe(100);
  });
});
