function numberToWords(num: number) {
  if (num < 1000) return num.toString();

  const units = ["k", "M", "B", "T","Q"];
  let unitIndex = -1;
  let number = num;

  while (number >= 1000 && unitIndex < units.length - 1) {
      number /= 1000;
      unitIndex++;
  }

  return `${number.toFixed(1)}${units[unitIndex]}`;
}
export { numberToWords }
