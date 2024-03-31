// walletData.ts

import KeplrIcon from '../assets/images/keplr.png'
import LeapIcon from '../assets/images/leap.webp'

interface WalletData {
  type: string
  name: string
  image: string
  showOption: boolean
}

const wallets: WalletData[] = [
  { type: 'keplr', name: 'Keplr', image: KeplrIcon, showOption: true },
  { type: 'leap', name: 'Leap', image: LeapIcon, showOption: true }
]

export { wallets }
