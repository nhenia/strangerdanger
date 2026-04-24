import { generateHandshake } from '../src/utils/scripts';

describe('generateHandshake', () => {
  it('should generate a handshake with call and response', () => {
    const handshake = generateHandshake(['conversation'], 'Red Cap', 'Blue Book');
    expect(handshake).toHaveProperty('call');
    expect(handshake).toHaveProperty('response');
    expect(handshake.call).toContain('Red Cap');
    expect(handshake.response).toContain('Blue Book');
  });

  it('should use a variety of scripts', () => {
    const handshake1 = generateHandshake(['conversation'], 'A', 'B');
    const handshake2 = generateHandshake(['silent'], 'A', 'B');
    expect(handshake1.type).toBe('conversation');
    expect(handshake2.type).toBe('silent');
  });

  it('should handle multiple interaction types', () => {
    const handshake = generateHandshake(['conversation', 'silent', 'activity'], 'A', 'B');
    expect(['conversation', 'silent', 'activity']).toContain(handshake.type);
  });
});
