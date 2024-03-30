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

interface TwitterHandle {
  code: string
}

export const useEventParticipantStore = defineStore('eventParticipant', {
  state: () => ({
    performResult: {} as PerformTaskResult,
    twitterOAuth: {} as TwitterHandle
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

    async TWITTER_OAUTH_REQUEST() {
      try {
        const response = await axios.post('https://api.twitter.com/oauth2/token', '', {
          params: {
            grant_type: 'client_credentials'
          },
          auth: {
            username: 'NyjbZn2ssQR3bjy9IqR9KUbMj',
            password: 'VkJiZEgtTDhMWk0yU3BPUDFBSEk6MTpjaQ'
          }
        })

        console.log(response)
      } catch (error) {
        console.error('Error fetching data:', error)
        return null
      }
    }
  }
})
