// rpcUtils.ts

export function getRpc(chain: string): string {
  switch (chain) {
    case 'osmosis-1':
      return 'https://rpc.osmosis.zone'
    case 'cataclysm-1':
      return 'https://nibiru.rpc.kjnodes.com'
    case 'comdex-1':
      return 'https://nibiru.rpc.kjnodes.com'
    case 'archway-1':
      return 'https://archway.rpc.kjnodes.com'
    case 'prajna':
      return 'https://rpc.prajna.hypersign.id'
    case 'omniflixhub-1':
      return 'https://omniflix-rpc.polkachu.com'
    case 'secret-4':
      return 'https://secretnetwork-rpc.highstakes.ch'

    case 'agoric-3':
      return 'https://agoric.rpc.kjnodes.com'
    case 'juno-1':
      return 'https://juno-rpc.polkachu.com'
    case 'kaiyo-1':
      return 'https://kujira-rpc.polkachu.com'
    case 'phoenix-1':
      return 'https://terra-rpc.publicnode.com'
    case 'columbus-5':
      return 'https://terra-classic-rpc.publicnode.com'
    case 'neutron-1':
      return 'https://neutron-rpc.polkachu.com'
    case 'migaloo-1':
      return 'https://migaloo-rpc.polkachu.com'
    case 'injective-1':
      return 'https://injective-rpc.polkachu.com'
    case 'pacific-1':
      return 'https://rpc-sei-ia.cosmosia.notional.ventures'
    case 'dymension_1100-1':
      return 'https://rpc.dymension.nodestake.org'
    case 'cosmoshub-4':
      return 'https://cosmos-rpc.publicnode.com'
    default:
      throw new Error('Unknown chain')
  }
}
