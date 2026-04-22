const scripts = {
  conversation: [
    { call: "I like your {myAnchor}.", response: "Thanks! I noticed your {theirAnchor}." },
    { call: "Is that a {myAnchor}?", response: "Yes, it is! And that's a nice {theirAnchor}." },
    { call: "Pardon me, I'm drawn to your {myAnchor}.", response: "Appreciated. I see your {theirAnchor}." },
    { call: "The {myAnchor} stands out in this crowd.", response: "So does your {theirAnchor}. Good eye." },
    { call: "Are you here for the {myAnchor} event?", response: "No, just for the {theirAnchor} vibe." },
  ],
  silent: [
    { call: "Respectful nod towards your {myAnchor}.", response: "Nodding back, acknowledging your {theirAnchor}." },
    { call: "Placing my {myAnchor} where you can see it.", response: "Adjusting my {theirAnchor} in response." },
    { call: "A subtle tilt of my {myAnchor}.", response: "A mirroring shift of my {theirAnchor}." },
    { call: "Briefly meeting eyes over my {myAnchor}.", response: "A silent acknowledgment from behind my {theirAnchor}." },
  ],
  activity: [
    { call: "Ready to use my {myAnchor}?", response: "Ready. My {theirAnchor} is set." },
    { call: "The {myAnchor} is the signal.", response: "Confirmed. Watching the {theirAnchor}." },
    { call: "Initiating sequence with {myAnchor}.", response: "Synchronizing {theirAnchor} now." },
    { call: "Shall we begin with the {myAnchor}?", response: "The {theirAnchor} is prepared for action." },
  ],
  generic: [
    { call: "The {myAnchor} connects us.", response: "Through the {theirAnchor}, we meet." },
    { call: "Signal received via {myAnchor}.", response: "Response sent via {theirAnchor}." },
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
