import { generateHandshake } from '../src/utils/scripts';

describe('generateHandshake', () => {
  it('should generate a handshake with call and response', () => {
    const handshake = generateHandshake(['conversation'], 'Red Cap', 'Blue Book');
    expect(handshake).toHaveProperty('call');
    expect(handshake).toHaveProperty('response');
    // Note: Some scripts might only use one of the anchors, but my new scripts should mostly use both.
    // However, some generic ones might be short.
    // Let's check that at least one anchor is present in the whole handshake if it's conversation type.
    const fullText = handshake.call + ' ' + handshake.response;
    expect(fullText).toContain('Red Cap');
    expect(fullText).toContain('Blue Book');
  });

  it('should support multiple occurrences of anchors in scripts', () => {
    const handshake = generateHandshake(['conversation'], 'Red Cap', 'Blue Book');
    expect(handshake.call).not.toContain('{myAnchor}');
    expect(handshake.call).not.toContain('{theirAnchor}');
    expect(handshake.response).not.toContain('{myAnchor}');
    expect(handshake.response).not.toContain('{theirAnchor}');
  });

  it('should use a variety of scripts', () => {
    const handshake1 = generateHandshake(['conversation'], 'A', 'B');
    const handshake2 = generateHandshake(['silent'], 'A', 'B');
    expect(handshake1.type).toBe('conversation');
    expect(handshake2.type).toBe('silent');
  });

  it('should handle all interaction types', () => {
    ['conversation', 'silent', 'activity', 'generic'].forEach(type => {
        const handshake = generateHandshake([type], 'A', 'B');
        expect(handshake.type).toBe(type);
    });
  });
});
