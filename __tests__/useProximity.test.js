import { renderHook, act } from '@testing-library/react-native';
import { useProximity } from '../src/hooks/useProximity';

// Mocking setTimeout
jest.useFakeTimers();

describe('useProximity', () => {
  it('should start in "none" state', async () => {
    const { result } = await renderHook(() => useProximity(false));
    expect(result.current.matchingState).toBe('none');
  });

  it('should transition through granular states when active', async () => {
    const { result } = await renderHook(() => useProximity(true));
    expect(result.current.matchingState).toBe('searching');
    expect(result.current.distance).toBe(100);
    expect(result.current.signalStrength).toBe(1);

    await act(async () => {
        jest.advanceTimersByTime(5000);
    });
    expect(result.current.matchingState).toBe('approaching');
    expect(result.current.signalStrength).toBe(2);

    await act(async () => {
        jest.advanceTimersByTime(5000);
    });
    expect(result.current.matchingState).toBe('locking');
    expect(result.current.signalStrength).toBe(4);

    await act(async () => {
        jest.advanceTimersByTime(3000);
    });
    expect(result.current.matchingState).toBe('match_found');
    expect(result.current.signalStrength).toBe(5);
  });

  it('should transition to "bridge" when match is accepted', async () => {
    const { result } = await renderHook(() => useProximity(true));

    await act(async () => {
      jest.advanceTimersByTime(11000);
    });

    await act(async () => {
      result.current.acceptMatch('My Anchor', (a, b) => ({ call: a, response: b }));
    });

    expect(result.current.matchingState).toBe('bridge');
    expect(result.current.myAnchor).toBe('My Anchor');
    expect(result.current.theirAnchor).toBeTruthy();
    expect(result.current.matchData.call).toBe('My Anchor');
  });

  it('should reset when deactivated', async () => {
    const { result, rerender } = await renderHook(({ active }) => useProximity(active), {
      initialProps: { active: true }
    });

    await act(async () => {
      jest.advanceTimersByTime(11000);
    });

    await act(async () => {
      await rerender({ active: false });
    });

    expect(result.current.matchingState).toBe('none');
    expect(result.current.myAnchor).toBe('');
  });
});
