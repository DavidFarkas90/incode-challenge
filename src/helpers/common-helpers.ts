export function generateRandomNumbers(): number {
  return Math.floor(Math.random() * 1000);
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
