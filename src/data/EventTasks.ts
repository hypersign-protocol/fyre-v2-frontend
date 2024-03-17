import { defineAsyncComponent } from 'vue'

interface ITask {
  type: string
  path: ReturnType<typeof defineAsyncComponent>
}

const tasks: Array<ITask> = [
  {
    type: 'COLLECT_INPUT_URL',
    path: defineAsyncComponent(() => import('@/components/Event/Task/CollectInput/Url.vue'))
  },
  {
    type: 'COLLECT_INPUT_TEXT',
    path: defineAsyncComponent(() => import('@/components/Event/Task/CollectInput/Text.vue'))
  },
  {
    type: 'COLLECT_INPUT_VISIT_URL',
    path: defineAsyncComponent(() => import('@/components/Event/Task/CollectInput/VisitUrl.vue'))
  },
  {
    type: 'SOCIAL_TWITTER_FOLLOW',
    path: defineAsyncComponent(() => import('@/components/Event/Task/Social/Twitter/Follow.vue'))
  },
  {
    type: 'SOCIAL_TWITTER_LIKE',
    path: defineAsyncComponent(() => import('@/components/Event/Task/Social/Twitter/Like.vue'))
  },
  {
    type: 'SOCIAL_TWITTER_RETWEET',
    path: defineAsyncComponent(() => import('@/components/Event/Task/Social/Twitter/Retweet.vue'))
  },
  {
    type: 'SOCIAL_DISCORD_JOIN',
    path: defineAsyncComponent(() => import('@/components/Event/Task/Social/Discord/Join.vue'))
  },
  {
    type: 'SOCIAL_TELEGRAM_JOIN',
    path: defineAsyncComponent(() => import('@/components/Event/Task/Social/Telegram/Join.vue'))
  },
  {
    type: 'SOCIAL_GITHUB_PULL_REQUEST',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/Social/Github/PullRequest.vue')
    )
  },
  {
    type: 'COLLECT_WALLETADDRESS_EVM_BINANCE',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWallet/Evm/Binance.vue')
    )
  },
  {
    type: 'COLLECT_WALLETADDRESS_EVM_ETHEREUM',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWallet/Evm/Ethereum.vue')
    )
  },
  {
    type: 'COLLECT_WALLETADDRESS_COSMOS_COSMOS',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWallet/Cosmos/Cosmos.vue')
    )
  },
  {
    type: 'TOKEN_HOLDING_EVM_ETHEREUM',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TokenHolding/Evm/Ethereum.vue')
    )
  },
  {
    type: 'TOKEN_HOLDING_EVM_POLYGON',
    path: defineAsyncComponent(() => import('@/components/Event/Task/TokenHolding/Evm/Polygon.vue'))
  },
  {
    type: 'TOKEN_HOLDING_EVM_BINANCE',
    path: defineAsyncComponent(() => import('@/components/Event/Task/TokenHolding/Evm/Binance.vue'))
  },
  {
    type: 'TOKEN_HOLDING_COSMOS_AGORIC',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TokenHolding/Cosmos/Agoric.vue')
    )
  },
  {
    type: 'TOKEN_HOLDING_COSMOS_ARCHWAY',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TokenHolding/Cosmos/Archway.vue')
    )
  },
  {
    type: 'TOKEN_HOLDING_COSMOS_NIBIRU',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TokenHolding/Cosmos/Nibiru.vue')
    )
  },
  {
    type: 'TOKEN_HOLDING_COSMOS_SECRET',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TokenHolding/Cosmos/Secret.vue')
    )
  },
  {
    type: 'TOKEN_HOLDING_COSMOS_HYPERERSIGN',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TokenHolding/Cosmos/Hypersign.vue')
    )
  },
  {
    type: 'TOKEN_HOLDING_COSMOS_COSMOS',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TokenHolding/Cosmos/Cosmos.vue')
    )
  },
  {
    type: 'TOKEN_HOLDING_COSMOS_OMNIFLEX',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TokenHolding/Cosmos/Omniflex.vue')
    )
  },
  {
    type: 'TOKEN_HOLDING_COSMOS_STARGRAZE',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TokenHolding/Cosmos/Stargraze.vue')
    )
  },
  {
    type: 'NFT_HOLDING_EVM_ETHEREUM',
    path: defineAsyncComponent(() => import('@/components/Event/Task/NFTHolding/Evm/Ethereum.vue'))
  },
  {
    type: 'NFT_HOLDING_EVM_POLYGON',
    path: defineAsyncComponent(() => import('@/components/Event/Task/NFTHolding/Evm/Polygon.vue'))
  },
  {
    type: 'NFT_HOLDING_EVM_BINANCE',
    path: defineAsyncComponent(() => import('@/components/Event/Task/NFTHolding/Evm/Binance.vue'))
  },
  {
    type: 'NFT_CW721_HOLDING_COSMOS_ARCHWAY',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NFTHolding/Cosmos/Archway.vue')
    )
  },
  {
    type: 'NFT_CW721_HOLDING_COSMOS_NIBIRU',
    path: defineAsyncComponent(() => import('@/components/Event/Task/NFTHolding/Cosmos/Nibiru.vue'))
  },
  {
    type: 'NFT_CW721_HOLDING_COSMOS_HYPERERSIGN',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NFTHolding/Cosmos/Hypersign.vue')
    )
  },
  {
    type: 'NFT_CW721_HOLDING_COSMOS_OMNIFLEX',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NFTHolding/Cosmos/Omniflex.vue')
    )
  },
  {
    type: 'NFT_CW721_HOLDING_COSMOS_STARGRAZE',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NFTHolding/Cosmos/Stargraze.vue')
    )
  },
  {
    type: 'COLLECT_INPUT_QUIZ',
    path: defineAsyncComponent(() => import('@/components/Event/Task/CollectInput/Quiz.vue'))
  },
  {
    type: 'COLLECT_INPUT_FYRE_XP',
    path: defineAsyncComponent(() => import('@/components/Event/Task/CollectInput/FyreXp.vue'))
  },
  {
    type: 'COLLECT_WALLETADDRESS_EVM_ETHEREUM',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWallet/Evm/Ethereum.vue')
    )
  },
  {
    type: 'COLLECT_WALLETADDRESS_EVM_POLYGON',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWallet/Evm/Polygon.vue')
    )
  },
  {
    type: 'COLLECT_WALLETADDRESS_EVM_BINANCE',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWallet/Evm/Binance.vue')
    )
  },
  {
    type: 'COLLECT_WALLETADDRESS_COSMOS_AGORIC',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWallet/Cosmos/Agoric.vue')
    )
  },
  {
    type: 'COLLECT_WALLETADDRESS_COSMOS_ARCHWAY',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWallet/Cosmos/Archway.vue')
    )
  },
  {
    type: 'COLLECT_WALLETADDRESS_COSMOS_NIBIRU',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWallet/Cosmos/Nibiru.vue')
    )
  },
  {
    type: 'COLLECT_WALLETADDRESS_COSMOS_SECRET',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWallet/Cosmos/Secret.vue')
    )
  },
  {
    type: 'COLLECT_WALLETADDRESS_COSMOS_HYPERERSIGN',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWallet/Cosmos/Hypersign.vue')
    )
  },
  {
    type: 'COLLECT_WALLETADDRESS_COSMOS_COSMOS',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWallet/Cosmos/Cosmos.vue')
    )
  },
  {
    type: 'COLLECT_WALLETADDRESS_COSMOS_OMNIFLEX',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWallet/Cosmos/Omniflex.vue')
    )
  },
  {
    type: 'COLLECT_WALLETADDRESS_COSMOS_STARGRAZE',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWallet/Cosmos/Stargraze.vue')
    )
  },
  {
    type: 'COLLECT_WALLETADDRESS_COSMOS_OSMOSIS',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWallet/Cosmos/Osmosis.vue')
    )
  },
  {
    type: 'STACKING_COSMOS_AGORIC',
    path: defineAsyncComponent(() => import('@/components/Event/Task/Stacking/Cosmos/Agoric.vue'))
  },
  {
    type: 'STACKING_COSMOS_HYPERSIGN',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/Stacking/Cosmos/Hypersign.vue')
    )
  },
  {
    type: 'STACKING_COSMOS_ARCHWAY',
    path: defineAsyncComponent(() => import('@/components/Event/Task/Stacking/Cosmos/Archway.vue'))
  },
  {
    type: 'STACKING_COSMOS_NIBIRU',
    path: defineAsyncComponent(() => import('@/components/Event/Task/Stacking/Cosmos/Nibiru.vue'))
  },
  {
    type: 'STACKING_COSMOS_SECRET',
    path: defineAsyncComponent(() => import('@/components/Event/Task/Stacking/Cosmos/Secret.vue'))
  },
  {
    type: 'STACKING_COSMOS_COSMOS',
    path: defineAsyncComponent(() => import('@/components/Event/Task/Stacking/Cosmos/Cosmos.vue'))
  },
  {
    type: 'STACKING_COSMOS_OMNIFLEX',
    path: defineAsyncComponent(() => import('@/components/Event/Task/Stacking/Cosmos/Omniflex.vue'))
  },
  {
    type: 'STACKING_COSMOS_STARGRAZE',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/Stacking/Cosmos/Stargraze.vue')
    )
  },
  {
    type: 'OSMOSIS_DEX_TRADING_VOLUME',
    path: defineAsyncComponent(() => import('@/components/Event/Task/Osmosis/DexTradingVolume.vue'))
  },
  {
    type: 'OSMOSIS_DEX_LP_PROVISON',
    path: defineAsyncComponent(() => import('@/components/Event/Task/Osmosis/DexLpProvision.vue'))
  },
  {
    type: 'OSMOSIS_DEX_TXN_COUNT',
    path: defineAsyncComponent(() => import('@/components/Event/Task/Osmosis/DexTxnCount.vue'))
  },
  {
    type: 'TXN_TRACKING_COSMOS_AGORIC',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TxnTracking/Cosmos/Agoric.vue')
    )
  },
  {
    type: 'TXN_TRACKING_COSMOS_HYPERSIGN',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TxnTracking/Cosmos/Hypersign.vue')
    )
  },
  {
    type: 'TXN_TRACKING_COSMOS_ARCHWAY',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TxnTracking/Cosmos/Archway.vue')
    )
  },
  {
    type: 'TXN_TRACKING_COSMOS_NIBIRU',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TxnTracking/Cosmos/Nibiru.vue')
    )
  },
  {
    type: 'TXN_TRACKING_COSMOS_SECRET',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TxnTracking/Cosmos/Secret.vue')
    )
  },
  {
    type: 'TXN_TRACKING_COSMOS_COSMOS',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TxnTracking/Cosmos/Cosmos.vue')
    )
  },
  {
    type: 'TXN_TRACKING_COSMOS_OMNIFLEX',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TxnTracking/Cosmos/Omniflex.vue')
    )
  },
  {
    type: 'TXN_TRACKING_COSMOS_STARGRAZE',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TxnTracking/Cosmos/Stargraze.vue')
    )
  },
  {
    type: 'TXN_TRACKING_COSMOS_OSMOSIS',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/TxnTracking/Cosmos/Osmosis.vue')
    )
  },
  {
    type: 'NATIVE_COIN_HOLDING_COSMOS_AGORIC',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NativeCoinHolding/Cosmos/Agoric.vue')
    )
  },
  {
    type: 'NATIVE_COIN_HOLDING_COSMOS_ARCHWAY',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NativeCoinHolding/Cosmos/Archway.vue')
    )
  },
  {
    type: 'NATIVE_COIN_HOLDING_COSMOS_NIBIRU',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NativeCoinHolding/Cosmos/Nibiru.vue')
    )
  },
  {
    type: 'NATIVE_COIN_HOLDING_COSMOS_SECRET',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NativeCoinHolding/Cosmos/Secret.vue')
    )
  },
  {
    type: 'NATIVE_COIN_HOLDING_COSMOS_HYPERERSIGN',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NativeCoinHolding/Cosmos/Hypersign.vue')
    )
  },
  {
    type: 'NATIVE_COIN_HOLDING_COSMOS_COSMOS',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NativeCoinHolding/Cosmos/Cosmos.vue')
    )
  },
  {
    type: 'NATIVE_COIN_HOLDING_COSMOS_OMNIFLEX',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NativeCoinHolding/Cosmos/Omniflex.vue')
    )
  },
  {
    type: 'NATIVE_COIN_HOLDING_COSMOS_STARGRAZE',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NativeCoinHolding/Cosmos/Stargraze.vue')
    )
  },
  {
    type: 'NATIVE_COIN_HOLDING_EVM_ETHEREUM',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NativeCoinHolding/Evm/Ethereum.vue')
    )
  },
  {
    type: 'NATIVE_COIN_HOLDING_EVM_POLYGON',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NativeCoinHolding/Evm/Polygon.vue')
    )
  },
  {
    type: 'NATIVE_COIN_HOLDING_EVM_BINANCE',
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NativeCoinHolding/Evm/Binance.vue')
    )
  }
]

export { ITask, tasks }
