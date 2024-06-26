import { useInterChainStore } from './stores/interchain.ts'

export const updateChallenge = (data: any) => {
  const store = useInterChainStore()
  store.$patch({
    challenge: data.challenge
  })
}

export const receiveOptions = (data: any) => {
  const store = useInterChainStore()
  store.$patch({
    walletOptions: data
  })
}
export const sendData = () => {
  const store = useInterChainStore()
  return store.walletOptions
}
