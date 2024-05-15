import { useInterChainStore } from './stores/interchain.ts'

export const updateChallenge = (data: any) => {
  console.log(data)
  const store = useInterChainStore()
  store.$patch({
    challenge: data.challenge
  })
}

export const receiveOptions = (data: any) => {
  console.log(data)
  const store = useInterChainStore()
  store.$patch({
    walletOptions: data
  })
}
