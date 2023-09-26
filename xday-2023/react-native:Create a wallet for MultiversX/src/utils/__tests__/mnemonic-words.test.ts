import { extractMnemonic } from '../';

describe('extractWords', () => {
  it('should extract words and return them separated by spaces', () => {
    const input = `
      1 erode
      2 slogan
      3 work
      4 van
      5 output
      23 tackle
      24 gorilla
    `;

    const expectedOutput = 'erode slogan work van output tackle gorilla';
    const result = extractMnemonic(input);

    expect(result).toEqual(expectedOutput);
  });

  it('should handle new lines and non-alphanumeric characters', () => {
    const input = `
      Hello123,
      World!
      42
      Testing
    `;

    const expectedOutput = 'Hello World Testing';
    const result = extractMnemonic(input);

    expect(result).toEqual(expectedOutput);
  });

  it('should handle empty input', () => {
    const input = '';

    const expectedOutput = '';
    const result = extractMnemonic(input);

    expect(result).toEqual(expectedOutput);
  });

  it('should handle input with only numbers', () => {
    const input = '123 456 789';

    const expectedOutput = '';
    const result = extractMnemonic(input);

    expect(result).toEqual(expectedOutput);
  });
});
