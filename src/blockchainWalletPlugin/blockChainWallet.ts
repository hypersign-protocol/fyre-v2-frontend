import { useInterChainStore } from './stores/interchain.ts'

export const updateChallenge = (data) => {
  const store = useInterChainStore()
  store.$patch({
    challenge: data.challenge
  })
}

export const receiveOptions = (data) => {
  console.log(data)
  const store = useInterChainStore()
  store.$patch({
    walletOptions: data
  })
}

