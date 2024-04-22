// chainsData.ts

interface ChainData {
  type: string
  name: string
  image: string
  showOption: boolean
}

const chains: ChainData[] = [
  {
    type: 'osmosis-1',
    name: 'Osmosis',
    image: new URL(`@/assets/images/task/comdex.png`, import.meta.url).href,
    showOption: true,
    rpc: 'https://rpc.osmosis.zone',
    gasPrice: { amount: '0.0025', denom: 'uosmo' }
  },

  {
    type: 'cosmoshub-4',
    name: 'Cosmos',
    image: new URL(`@/assets/images/task/cosmos.png`, import.meta.url).href,
    showOption: true,
    rpc: 'https://cosmos-rpc.publicnode.com',
    gasPrice: { amount: '0.0025', denom: 'uatom' }
  },

  {
    type: 'cataclysm-1',
    name: 'Nibiru',
    image: new URL(`@/assets/images/task/nibiru.png`, import.meta.url).href,
    showOption: true,
    rpc: 'https://rpc.osmosis.zone',
    gasPrice: { amount: '0.0025', denom: 'uosmo' }
  },

  {
    type: 'comdex-1',
    name: 'Comdex',
    image: new URL(`@/assets/images/task/comdex.png`, import.meta.url).href,
    showOption: true,
    rpc: 'https://rpc.comdex.one',
    gasPrice: { amount: '0.0025', denom: 'ucmdx' }
  },

  {
    type: 'archway-1',
    name: 'Archway',
    image: new URL(`@/assets/images/task/archway.png`, import.meta.url).href,
    showOption: true,
    rpc: 'https://archway.rpc.kjnodes.com',
    gasPrice: { amount: '0.0025', denom: 'agoric' }
  },

  {
    type: 'prajna',
    name: 'Hypersign',
    image: new URL(`@/assets/images/task/hypersign.png`, import.meta.url).href,
    showOption: true,
    rpc: 'https://rpc.prajna.hypersign.id',
    gasPrice: { amount: '0.0025', denom: 'hid' }
  },

  {
    type: 'omniflixhub-1',
    name: 'Omniflex',
    image: new URL(`@/assets/images/task/omniflex.png`, import.meta.url).href,
    showOption: true,
    rpc: 'https://omniflix-rpc.polkachu.com',
    gasPrice: { amount: '0.0025', denom: 'omniflix' }
  },

  {
    type: 'secret-4',
    name: 'Secret',
    image: new URL(`@/assets/images/task/secret.png`, import.meta.url).href,
    showOption: true,
    rpc: 'https://secretnetwork-rpc.highstakes.ch',
    gasPrice: { amount: '0.0025', denom: 'secret' }
  },

  {
    type: 'osmos-1',
    name: 'Osmosis',
    image: new URL(`@/assets/images/task/osmosis.png`, import.meta.url).href,
    showOption: true,
    rpc: 'https://osmosis-rpc.polkachu.com',
    gasPrice: { amount: '0.0025', denom: 'osmos' }
  },

  {
    type: 'agoric-3',
    name: 'Agoric',
    image: new URL(`@/assets/images/task/agoric.png`, import.meta.url).href,
    showOption: true,
    rpc: 'https://agoric.rpc.kjnodes.com',
    gasPrice: { amount: '0.0025', denom: 'agoric' }
  }
]

export { chains }
