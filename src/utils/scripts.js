const scripts = {
  conversation: [
    { call: "I like your {myAnchor}.", response: "Thanks! I noticed your {theirAnchor}." },
    { call: "Is that a {myAnchor}?", response: "Yes, it is! And that's a nice {theirAnchor}." },
    { call: "Pardon me, I'm drawn to your {myAnchor}.", response: "Appreciated. I see your {theirAnchor}." },
    { call: "That {myAnchor} is quite unique.", response: "Thank you, I feel the same about your {theirAnchor}." },
    { call: "Could you tell me more about your {myAnchor}?", response: "Only if you share the story of your {theirAnchor}." },
    { call: "The {myAnchor} suits the mood today.", response: "I was thinking your {theirAnchor} does as well." },
  ],
  silent: [
    { call: "Respectful nod towards your {myAnchor}.", response: "Nodding back, acknowledging your {theirAnchor}." },
    { call: "Placing my {myAnchor} where you can see it.", response: "Adjusting my {theirAnchor} in response." },
    { call: "A subtle gesture indicating your {myAnchor}.", response: "Acknowledged with a slight movement of my {theirAnchor}." },
    { call: "Maintaining a comfortable distance with my {myAnchor}.", response: "Resonating in silence with my {theirAnchor}." },
    { call: "Offering a brief glance at your {myAnchor}.", response: "Returning the glance towards your {theirAnchor}." },
  ],
  activity: [
    { call: "Ready to use my {myAnchor}?", response: "Ready. My {theirAnchor} is set." },
    { call: "The {myAnchor} is the signal.", response: "Confirmed. Watching the {theirAnchor}." },
    { call: "Initiating the protocol with {myAnchor}.", response: "Synchronizing with {theirAnchor}." },
    { call: "Let's align the {myAnchor} and the {theirAnchor}.", response: "Alignment in progress. Stand by." },
    { call: "The {myAnchor} is in position.", response: "The {theirAnchor} is ready for action." },
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
