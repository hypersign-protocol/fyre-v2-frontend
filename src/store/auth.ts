// Utilities
import { defineStore } from 'pinia'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError, AxiosResponse } from '@/utils/axios'

import { saveUser } from '@/composables/jwtService.ts'
import { removeDuplicatesInSignedDidDoc } from '@/composables/general.ts'

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
    async USER_LOGIN(filter: string): Promise<any> {
      try {
        this.challenge = await axios.get(`/login${filter}`)
      } catch (error: AxiosError) {
        notificationStore.SHOW_NOTIFICATION({
          show: true,
          type: 'error',
          message: error.message
        })
        return []
      }
    },
    async USER_AUTHENTICATE(payload: Object, params?: Object): Promise<any> {
      try {
        const response: AxiosResponse = await axios.post(`/authenticate`, payload, { params: {...params}})

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
        notificationStore.SHOW_NOTIFICATION({
          show: true,
          type: 'error',
          message: error.message
        })
        return []
      }
    },
    UPDATE_USER_PROFILE: async function (payload: Object): Promise<any> {
      try {
        console.log("Inside updateUserProfile method");
        
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

    async USER_AUTHORIZE(): Promise<any> {
      try {
        const response: AxiosResponse = await axios.post(`/authorize`)

        if (response.success) {
          this.userMeta = response.data
          const formattedDidDoc = removeDuplicatesInSignedDidDoc(response.data.didDocument)
          response.data.didDocument = formattedDidDoc
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
    async FILE_UPLOAD(payload: Object): Promise<any> {
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
        notificationStore.SHOW_NOTIFICATION({
          show: true,
          type: 'error',
          message: error.message
        })
        return []
      }
    }
  }
})
