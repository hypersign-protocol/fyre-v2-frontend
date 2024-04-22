// Utilities
import { defineStore } from 'pinia'
import axios, { AxiosResponse, AxiosError } from '@/utils/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    challenge: {},
    loginRes: {},
    userProfileResponse: {},
    userMeta: {},
    fileUpload: {}
  }),
  actions: {
    async USER_LOGIN(filter: string): Promise {
      try {
        const response: AxiosResponse = await axios.get(`/login${filter}`)
        this.challenge = response
      } catch (error: AxiosError) {
        console.error('Error fetching data:', error)
        return []
      }
    },
    async USER_AUTHENTICATE(payload: Object): Promise {
      try {
        const response: AxiosResponse = await axios.post(`/authenticate`, payload)

        if (response.success) {
          this.loginRes = response.data
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
    async UPDATE_USER_PROFILE(payload: Object): Promise {
      try {
        const response: AxiosResponse = await axios.patch(`/user`, payload, {
          headers: {
            'x-hf-social-accesstoken': payload.socialToken
          }
        })

        if (response.success) {
          this.userProfileResponse = response.data
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
    async USER_DETAILS(): Promise {
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
    },
    async FILE_UPLOAD(payload: Object): Promise {
      try {
        const response: AxiosResponse = await axios.post(`/file-upload`, payload)

        if (response.success) {
          this.fileUpload = response.data
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
