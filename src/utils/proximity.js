/**
 * Simulated proximity utility for the Mutual Permission app.
 * Since this is a privacy-first, "no surveillance" app, proximity is
 * purely ephemeral and used only for discovery within the local "Social Zone".
 */

export const calculateSignalBars = (prevBars) => {
  const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
  return Math.max(1, Math.min(5, prevBars + delta));
};

export const calculateDistance = (prevDistance) => {
  const delta = Math.floor(Math.random() * 5) - 2; // -2 to 2
  return Math.max(1, Math.min(100, prevDistance + delta));
};

export const getRandomAnchor = () => {
  const sampleAnchors = [
    'Blue Book',
    'Red Cap',
    'Green Scarf',
    'Corner Table',
    'Laptop stickers',
    'Yellow Umbrella',
    'Denim Jacket',
    'Coffee Cup'
  ];
  return sampleAnchors[Math.floor(Math.random() * sampleAnchors.length)];
};
