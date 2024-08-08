import { defineAsyncComponent } from 'vue'

interface ITask {
  types: string[]
  path: ReturnType<typeof defineAsyncComponent>
}

const tasks: Array<ITask> = [
  {
    types: ['COLLECT_INPUT_URL'],
    path: defineAsyncComponent(() => import('@/components/Event/Task/CollectInput/Url.vue'))
  },
  {
    types: ['COLLECT_INPUT_QUIZ'],
    path: defineAsyncComponent(() => import('@/components/Event/Task/CollectInput/Quiz.vue'))
  },
  {
    types: ['COLLECT_INPUT_TEXT'],
    path: defineAsyncComponent(() => import('@/components/Event/Task/CollectInput/Text.vue'))
  },
  {
    types: ['COLLECT_INPUT_VISIT_URL'],
    path: defineAsyncComponent(() => import('@/components/Event/Task/CollectInput/VisitUrl.vue'))
  },
  {
    types: ['SOCIAL_TWITTER_FOLLOW'],
    path: defineAsyncComponent(() => import('@/components/Event/Task/Social/Twitter/Follow.vue'))
  },
  {
    types: ['SOCIAL_COMMUNITY_FOLLOW'],
    path: defineAsyncComponent(() => import('@/components/Event/Task/Social/Fyre/CommunityFollow.vue'))
  },
  {
    types: ['SOCIAL_TWITTER_LIKE'],
    path: defineAsyncComponent(() => import('@/components/Event/Task/Social/Twitter/Like.vue'))
  },
  {
    types: ['SOCIAL_TWITTER_RETWEET'],
    path: defineAsyncComponent(() => import('@/components/Event/Task/Social/Twitter/Retweet.vue'))
  },
  {
    types: ['SOCIAL_DISCORD_JOIN'],
    path: defineAsyncComponent(() => import('@/components/Event/Task/Social/DiscordJoin.vue'))
  },
  {
    types: ['SOCIAL_TELEGRAM_JOIN'],
    path: defineAsyncComponent(() => import('@/components/Event/Task/Social/TelegramJoin.vue'))
  },
  {
    types: ['SOCIAL_GITHUB_PULL_REQUEST'],
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/Social/Github/PullRequest.vue')
    )
  },
  {
    types: ['TOKEN_HOLDING_EVM_ETHEREUM', 'TOKEN_HOLDING_EVM_POLYGON', 'TOKEN_HOLDING_EVM_BINANCE'],
    path: defineAsyncComponent(() => import('@/components/Event/Task/TokenHoldingEvm/index.vue'))
  },
  {
    types: [
      'TOKEN_HOLDING_COSMOS_AGORIC',
      'TOKEN_HOLDING_COSMOS_ARCHWAY',
      'TOKEN_HOLDING_COSMOS_NIBIRU',
      'TOKEN_HOLDING_COSMOS_SECRET',
      'TOKEN_HOLDING_COSMOS_HYPERSIGN',
      'TOKEN_HOLDING_COSMOS_COSMOS',
      'TOKEN_HOLDING_COSMOS_OMNIFLEX',
      'TOKEN_HOLDING_COSMOS_STARGRAZE'
    ],
    path: defineAsyncComponent(() => import('@/components/Event/Task/TokenHoldingCosmos/index.vue'))
  },
  {
    types: ['NFT_HOLDING_EVM_ETHEREUM', 'NFT_HOLDING_EVM_POLYGON', 'NFT_HOLDING_EVM_BINANCE'],
    path: defineAsyncComponent(() => import('@/components/Event/Task/NFTHoldingEvm/index.vue'))
  },
  {
    types: [
      'NATIVE_COIN_HOLDING_COSMOS_AGORIC',
      'NATIVE_COIN_HOLDING_COSMOS_ARCHWAY',
      'NATIVE_COIN_HOLDING_COSMOS_NIBIRU',
      'NATIVE_COIN_HOLDING_COSMOS_SECRET',
      'NATIVE_COIN_HOLDING_COSMOS_HYPERSIGN',
      'NATIVE_COIN_HOLDING_COSMOS_COSMOS',
      'NATIVE_COIN_HOLDING_COSMOS_OMNIFLEX',
      'NATIVE_COIN_HOLDING_COSMOS_STARGRAZE'
    ],
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NativeCoinHoldingCosmos/index.vue')
    )
  },
  {
    types: [
      'NATIVE_COIN_HOLDING_EVM_ETHEREUM',
      'NATIVE_COIN_HOLDING_EVM_POLYGON',
      'NATIVE_COIN_HOLDING_EVM_BINANCE'
    ],
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NativeCoinHoldingEvm/index.vue')
    )
  },
  {
    types: [
      'TXN_TRACKING_COSMOS_AGORIC',
      'TXN_TRACKING_COSMOS_HYPERSIGN',
      'TXN_TRACKING_COSMOS_ARCHWAY',
      'TXN_TRACKING_COSMOS_NIBIRU',
      'TXN_TRACKING_COSMOS_SECRET',
      'TXN_TRACKING_COSMOS_COSMOS',
      'TXN_TRACKING_COSMOS_OMNIFLEX',
      'TXN_TRACKING_COSMOS_STARGRAZE',
      'TXN_TRACKING_COSMOS_OSMOSIS'
    ],
    path: defineAsyncComponent(() => import('@/components/Event/Task/TxnTrackingCosmos/index.vue'))
  },
  {
    types: [
      'STACKING_COSMOS_AGORIC',
      'STACKING_COSMOS_HYPERSIGN',
      'STACKING_COSMOS_ARCHWAY',
      'STACKING_COSMOS_NIBIRU',
      'STACKING_COSMOS_SECRET',
      'STACKING_COSMOS_COSMOS',
      'STACKING_COSMOS_OMNIFLEX',
      'STACKING_COSMOS_STARGRAZE'
    ],
    path: defineAsyncComponent(() => import('@/components/Event/Task/StackingCosmos/index.vue'))
  },
  {
    types: [
      'COLLECT_WALLETADDRESS_COSMOS_AGORIC',
      'COLLECT_WALLETADDRESS_COSMOS_ARCHWAY',
      'COLLECT_WALLETADDRESS_COSMOS_NIBIRU',
      'COLLECT_WALLETADDRESS_COSMOS_SECRET',
      'COLLECT_WALLETADDRESS_COSMOS_HYPERSIGN',
      'COLLECT_WALLETADDRESS_COSMOS_COSMOS',
      'COLLECT_WALLETADDRESS_COSMOS_OMNIFLEX',
      'COLLECT_WALLETADDRESS_COSMOS_STARGRAZE',
      'COLLECT_WALLETADDRESS_COSMOS_OSMOSIS'
    ],
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/CollectWalletCosmos/index.vue')
    )
  },
  {
    types: [
      'COLLECT_WALLETADDRESS_EVM_ETHEREUM',
      'COLLECT_WALLETADDRESS_EVM_POLYGON',
      'COLLECT_WALLETADDRESS_EVM_BINANCE'
    ],
    path: defineAsyncComponent(() => import('@/components/Event/Task/CollectWalletEvm/index.vue'))
  },
  {
    types: [
      'NFT_CW721_HOLDING_COSMOS_ARCHWAY',
      'NFT_CW721_HOLDING_COSMOS_NIBIRU',
      'NFT_CW721_HOLDING_COSMOS_HYPERSIGN',
      'NFT_CW721_HOLDING_COSMOS_OMNIFLEX',
      'NFT_CW721_HOLDING_COSMOS_STARGRAZE'
    ],
    path: defineAsyncComponent(
      () => import('@/components/Event/Task/NFTCw721HoldingCosmos/index.vue')
    )
  },
  {
    types: ['DEX_TRADING_VOLUME_OSMOSIS'],
    path: defineAsyncComponent(() => import('@/components/Event/Task/Osmosis/DexTradingVolume.vue'))
  },
  {
    types: ['DEX_LP_PROVISON_OSMOSIS'],
    path: defineAsyncComponent(() => import('@/components/Event/Task/Osmosis/DexLpProvision.vue'))
   },
  // {
  //   types: ['DEX_TXN_COUNT_OSMOSIS'],
  //   path: defineAsyncComponent(() => import('@/components/Event/Task/Osmosis/DexTxnCount.vue'))
  // }
]

export { ITask, tasks }
