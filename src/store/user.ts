// src/store/eventStore.ts

import { defineStore } from 'pinia'
import axios, { AxiosResponse, AxiosError } from '@/utils/axios'

import type { EventType } from '@/data/types/event/eventType'
import type { CommunityType } from '@/data/types/community/CommunityType.ts'

interface UserMeta {
  _id: string
  userName: string
}

interface RewardType {
  _id: string
  userId: string
}

interface eventType {
  events: EventType[]
  userMeta: UserMeta
  userRewards: RewardType[]
  communities: CommunityType[]
  errors: unknown
}

export const useUserStore = defineStore('user', {
  state: (): eventType => ({
    events: [],
    communities: [],
    userRewards: [],
    userMeta: {},
    errors: {}
  }),
  actions: {
    async USER_EVENTS(): Promise<EventType[]> {
      try {
        const response: AxiosResponse<EventType[]> = await axios.get(`/user/events`)

        if (response.success) {
          this.events = response.data
          return response.data
        } else {
          console.error('Error fetching data:', response)
          return []
        }
      } catch (error: AxiosError) {
        console.error('Error fetching data:', error)
        return []
      }
    },
    async USER_COMMUNITIES(): Promise<CommunityType[]> {
      try {
        const response: AxiosResponse<CommunityType[]> = await axios.get(`/user/community`)

        if (response.success) {
          this.communities = response.data
          return response.data
        } else {
          console.error('Error fetching data:', response)
          return []
        }
      } catch (error: AxiosError) {
        console.error('Error fetching data:', error)
        return []
      }
    },
    async USER_REWARD(filter: string): Promise {
      try {
        const response: AxiosResponse = await axios.get(`/user/reward${filter}`)

        if (response.success) {
          this.userRewards = response.data
          return response.data
        } else {
          console.error('Error fetching data:', response)
          return []
        }
      } catch (error: AxiosError) {
        console.error('Error fetching data:', error)
        return []
      }
    },
    async USER_AUTH(): Promise {
      try {
        const response: AxiosResponse = await axios.post(`/authorize`)

        if (response.success) {
          this.userMeta = response.data
          return response.data
        } else {
          console.error('Error fetching data:', response)
          return []
        }
      } catch (error: AxiosError) {
        console.error('Error fetching data:', error)
        return []
      }
    }
  },
  getters: {
    getUserEvents(): EventType[] {
      return this.events
    },
    getUserCommunities(): EventType[] {
      return this.communities
    },
    getUserError() {
      return this.errors
    }
  }
})
