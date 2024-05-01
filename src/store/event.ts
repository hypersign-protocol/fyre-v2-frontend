// src/store/eventStore.ts

import { defineStore } from 'pinia'
import axios, { AxiosResponse, AxiosError } from '@/utils/axios'

import type { EventType } from '@/data/types/event/eventType'
import type { EventTaskType } from '@/data/types/event/eventTask'

import { useNotificationStore } from './notification.ts'
const notificationStore = useNotificationStore()

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
    async TAB_EVENTS(filter: string): Promise<EventType[]> {
      try {
        const response: AxiosResponse<EventType[]> = await axios.get(`/event${filter}`)

        if (response.success) {
          this.tabEvents = response

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

    async GET_EVENT_BY_ID(eventId: string): Promise<EventType | null> {
      try {
        const response: AxiosResponse<EventType> = await axios.get(`/event/${eventId}`)

        if (response.success) {
          this.eventById = response.data

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
