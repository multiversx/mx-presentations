export const prettifyBalance = (balance: string) => {
  const convertedNumber = parseFloat(balance) / Math.pow(10, 18);
  const formattedNumber = convertedNumber.toFixed(2);

  return formattedNumber;
};
