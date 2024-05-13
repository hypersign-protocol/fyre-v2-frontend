// src/store/eventStore.ts

import { defineStore } from 'pinia'
import axios, { AxiosResponse, AxiosError } from '@/utils/axios'

import type { EventType } from '@/data/types/event/eventType'
import type { CommunityType } from '@/data/types/community/CommunityType.ts'

import { useNotificationStore } from './notification.ts'
const notificationStore = useNotificationStore()

interface RewardType {
  _id: string
  userId: string
}

interface eventType {
  events: EventType[]
  userRewards: RewardType[]
  communities: CommunityType[]
  errors: unknown
}

export const useUserStore = defineStore('user', {
  state: (): eventType => ({
    events: [],
    communities: [],
    userRewards: [],
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
          notificationStore.SHOW_NOTIFICATION({
            show: true,
            type: 'error',
            message: response.message
          })
          return []
        }
      } catch (error: AxiosError) {
        notificationStore.SHOW_NOTIFICATION({ show: true, type: 'error', message: error.message })
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
          notificationStore.SHOW_NOTIFICATION({
            show: true,
            type: 'error',
            message: response.message
          })
          return []
        }
      } catch (error: AxiosError) {
        notificationStore.SHOW_NOTIFICATION({ show: true, type: 'error', message: error.message })
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
          notificationStore.SHOW_NOTIFICATION({
            show: true,
            type: 'error',
            message: response.message
          })
          return []
        }
      } catch (error: AxiosError) {
        notificationStore.SHOW_NOTIFICATION({ show: true, type: 'error', message: error.message })
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
