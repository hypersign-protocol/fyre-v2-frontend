import { defineStore } from 'pinia'
import axios, { AxiosResponse, AxiosError } from '@/utils/axios'

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
    eventParticipants: {}
  }),
  actions: {
    async PERFORM_EVENT_TASK(payload: string): Promise<EventTask[]> {
      try {
        const response: AxiosResponse<EventTask[]> = await axios.post(
          `/event-participants/perform-task`,
          payload,
          {
            headers: {
              'x-hf-social-accesstoken': payload.socialToken
            }
          }
        )

        if (response.success) {
          this.performResult = response.data
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
          console.error('Error fetching data:', response)
          return null
        }
      } catch (error) {
        console.error('Error fetching data:', error)
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
          console.error('Error fetching data:', response)
          return []
        }
      } catch (error: AxiosError) {
        console.error('Error fetching data:', error)
        return []
      }
    }
  }
})
