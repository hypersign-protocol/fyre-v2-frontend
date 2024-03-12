export type EventType = {
  _id: string
  communityId: string
  eventName: string
  banner: string
  description: string
  startDate: string
  endDate: string
  isDraft: boolean
  isPublished: boolean
  tags: string[]
  isOpenToAll: boolean
  referral: {
    refreeXp: number
    referralXp: number
    difficultyLevel: number
    limit: number
  }
  rewards: {
    rewardType: string
    title: string
    winnerCount: number
    rewardPerPerson: number
    distributionType: string
  }[]
  __v: number
}
