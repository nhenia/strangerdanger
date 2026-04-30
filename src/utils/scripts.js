const scripts = {
  conversation: [
    { call: "I like your {myAnchor}.", response: "Thanks! I noticed your {theirAnchor}." },
    { call: "Is that a {myAnchor}?", response: "Yes, it is! And that's a nice {theirAnchor}." },
    { call: "Pardon me, I'm drawn to your {myAnchor}.", response: "Appreciated. I see your {theirAnchor}." },
    { call: "That {myAnchor} really stands out.", response: "Thank you, I thought the same about your {theirAnchor}." },
    { call: "Excuse me, where did you get that {myAnchor}?", response: "It's a long story! Love your {theirAnchor}, by the way." },
    { call: "Interesting {myAnchor}, does it have a story?", response: "Indeed! And your {theirAnchor} looks like it has one too." },
    { call: "I couldn't help but notice your {myAnchor}.", response: "And I couldn't help but notice your {theirAnchor}." },
    { call: "The color of that {myAnchor} is striking.", response: "Pairs well with the vibe of your {theirAnchor}, doesn't it?" },
  ],
  silent: [
    { call: "Respectful nod towards your {myAnchor}.", response: "Nodding back, acknowledging your {theirAnchor}." },
    { call: "Placing my {myAnchor} where you can see it.", response: "Adjusting my {theirAnchor} in response." },
    { call: "Brief eye contact then looking at your {myAnchor}.", response: "A slight smile, gesturing to your {theirAnchor}." },
    { call: "Holding my {myAnchor} with both hands.", response: "Resting my hand near my {theirAnchor}." },
    { call: "Tilting my head towards your {myAnchor}.", response: "Mirroring the tilt towards your {theirAnchor}." },
    { call: "A quiet sigh of relief near your {myAnchor}.", response: "A calm presence near your {theirAnchor}." },
    { call: "Tapping a rhythm on my {myAnchor}.", response: "Matching the beat on my {theirAnchor}." },
  ],
  activity: [
    { call: "Ready to use my {myAnchor}?", response: "Ready. My {theirAnchor} is set." },
    { call: "The {myAnchor} is the signal.", response: "Confirmed. Watching the {theirAnchor}." },
    { call: "Should we begin with the {myAnchor}?", response: "Let's start. I'll lead with the {theirAnchor}." },
    { call: "I've brought the {myAnchor} for the task.", response: "And I have the {theirAnchor} ready to go." },
    { call: "The {myAnchor} is in position.", response: "Acknowledged. The {theirAnchor} is also placed." },
    { call: "Synchronize on my {myAnchor}.", response: "Synchronizing now. Focus on the {theirAnchor}." },
    { call: "Observe the {myAnchor} closely.", response: "I am. Now, look at the {theirAnchor}." },
  ],
  generic: [
    { call: "The {myAnchor} connects us.", response: "Through the {theirAnchor}, we meet." },
    { call: "Witness the {myAnchor}.", response: "Behold the {theirAnchor}." },
    { call: "Between my {myAnchor} and your {theirAnchor}...", response: "...a connection is made." },
    { call: "Signal from {myAnchor} received.", response: "Transmitting from {theirAnchor} now." },
    { call: "Alignment found: {myAnchor}.", response: "Alignment confirmed: {theirAnchor}." },
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
