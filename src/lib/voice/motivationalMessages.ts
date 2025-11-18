export const motivationalMessages = [
  'You\'re doing great! Keep pushing!',
  'Stay strong! You\'ve got this!',
  'Every rep counts! Keep going!',
  'You\'re stronger than you think!',
  'Focus on your breathing!',
  'Push through! You\'re almost there!',
  'Remember why you started!',
  'You\'re building something amazing!',
  'Stay consistent! You\'re making progress!',
  'Your future self will thank you!',
  'One more rep! You can do it!',
  'You\'re crushing it!',
  'Keep that energy!',
  'You\'re unstoppable!',
  'Every movement matters!',
];

export const getRandomMotivationalMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[randomIndex];
};

