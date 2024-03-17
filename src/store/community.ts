// src/store/eventStore.ts

import { defineStore } from 'pinia'
import axios, { AxiosResponse, AxiosError } from '@/utils/axios'

import type { CommunityType } from '@/data/types/community/CommunityType.ts'
import type { EventType } from '@/data/types/event/eventType.ts'

interface communityType {
  popularCommunities: CommunityType[]
  communityId: CommunityType
  communityEvents: EventType[]
}

export const useCommunityStore = defineStore('community', {
  state: (): communityType => ({
    popularCommunities: [],
    communityId: {},
    communityEvents: []
  }),
  actions: {
    async POPULAR_COMMUNITIES(filter: string): Promise<CommunityType[]> {
      try {
        const response: AxiosResponse<CommunityType[]> = await axios.get(`/community${filter}`)

        if (response.success) {
          this.popularCommunities = response.data
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
          console.error('Error fetching data:', response)
          return null
        }
      } catch (error) {
        console.error('Error fetching data:', error)
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
    getPopularCommunities(): Community[] {
      return this.popularCommunities
    },
    getCommunityByIdData(): Community {
      return this.communityId
    },
    getEventsByCommunityId(): EventType[] {
      return this.communityEvents
    }
  }
})
