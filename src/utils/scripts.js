const scripts = {
  conversation: [
    { call: "I like your {myAnchor}.", response: "Thanks! I noticed your {theirAnchor}." },
    { call: "Is that a {myAnchor}?", response: "Yes, it is! And that's a nice {theirAnchor}." },
    { call: "Pardon me, I'm drawn to your {myAnchor}.", response: "Appreciated. I see your {theirAnchor}." },
    { call: "That {myAnchor} really stands out.", response: "So does your {theirAnchor}. Good choice." },
    { call: "I couldn't help but notice your {myAnchor}.", response: "And I noticed your {theirAnchor}." },
    { call: "Nice {myAnchor} you have there.", response: "Thanks! Your {theirAnchor} is pretty cool too." },
    { call: "Your {myAnchor} caught my eye.", response: "I was just thinking the same about your {theirAnchor}." },
    { call: "The {myAnchor} is quite unique.", response: "I feel the same about the {theirAnchor}." }
  ],
  silent: [
    { call: "Respectful nod towards your {myAnchor}.", response: "Nodding back, acknowledging your {theirAnchor}." },
    { call: "Placing my {myAnchor} where you can see it.", response: "Adjusting my {theirAnchor} in response." },
    { call: "A slight tip of the hat near my {myAnchor}.", response: "A subtle wave from behind my {theirAnchor}." },
    { call: "Gently tapping my {myAnchor} twice.", response: "Matching the rhythm on my {theirAnchor}." },
    { call: "Catching your eye and glancing at my {myAnchor}.", response: "Returning the glance and showing my {theirAnchor}." },
    { call: "Sitting quietly with my {myAnchor}.", response: "Joining the silence with my {theirAnchor}." },
    { call: "Tracing the edge of my {myAnchor}.", response: "Doing the same with my {theirAnchor}." }
  ],
  activity: [
    { call: "Ready to use my {myAnchor}?", response: "Ready. My {theirAnchor} is set." },
    { call: "The {myAnchor} is the signal.", response: "Confirmed. Watching the {theirAnchor}." },
    { call: "Initiating sequence with {myAnchor}.", response: "Receiving sequence with {theirAnchor}." },
    { call: "Moving the {myAnchor} to the left.", response: "Shifting the {theirAnchor} to match." },
    { call: "Setting down the {myAnchor} now.", response: "Acknowledged. Placing the {theirAnchor}." },
    { call: "Is the {myAnchor} in position?", response: "Yes, and the {theirAnchor} is aligned." },
    { call: "Time to reveal the {myAnchor}.", response: "The {theirAnchor} is revealed as well." }
  ],
  generic: [
    { call: "The {myAnchor} connects us.", response: "Through the {theirAnchor}, we meet." },
    { call: "Anchored by {myAnchor}.", response: "Resonating with {theirAnchor}." },
    { call: "From {myAnchor} to {theirAnchor}.", response: "The bridge is established." },
    { call: "Recognizing {myAnchor}.", response: "Confirming {theirAnchor}." },
    { call: "Behold the {myAnchor}.", response: "And witness the {theirAnchor}." },
    { call: "In the presence of {myAnchor}.", response: "Bounded by {theirAnchor}." }
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
