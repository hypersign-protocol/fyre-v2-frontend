// walletData.ts

import KeplrIcon from '../assets/images/keplr.png'
import LeapIcon from '../assets/images/leap.webp'
import { WalletType } from 'cosmes/wallet'

interface WalletData {
  type: string
  name: string
  image: string
  showOption: boolean
  walletType: WalletType
}

const wallets: WalletData[] = JSON.stringify(navigator.userAgent.toLowerCase()).includes('mobile')
  ? [
      {
        type: 'keplr',
        name: 'Keplr Moblie',
        image: KeplrIcon,
        showOption: true,
        walletType: 'walletConnect'
      },
      {
        type: 'leap',
        name: 'Leap Moblie',
        image: LeapIcon,
        showOption: true,
        walletType: 'walletConnect'
      }
    ]
  : [
      { type: 'keplr', name: 'Keplr', image: KeplrIcon, showOption: true, walletType: 'extension' },
      { type: 'leap', name: 'Leap', image: LeapIcon, showOption: true, walletType: 'extension' },
      {
        type: 'keplr',
        name: 'Keplr Moblie',
        image: KeplrIcon,
        showOption: true,
        walletType: 'walletConnect'
      },
      {
        type: 'leap',
        name: 'Leap Moblie',
        image: LeapIcon,
        showOption: true,
        walletType: 'walletConnect'
      }
    ]

export { wallets }
