const scripts = {
  conversation: [
    { call: "I like your {myAnchor}.", response: "Thanks! I noticed your {theirAnchor}." },
    { call: "Is that a {myAnchor}?", response: "Yes, it is! And that's a nice {theirAnchor}." },
    { call: "Pardon me, I'm drawn to your {myAnchor}.", response: "Appreciated. I see your {theirAnchor}." },
    { call: "That's an interesting {myAnchor}.", response: "I was thinking the same about your {theirAnchor}." },
    { call: "How long have you had that {myAnchor}?", response: "Since I found this {theirAnchor}." },
  ],
  silent: [
    { call: "Respectful nod towards your {myAnchor}.", response: "Nodding back, acknowledging your {theirAnchor}." },
    { call: "Placing my {myAnchor} where you can see it.", response: "Adjusting my {theirAnchor} in response." },
    { call: "A subtle glance at the {myAnchor}.", response: "A mirrored glance at the {theirAnchor}." },
    { call: "Resting my hand near my {myAnchor}.", response: "Mirroring the gesture with my {theirAnchor}." },
  ],
  activity: [
    { call: "Ready to use my {myAnchor}?", response: "Ready. My {theirAnchor} is set." },
    { call: "The {myAnchor} is the signal.", response: "Confirmed. Watching the {theirAnchor}." },
    { call: "Initiating with the {myAnchor}.", response: "Responding via the {theirAnchor}." },
    { call: "Let the {myAnchor} lead the way.", response: "Following with the {theirAnchor}." },
  ],
  humor: [
    { call: "My {myAnchor} told me to say hi.", response: "My {theirAnchor} was expecting you." },
    { call: "Is it just me, or is your {theirAnchor} looking at my {myAnchor}?", response: "They do seem to have a connection." },
    { call: "I'm only here because of this {myAnchor}.", response: "Funny, I'm here because of this {theirAnchor}." },
  ],
  generic: [
    { call: "The {myAnchor} connects us.", response: "Through the {theirAnchor}, we meet." },
    { call: "Visual handshake: {myAnchor}.", response: "Visual handshake: {theirAnchor}." },
  ]
};

export const generateHandshake = (interactionTypes, myAnchor, theirAnchor) => {
  // Pick a random interaction type from the ones selected
  const type = interactionTypes[Math.floor(Math.random() * interactionTypes.length)] || 'generic';
  const options = scripts[type] || scripts.generic;
  const script = options[Math.floor(Math.random() * options.length)];

  const format = (text) => text
    .replace('{myAnchor}', myAnchor)
    .replace('{theirAnchor}', theirAnchor);

  return {
    call: format(script.call),
    response: format(script.response),
    type: type
  };
};
