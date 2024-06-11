function numberToWords(n: number) {
  // Handle negative numbers
  if (n < 0) {
    return 'Please enter a non-negative number.'
  }

  const singleDigit = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const doubleDigit = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19']
  const belowHundred = ['20', '30', '40', '50', '60', '70', '80', '90']
  const largeNumbers = ['', 'K', 'M', 'B', 'T']

  // Handle zero
  if (n === 0) {
    return '0'
  }

  function translate(n: number) {
    let word = ''
    if (n === 100) {
      word = '100'
    } else if (n < 10) {
      word = singleDigit[n] + ' '
    } else if (n < 20) {
      word = doubleDigit[n - 10] + ' '
    } else if (n < 100) {
      const rem = translate(n % 10)
      word = belowHundred[(n - (n % 10)) / 10 - 2] + ' ' + rem
    } else {
      word = translate(Math.floor(n / 100)) + '' + translate(n % 100)
    }
    return word.trim()
  }

  // Handle numbers up to quintillion (10^18)
  let words = ''
  let i = 0
  while (n > 0) {
    const group = n % 1000
    // Check if group has non-zero digits
    if (group !== 0) {
      words = translate(group) + largeNumbers[i] + ' ' + words
    }
    n = Math.floor(n / 1000)
    i++
    // Limit to quintillion (adjust LARGE_NUMBERS if needed)
    if (i === largeNumbers.length) {
      break
    }
  }

  // Handle very large numbers beyond supported range
  if (i === largeNumbers.length && n > 0) {
    words = 'Number too large for precise conversion. (Exceeds Quintillion)'
  }

  return words.trim()
}

export { numberToWords }
