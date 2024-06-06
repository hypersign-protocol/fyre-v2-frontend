import { defineStore } from 'pinia'
import axios, { AxiosResponse, AxiosError } from '@/utils/axios'

import { useNotificationStore } from './notification.ts'
const notificationStore = useNotificationStore()

import { useAuthStore } from './auth.ts'
const authStore = useAuthStore()

interface Proof {
  userTextInput: string
}

interface Task {
  [taskId: string]: {
    proof: Proof
  }
}

interface PerformTaskResult {
  eventId: string
  communityId: string
  userId: string
  myReferralInvitationCode: string
  myReferralsCount: number
  xp: number
  tasks: Task
  _id: string
  __v: number
}

interface LeaderboardData {
  id: string
}

export const useEventParticipantStore = defineStore('eventParticipant', {
  state: () => ({
    performResult: {} as PerformTaskResult,
    leaderBoard: {} as LeaderboardData,
    eventParticipants: {},
    wallet_connect_error: {
      status: false,
      message: '',
      taskId: null
    }
  }),
  actions: {
    async PERFORM_IBCDENOM_TRACE(ibcDenom: string): Promise<any> {
      const denom = ibcDenom.split('/')[1]
      const url = 'https://lcd.osmosis.zone/ibc/apps/transfer/v1/denom_traces/' + denom
      try {
        const response = await fetch(url)
        const json = await response.json()

        if (response.ok) {
          return json
        } else {
          notificationStore.SHOW_NOTIFICATION({
            show: true,
            type: 'error',
            message: json.message
          })
          return []
        }
      } catch (error) {
        notificationStore.SHOW_NOTIFICATION({ show: true, type: 'error', message: error.message })
        return
      }
    },
    async FETCH_POOL_ID(poolId: number): Promise<any> {
      const url = 'https://lcd.osmosis.zone/osmosis/poolmanager/v1beta1/pools/' + poolId
      try {
        const response = await fetch(url)
        const json = await response.json()

        if (response.ok) {
          return json
        } else {
          notificationStore.SHOW_NOTIFICATION({
            show: true,
            type: 'error',
            message: json.message
          })
          return []
        }
      } catch (error) {
        notificationStore.SHOW_NOTIFICATION({ show: true, type: 'error', message: error.message })
        return
      }
    },
    async PERFORM_EVENT_TASK(payload: string): Promise<EventTask[]> {
      try {
        let apiParams = `/event-participants/perform-task`

        const urlParams = new URLSearchParams(window.location.search)
        const refValue = urlParams.get('referrer')
        if (refValue !== null) {
          apiParams += `?referrer=${refValue}`
        }

        const response: AxiosResponse<EventTask[]> = await axios.post(apiParams, payload, {
          headers: {
            'x-hf-social-accesstoken': payload.socialToken
          }
        })

        if (response.success) {
          this.performResult = response.data
          authStore.USER_AUTHORIZE()
          return response.data
        } else {
          throw new Error(response)
        }
      } catch (error) {
        const m = error.error && error.error.details && error.error.details.length > 0 ? error.error.details[0]: error.message
        notificationStore.SHOW_NOTIFICATION({ show: true, type: 'error', message: m })
        return null
      }
    },
    async GET_LEADER_BOARD(
      communityId: string,
      eventId: string,
      isLeaderboard: boolean
    ): Promise<EventTask[]> {
      try {
        const response: AxiosResponse<EventTask[]> = await axios.get(
          `/event-participants/${communityId}/${eventId}?leaderboard=${isLeaderboard}`
        )

        if (response.success) {
          this.leaderBoard = response.data

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

    async EVENT_PARTICIPANTS(eventId: string): Promise {
      try {
        const response: AxiosResponse = await axios.get(`/event-participants/${eventId}`)

        if (response.success) {
          this.eventParticipants = response.data

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

    SET_WALLET_CONNECT_ERROR(payload: any) {
      this.wallet_connect_error = { ...payload }
    }
  }
})
