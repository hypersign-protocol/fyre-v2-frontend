// gasUtils.ts

interface GasPrice {
  amount: string
  denom: string
}

export function getDenom(chain: string): string {
  switch (chain) {
    case 'osmosis-1':
      return 'uosmo'
    case 'cataclysm-1':
      return 'nibi'
    case 'juno-1':
      return 'ujuno'
    case 'kaiyo-1':
      return 'ukuji'
    case 'phoenix-1':
    case 'columbus-5':
      return 'uluna'
    case 'neutron-1':
      return 'untrn'
    case 'migaloo-1':
      return 'uwhale'
    case 'injective-1':
      return 'inj'
    case 'pacific-1':
      return 'usei'
    case 'dymension_1100-1':
      return 'adym'
    case 'cosmoshub-4':
      return 'uatom'
    default:
      throw new Error('Unknown chain')
  }
}

export function getGasPrice(chain: string): GasPrice {
  switch (chain) {
    case 'osmosis-1':
      return { amount: '0.0025', denom: getDenom(chain) }
    case 'cataclysm-1':
      return { amount: '0.0025', denom: getDenom(chain) }
    case 'juno-1':
      return { amount: '0.001', denom: getDenom(chain) }
    case 'kaiyo-1':
      return { amount: '0.00119', denom: getDenom(chain) }
    case 'phoenix-1':
      return { amount: '0.015', denom: getDenom(chain) }
    case 'columbus-5':
      return { amount: '28.325', denom: getDenom(chain) }
    case 'neutron-1':
      return { amount: '0.01', denom: getDenom(chain) }
    case 'migaloo-1':
      return { amount: '0.25', denom: getDenom(chain) }
    case 'injective-1':
      return { amount: '500000000', denom: getDenom(chain) }
    case 'pacific-1':
      return { amount: '0.1', denom: getDenom(chain) }
    case 'dymension_1100-1':
      return { amount: '20000000000', denom: getDenom(chain) }
    case 'cosmoshub-4':
      return { amount: '0.25', denom: getDenom(chain) }
    default:
      throw new Error('Unknown chain')
  }
}
