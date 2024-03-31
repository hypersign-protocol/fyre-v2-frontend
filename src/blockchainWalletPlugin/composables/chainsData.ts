// chainsData.ts

import CosmosIcon from '../assets/images/cosmos-icon.svg'
import OsmosisIcon from '../assets/images/osmosis.svg'

interface ChainData {
  type: string
  name: string
  image: string
  showOption: boolean
}

const chains: ChainData[] = [
  { type: 'osmosis-1', name: 'Osmosis', image: OsmosisIcon, showOption: true },
  { type: 'cosmoshub-4', name: 'Cosmos', image: CosmosIcon, showOption: true },
  { type: 'juno-1', name: 'Juno', image: 'juno.png', showOption: false },
  { type: 'kaiyo-1', name: 'Kujira', image: 'kujira.png', showOption: false },
  { type: 'phoenix-1', name: 'Terra', image: 'terra.png', showOption: false },
  { type: 'columbus-5', name: 'Terra Classic', image: 'terra-classic.png', showOption: false },
  { type: 'neutron-1', name: 'Neutron', image: 'neutron.png', showOption: false },
  { type: 'migaloo-1', name: 'Migaloo', image: 'migaloo.png', showOption: false },
  { type: 'injective-1', name: 'Injective', image: 'injective.png', showOption: false },
  { type: 'pacific-1', name: 'Sei', image: 'sei.png', showOption: false },
  { type: 'dymension_1100-1', name: 'Dymension', image: 'dymension.png', showOption: false }
]

export { chains }
