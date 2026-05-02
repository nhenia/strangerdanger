import { generateHandshake } from '../src/utils/scripts';

describe('scripts', () => {
  const myAnchor = 'Blue Book';
  const theirAnchor = 'Red Cap';

  it('should generate a handshake for conversation', () => {
    const handshake = generateHandshake(['conversation'], myAnchor, theirAnchor);
    expect(handshake.type).toBe('conversation');
    expect(handshake.call).toContain(myAnchor);
    expect(handshake.response).toContain(theirAnchor);
  });

  it('should generate a handshake for silent', () => {
    const handshake = generateHandshake(['silent'], myAnchor, theirAnchor);
    expect(handshake.type).toBe('silent');
    expect(handshake.call).toContain(myAnchor);
    expect(handshake.response).toContain(theirAnchor);
  });

  it('should generate a handshake for activity', () => {
    const handshake = generateHandshake(['activity'], myAnchor, theirAnchor);
    expect(handshake.type).toBe('activity');
    expect(handshake.call).toContain(myAnchor);
    expect(handshake.response).toContain(theirAnchor);
  });

  it('should generate a handshake for creative', () => {
    const handshake = generateHandshake(['creative'], myAnchor, theirAnchor);
    expect(handshake.type).toBe('creative');
    expect(handshake.call).toContain(myAnchor);
    expect(handshake.response).toContain(theirAnchor);
  });

  it('should use generic if no type provided', () => {
    const handshake = generateHandshake([], myAnchor, theirAnchor);
    expect(handshake.type).toBe('generic');
    expect(handshake.call).toContain(myAnchor);
    expect(handshake.response).toContain(theirAnchor);
  });

  it('should pick one of multiple provided types', () => {
    const types = ['conversation', 'silent', 'activity', 'creative'];
    const handshake = generateHandshake(types, myAnchor, theirAnchor);
    expect(types).toContain(handshake.type);
  });
});
