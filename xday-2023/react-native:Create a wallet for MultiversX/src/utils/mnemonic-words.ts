export const extractMnemonicFromString = (input: string): string => {
  const cleanedInput = input.replace(/[\r\n]+/g, ' '); // Replace new lines with spaces
  const words = cleanedInput.match(/[a-zA-Z]+/g); // Match alphabetical characters

  return words ? words.join(' ') : '';
};
