const scripts = {
  conversation: [
    { call: "I like your {myAnchor}.", response: "Thanks! I noticed your {theirAnchor}." },
    { call: "Is that a {myAnchor}?", response: "Yes, it is! And that's a nice {theirAnchor}." },
    { call: "Pardon me, I'm drawn to your {myAnchor}.", response: "Appreciated. I see your {theirAnchor}." },
    { call: "{myAnchor} caught my eye from across the room.", response: "I'm glad it did, your {theirAnchor} is hard to miss." },
    { call: "I was just thinking about {myAnchor} when I saw yours.", response: "Synchronicity! My {theirAnchor} has that effect." },
    { call: "If {myAnchor} could talk, it would say hello.", response: "My {theirAnchor} would definitely say hello back." },
    { call: "Your {myAnchor} is a bold choice, I like it.", response: "Thank you, I think it complements your {theirAnchor} well." },
    { call: "Excuse me, is that a vintage {myAnchor}?", response: "Good eye! It pairs nicely with your {theirAnchor}." },
  ],
  silent: [
    { call: "Respectful nod towards your {myAnchor}.", response: "Nodding back, acknowledging your {theirAnchor}." },
    { call: "Placing my {myAnchor} where you can see it.", response: "Adjusting my {theirAnchor} in response." },
    { call: "A subtle tap on my {myAnchor}.", response: "Acknowledged with a gentle adjustment of my {theirAnchor}." },
    { call: "Raising my {myAnchor} in a silent toast.", response: "Returning the gesture with my {theirAnchor}." },
    { call: "A lingering look at your {myAnchor}.", response: "A knowing smile and a pat on my {theirAnchor}." },
    { call: "Pointing discreetly at my {myAnchor} then yours.", response: "A slow nod, recognizing the connection to my {theirAnchor}." },
    { call: "Catching your eye while holding my {myAnchor}.", response: "Holding my {theirAnchor} a bit tighter in response." },
  ],
  activity: [
    { call: "Ready to use my {myAnchor}?", response: "Ready. My {theirAnchor} is set." },
    { call: "The {myAnchor} is the signal.", response: "Confirmed. Watching the {theirAnchor}." },
    { call: "Time to put the {myAnchor} to work?", response: "Ready when you are. The {theirAnchor} is primed." },
    { call: "The {myAnchor} indicates we should begin.", response: "Proceeding as planned. My {theirAnchor} is the guide." },
    { call: "Shall we use the {myAnchor} for this?", response: "Absolutely, it's the perfect match for my {theirAnchor}." },
    { call: "My {myAnchor} is prepared for the task.", response: "As is my {theirAnchor}. Let's do this." },
    { call: "The {myAnchor} is our common ground.", response: "Building something new with the {theirAnchor}." },
  ],
  creative: [
    { call: "In another life, my {myAnchor} was a {theirAnchor}.", response: "Maybe they'll meet again in this one, with your {theirAnchor}." },
    { call: "My {myAnchor} is a map to a hidden place.", response: "Does it lead to where I kept my {theirAnchor}?" },
    { call: "I've heard stories about a {myAnchor} like that.", response: "They probably didn't mention my {theirAnchor}." },
    { call: "If we swapped {myAnchor} and {theirAnchor}, would we be different people?", response: "Only one way to find out, but let's keep your {theirAnchor} for now." },
    { call: "My {myAnchor} is dreaming of a {theirAnchor}.", response: "My {theirAnchor} says dreams have a way of coming true." },
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
