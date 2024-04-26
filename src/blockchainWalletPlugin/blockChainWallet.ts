import { useInterChainStore } from './stores/interchain.ts'

export const updateChallenge = (data) => {
  const store = useInterChainStore()
  store.$patch({
    challenge: data.challenge
  })
}

export const monitorOptions = (data) => {
  console.log(data);
  
  const store = useInterChainStore()
  store.$patch({
    options: data
  })
}
