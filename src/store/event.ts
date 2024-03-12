// src/store/eventStore.ts

import { defineStore } from 'pinia'
import axios, { AxiosResponse, AxiosError } from '@/utils/axios'

import type { EventType } from '@/data/types/event/eventType'
import type { EventTaskType } from '@/data/types/event/eventTask'

interface eventType {
  popularEvents: EventType[]
  tabEvents: EventType[]
  eventById: EventType
  eventTasks: EventTaskType[]
  errors: unknown
}

export const useEventStore = defineStore('event', {
  state: (): eventType => ({
    popularEvents: [],
    eventById: {},
    tabEvents: [],
    eventTasks: [],
    errors: {}
  }),
  actions: {
    async POPULAR_EVENTS(filter: string): Promise<EventType[]> {
      try {
        const response: AxiosResponse<EventType[]> = await axios.get(`/event${filter}`)

        if (response.success) {
          this.popularEvents = response.data
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
    async TAB_EVENTS(filter: string): Promise<EventType[]> {
      try {
        const response: AxiosResponse<EventType[]> = await axios.get(`/event${filter}`)

        if (response.success) {
          this.tabEvents = response.data
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

    async GET_EVENT_BY_ID(eventId: string): Promise<EventType | null> {
      try {
        const response: AxiosResponse<EventType> = await axios.get(`/event/${eventId}`)

        if (response.success) {
          this.eventById = response.data
          return response.data
        } else {
          console.error('Error fetching data:', response)
          return null
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        this.errors = error
        return null
      }
    },
    async GET_EVENT_TASKS(eventId: string): Promise<EventTaskType[]> {
      try {
        const response: AxiosResponse<EventTaskType[]> = await axios.get(`/task-config/${eventId}`)

        if (response.success) {
          this.eventTasks = response.data
          return response.data
        } else {
          console.error('Error fetching data:', response)
          return null
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        return null
      }
    }
  },
  getters: {
    getPopularEvents(): EventType[] {
      return this.popularEvents
    },
    getTabEvents(): EventType[] {
      return this.tabEvents
    },
    getEventByIdData(): EventType {
      return this.eventById
    },
    getEventTasksList(): EventTaskType[] {
      return this.eventTasks
    },

    geteventError() {
      return this.errors
    }
  }
})
