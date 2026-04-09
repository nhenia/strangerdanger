import { renderHook, act } from '@testing-library/react-hooks';
import { useProximity } from '../src/hooks/useProximity';

// Mocking setTimeout
jest.useFakeTimers();

describe('useProximity', () => {
  it('should start in "none" state', () => {
    const { result } = renderHook(() => useProximity(false));
    expect(result.current.matchingState).toBe('none');
  });

  it('should transition to "finding" when active', () => {
    const { result } = renderHook(() => useProximity(true));
    expect(result.current.matchingState).toBe('finding');
  });

  it('should transition to "match_found" after delay', () => {
    const { result } = renderHook(() => useProximity(true));

    act(() => {
      jest.advanceTimersByTime(11000);
    });

    expect(result.current.matchingState).toBe('match_found');
  });

  it('should transition to "bridge" when match is accepted', () => {
    const { result } = renderHook(() => useProximity(true));

    act(() => {
      jest.advanceTimersByTime(11000);
    });

    act(() => {
      result.current.acceptMatch('My Anchor', (a, b) => ({ call: a, response: b }));
    });

    expect(result.current.matchingState).toBe('bridge');
    expect(result.current.myAnchor).toBe('My Anchor');
    expect(result.current.theirAnchor).toBeTruthy();
    expect(result.current.matchData.call).toBe('My Anchor');
  });

  it('should reset when deactivated', () => {
    const { result, rerender } = renderHook(({ active }) => useProximity(active), {
      initialProps: { active: true }
    });

    act(() => {
      jest.advanceTimersByTime(11000);
    });

    rerender({ active: false });

    expect(result.current.matchingState).toBe('none');
    expect(result.current.myAnchor).toBe('');
  });
});
