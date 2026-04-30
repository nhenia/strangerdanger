const scripts = {
  conversation: [
    { call: "I like your {myAnchor}.", response: "Thanks! I noticed your {theirAnchor}." },
    { call: "Is that a {myAnchor}?", response: "Yes, it is! And that's a nice {theirAnchor}." },
    { call: "Pardon me, I'm drawn to your {myAnchor}.", response: "Appreciated. I see your {theirAnchor}." },
    { call: "Interesting {myAnchor} you have there.", response: "I thought the same about your {theirAnchor}." },
    { call: "The {myAnchor} caught my eye.", response: "And your {theirAnchor} caught mine." },
    { call: "Lovely weather to carry a {myAnchor}.", response: "Indeed, and a fine day for a {theirAnchor} too." },
  ],
  silent: [
    { call: "Respectful nod towards your {myAnchor}.", response: "Nodding back, acknowledging your {theirAnchor}." },
    { call: "Placing my {myAnchor} where you can see it.", response: "Adjusting my {theirAnchor} in response." },
    { call: "A quiet glance at your {myAnchor}.", response: "A subtle acknowledgement of your {theirAnchor}." },
    { call: "Standing still with my {myAnchor}.", response: "Mirrored presence with my {theirAnchor}." },
    { call: "Holding my {myAnchor} visibly.", response: "Signaling back with my {theirAnchor}." },
  ],
  activity: [
    { call: "Ready to use my {myAnchor}?", response: "Ready. My {theirAnchor} is set." },
    { call: "The {myAnchor} is the signal.", response: "Confirmed. Watching the {theirAnchor}." },
    { call: "Engaging with my {myAnchor} now.", response: "Following suit with my {theirAnchor}." },
    { call: "Our {myAnchor} and {theirAnchor} align for this.", response: "Let the shared task begin." },
    { call: "Focusing on the {myAnchor}.", response: "Attending to the {theirAnchor}." },
  ],
  generic: [
    { call: "The {myAnchor} connects us.", response: "Through the {theirAnchor}, we meet." },
    { call: "Anchored by {myAnchor}.", response: "Responding via {theirAnchor}." },
    { call: "Bridge established through {myAnchor}.", response: "Link confirmed with {theirAnchor}." },
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
