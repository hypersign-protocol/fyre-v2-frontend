interface ITask {
  type: string
  path: string
}

const tasks: Array<ITask> = [
  {
    type: 'CollectInputUrl',
    path: defineAsyncComponent(() => import(`@/components/Event/Task/Collect/Input/Url.vue`))
  },
  {
    type: 'CollectInputText',
    path: defineAsyncComponent(() => import(`@/components/Event/Task/Collect/Input/Text.vue`))
  },
  {
    type: 'CollectInputVisitUrl',
    path: defineAsyncComponent(() => import(`@/components/Event/Task/Collect/Input/VisitUrl.vue`))
  },
  {
    type: 'SocialTwitterFollow',
    path: defineAsyncComponent(() => import(`@/components/Event/Task/Social/Twitter/Follow.vue`))
  },
  {
    type: 'SocialTwitterLike',
    path: defineAsyncComponent(() => import(`@/components/Event/Task/Social/Twitter/Like.vue`))
  },
  {
    type: 'SocialTwitterRetweet',
    path: defineAsyncComponent(() => import(`@/components/Event/Task/Social/Twitter/Retweet.vue`))
  },
  {
    type: 'SocialDiscordJoin',
    path: defineAsyncComponent(() => import(`@/components/Event/Task/Social/Discord/Join.vue`))
  },
  {
    type: 'SocialTelegramJoin',
    path: defineAsyncComponent(() => import(`@/components/Event/Task/Social/Telegram/Join.vue`))
  },
  {
    type: 'SocialTelegramJoin',
    path: defineAsyncComponent(() => import(`@/components/Event/Task/Social/Telegram/Join.vue`))
  },
  {
    type: 'CollectWalletaddressEvmBinance',

    path: defineAsyncComponent(() => import(`@/components/Event/Task/Wallet/Evm/Binance.vue`))
  }
]

export { ITask, tasks }
