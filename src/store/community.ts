// src/store/eventStore.ts

import { defineStore } from 'pinia'
import axios, { AxiosResponse, AxiosError } from '@/utils/axios'

import type { CommunityType } from '@/data/types/community/CommunityType.ts'
import type { EventType } from '@/data/types/event/eventType.ts'

import { useNotificationStore } from './notification.ts'

const notificationStore = useNotificationStore()

interface communityType {
  popularCommunities: CommunityType[]
  communityId: CommunityType
  communityFollow: Boolean
  communityEvents: EventType[]
  errors: unknown
}

export const useCommunityStore = defineStore('community', {
  state: (): {
    popularCommunities: any[]
    communityId: {}
    communityEvents: any[]
    communityFollow: boolean
  } => {
    return {
      popularCommunities: [],
      communityId: {},
      communityFollow: false,
      communityEvents: []
    }
  },
  actions: {
    async POPULAR_COMMUNITIES(filter: string): Promise<CommunityType[]> {
      try {
        const response: AxiosResponse<CommunityType[]> = await axios.get(`/community${filter}`)

        if (response.success) {
          this.popularCommunities = response

          return response.data
        } else {
          console.error('Error fetching community:', response)
          return []
        }
      } catch (error: AxiosError) {
        console.error('Error fetching community:', error)
        return []
      }
    },
    async GET_COMMUNITY_ID(communityId: string): Promise<CommunityType | null> {
      try {
        const response: AxiosResponse<CommunityType> = await axios.get(`/community/${communityId}`)

        if (response.success) {
          this.communityId = response.data

          return response.data
        } else {
          notificationStore.SHOW_NOTIFICATION({
            show: true,
            type: 'error',
            message: response.message
          })
          return null
        }
      } catch (error) {
        notificationStore.SHOW_NOTIFICATION({ show: true, type: 'error', message: error.message })
        return null
      }
    },
    async GET_EVENT_BY_COMMUNITY(communityId: string): Promise<EventType[]> {
      try {
        const response: AxiosResponse<EventType[]> = await axios.get(
          `/community/${communityId}/event`
        )

        if (response.success) {
          this.communityEvents = response.data

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
    async FOLLOW_COMMUNITY(communityId: string): Promise<CommunityType | null> {
      try {
        const response: AxiosResponse<CommunityType> = await axios.post(
          `/community/${communityId}/follow`
        )

        if (response.success) {
          this.communityFollow = true
          return response
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
    getPopularCommunities(): Community[] {
      return this.popularCommunities
    },
    getCommunityByIdData(): Community {
      return this.communityId
    },
    getEventsByCommunityId(): EventType[] {
      return this.communityEvents
    },
    getCommunityFollow() {
      return this.communityFollow
    }
  }
})
