const scripts = {
  conversation: [
    { call: "I like your {myAnchor}.", response: "Thanks! I noticed your {theirAnchor}." },
    { call: "Is that a {myAnchor}?", response: "Yes, it is! And that's a nice {theirAnchor}." },
    { call: "Pardon me, I'm drawn to your {myAnchor}.", response: "Appreciated. I see your {theirAnchor}." },
  ],
  silent: [
    { call: "Respectful nod towards your {myAnchor}.", response: "Nodding back, acknowledging your {theirAnchor}." },
    { call: "Placing my {myAnchor} where you can see it.", response: "Adjusting my {theirAnchor} in response." },
  ],
  activity: [
    { call: "Ready to use my {myAnchor}?", response: "Ready. My {theirAnchor} is set." },
    { call: "The {myAnchor} is the signal.", response: "Confirmed. Watching the {theirAnchor}." },
  ],
  generic: [
    { call: "The {myAnchor} connects us.", response: "Through the {theirAnchor}, we meet." },
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
