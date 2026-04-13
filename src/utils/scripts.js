const scripts = {
  conversation: [
    { call: "I like your {myAnchor}.", response: "Thanks! I noticed your {theirAnchor}." },
    { call: "Is that a {myAnchor}?", response: "Yes, it is! And that's a nice {theirAnchor}." },
    { call: "Pardon me, I'm drawn to your {myAnchor}.", response: "Appreciated. I see your {theirAnchor}." },
    { call: "The {myAnchor} is a great choice.", response: "Thank you, I was just admiring your {theirAnchor}." },
    { call: "Did you get that {myAnchor} nearby?", response: "I did! Matches well with your {theirAnchor}, doesn't it?" },
  ],
  silent: [
    { call: "Respectful nod towards your {myAnchor}.", response: "Nodding back, acknowledging your {theirAnchor}." },
    { call: "Placing my {myAnchor} where you can see it.", response: "Adjusting my {theirAnchor} in response." },
    { call: "A slight tip of the hat to your {myAnchor}.", response: "A subtle wave, noting your {theirAnchor}." },
  ],
  activity: [
    { call: "Ready to use my {myAnchor}?", response: "Ready. My {theirAnchor} is set." },
    { call: "The {myAnchor} is the signal.", response: "Confirmed. Watching the {theirAnchor}." },
    { call: "Time to deploy the {myAnchor}?", response: "Indeed. The {theirAnchor} is in position." },
  ],
  humor: [
    { call: "My {myAnchor} told me to say hi to your {theirAnchor}.", response: "My {theirAnchor} is blushing now." },
    { call: "Is your {theirAnchor} looking for a {myAnchor} friend?", response: "They seem to be hitting it off already." },
    { call: "I've been told my {myAnchor} is a conversation starter.", response: "Your {myAnchor} just met its match in my {theirAnchor}." },
  ],
  mysterious: [
    { call: "The {myAnchor} knows what the {theirAnchor} seeks.", response: "The {theirAnchor} has been waiting." },
    { call: "Observe the {myAnchor} carefully.", response: "I have been watching the {theirAnchor} all along." },
    { call: "The moon shines on the {myAnchor}.", response: "And the stars reflect in the {theirAnchor}." },
  ],
  generic: [
    { call: "The {myAnchor} connects us.", response: "Through the {theirAnchor}, we meet." },
    { call: "Witness the {myAnchor}.", response: "Acknowledge the {theirAnchor}." },
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
