export const copyContent = (copyText) => {
  navigator.clipboard.writeText(copyText).then(() => {
    alert('Copied to clipboard')
  })
}
