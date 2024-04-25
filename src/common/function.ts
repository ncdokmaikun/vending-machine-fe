const integerNumberFormatter = Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatIntegerNumber = (number: number | string): string => {
  return integerNumberFormatter.format(
    typeof number === "number" ? number : parseFloat(number)
  );
};
