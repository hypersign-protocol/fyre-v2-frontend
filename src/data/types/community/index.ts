export type CommunityType = {
  _id: string
  userId: string
  communityName: string
  domainUrl: string
  hasDomainVerified: boolean
  description: string
  avatar: string
  banner: string
  socials: {
    twitterHandle: string
    discorHandle: string
    telegramHandle: string
    githubHandle: string
  }
  followerCount: number
  participantCount: number
  createdAt: string
  updatedAt: string
  __v: number
  eventCount: number
}
