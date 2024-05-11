export const copyContent = (copyText) => {
  navigator.clipboard.writeText(copyText).then(() => {
    alert('Copied to clipboard')
  })
}

export const capitalize = (string) => {
  if (typeof string !== 'string') return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}
