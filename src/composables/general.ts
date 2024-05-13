import { useNotificationStore } from '@/store/notification.ts'

export const copyContent = (copyText) => {
  navigator.clipboard.writeText(copyText).then(() => {
    const notificationStore = useNotificationStore()
    notificationStore.SHOW_NOTIFICATION({
      show: true,
      type: 'success',
      title: 'Congrats',
      message: 'Copy success'
    })
  })
}

export const capitalize = (string) => {
  if (typeof string !== 'string') return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const calculateDaysUntilExpiry = (expiryDate) => {
  if (expiryDate) {
    const now = new Date()
    const expiresAt = new Date(expiryDate)
    const diffInMilliseconds = expiresAt - now
    let remainingDaysCount = ''
    if (diffInMilliseconds < 0) {
      remainingDaysCount = 'Expired'
    } else {
      remainingDaysCount = `Expiring in ${Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24))} days`
    }

    return remainingDaysCount
  } else {
    return ''
  }
}
