const scripts = {
  conversation: [
    { call: "I like your {myAnchor}.", response: "Thanks! I noticed your {theirAnchor}." },
    { call: "Is that a {myAnchor}?", response: "Yes, it is! And that's a nice {theirAnchor}." },
    { call: "Pardon me, I'm drawn to your {myAnchor}.", response: "Appreciated. I see your {theirAnchor}." },
    { call: "That {myAnchor} is quite unique, is it related to your {theirAnchor}?", response: "In a way, just as my {theirAnchor} relates to you." },
    { call: "I couldn't help but notice your {myAnchor}. It complements my {theirAnchor}.", response: "I was thinking the same about your {theirAnchor}." },
    { call: "Nice {myAnchor}! Did you get it near the same place as my {theirAnchor}?", response: "Maybe! The {theirAnchor} has its own story too." },
    { call: "The color of your {myAnchor} is striking. It reminds me of my {theirAnchor}.", response: "They do share a certain vibe, don't they?" },
    { call: "Interesting {myAnchor}. I was just thinking about my {theirAnchor}.", response: "Coincidence is the best icebreaker." },
  ],
  silent: [
    { call: "Respectful nod towards your {myAnchor}.", response: "Nodding back, acknowledging your {theirAnchor}." },
    { call: "Placing my {myAnchor} where you can see it.", response: "Adjusting my {theirAnchor} in response." },
    { call: "Tapping my {myAnchor} twice while looking at your {theirAnchor}.", response: "A slow blink and a subtle shift of my {theirAnchor}." },
    { call: "Briefly lifting my {myAnchor} to acknowledge your {theirAnchor}.", response: "A small smile and a steady hold on my {theirAnchor}." },
    { call: "Holding my {myAnchor} steady as a sign of respect for your {theirAnchor}.", response: "Acknowledged. Keeping my {theirAnchor} visible." },
    { call: "Mirroring the position of your {theirAnchor} with my {myAnchor}.", response: "I see the symmetry. Our {theirAnchor} connection is clear." },
    { call: "A subtle point toward my {myAnchor}, then towards your {theirAnchor}.", response: "Message received. Focus remains on the {theirAnchor}." },
  ],
  activity: [
    { call: "Ready to use my {myAnchor}?", response: "Ready. My {theirAnchor} is set." },
    { call: "The {myAnchor} is the signal.", response: "Confirmed. Watching the {theirAnchor}." },
    { call: "Synchronizing my {myAnchor} with your {theirAnchor} now.", response: "Synced. The {theirAnchor} is in position." },
    { call: "Let's use the {myAnchor} and {theirAnchor} together for this.", response: "Agreed. I'll lead with the {theirAnchor}." },
    { call: "Pass the {myAnchor} once you see my {theirAnchor} move.", response: "Standing by. Watching the {theirAnchor} closely." },
    { call: "Following the lead of your {theirAnchor} with my {myAnchor}.", response: "Perfect. The {theirAnchor} will guide us." },
    { call: "Initiating sequence with {myAnchor}. Respond with {theirAnchor}.", response: "Sequence acknowledged. {theirAnchor} is active." },
  ],
  generic: [
    { call: "The {myAnchor} connects us.", response: "Through the {theirAnchor}, we meet." },
    { call: "The {myAnchor} finds its counterpart in the {theirAnchor}.", response: "A perfect match for the {theirAnchor}." },
    { call: "Alignment achieved: {myAnchor} and {theirAnchor}.", response: "The {theirAnchor} is now in phase." },
    { call: "Bridge formed between {myAnchor} and {theirAnchor}.", response: "Connection stable through {theirAnchor}." },
    { call: "Presence confirmed via {myAnchor} and {theirAnchor}.", response: "I see you and your {theirAnchor}." },
    { call: "Steady link between {myAnchor} and {theirAnchor}.", response: "Maintained. The {theirAnchor} is the key." },
  ]
};

export const generateHandshake = (interactionTypes, myAnchor, theirAnchor) => {
  // Pick a random interaction type from the ones selected
  const type = interactionTypes[Math.floor(Math.random() * interactionTypes.length)] || 'generic';
  const options = scripts[type] || scripts.generic;
  const script = options[Math.floor(Math.random() * options.length)];

  const format = (text) => text
    .replace(/{myAnchor}/g, myAnchor)
    .replace(/{theirAnchor}/g, theirAnchor);

  return {
    call: format(script.call),
    response: format(script.response),
    type: type
  };
};
