// Utilities
import { defineStore } from 'pinia'
import axios, { AxiosResponse, AxiosError } from '@/utils/axios'

import { saveUser } from '@/composables/jwtService.ts'

import { useNotificationStore } from './notification.ts'
const notificationStore = useNotificationStore()

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
        notificationStore.SHOW_NOTIFICATION({ show: true, type: 'error', message: error.message })
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
    async UPDATE_USER_PROFILE(payload: Object): Promise {
      try {
        const response: AxiosResponse = await axios.patch(
          `/user?editMode=${payload.editMode}`,
          payload,
          {
            headers: {
              'x-hf-social-accesstoken': payload.socialAccessToken
            }
          }
        )

        if (response.success) {
          this.userProfileResponse = response.data

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
        notificationStore.SHOW_NOTIFICATION({
          show: true,
          type: 'error',
          message: error.error.details
        })
        return []
      }
    },

    async USER_AUTHORIZE(): Promise {
      try {
        const response: AxiosResponse = await axios.post(`/authorize`)

        if (response.success) {
          this.userMeta = response.data
          saveUser(response.data)
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
        notificationStore.SHOW_NOTIFICATION({
          show: true,
          type: 'error',
          message: error.error.details
        })
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
  }
})
