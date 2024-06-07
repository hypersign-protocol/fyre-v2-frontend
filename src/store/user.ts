// src/store/eventStore.ts

import { defineStore } from 'pinia'
import axios, { AxiosResponse, AxiosError } from '@/utils/axios'

import type { EventType } from '@/data/types/event/eventType'
import type { CommunityType } from '@/data/types/community/CommunityType.ts'

import { useNotificationStore } from './notification.ts'
const notificationStore = useNotificationStore()

interface RewardType {
  _id: string
  userId: string
}

interface eventType {
  events: EventType[]
  userRewards: RewardType[]
  communities: CommunityType[],
  crdentials: Object[],
  errors: unknown
}

export const useUserStore = defineStore('user', {
  state: (): eventType => ({
    events: [],
    communities: [],
    userRewards: [],
    errors: {},
    crdentials: []
  }),
  actions: {
    async USER_EVENTS(): Promise<EventType[]> {
      try {
        const response: AxiosResponse<EventType[]> = await axios.get(`/user/events`)

        if (response.success) {
          this.events = response

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
    },
    async USER_COMMUNITIES(filter: string): Promise<CommunityType[]> {
      try {
        const response: AxiosResponse<CommunityType[]> = await axios.get(`/user/community${filter}`)

        if (response.success) {
          this.communities = response

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
    },
    async USER_REWARD(filter: string): Promise {
      try {
        const response: AxiosResponse = await axios.get(`/user/reward${filter}`)

        if (response.success) {
          this.userRewards = response.data

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
    async USER_CREDENTIALS(filter: string): Promise<CommunityType[]> {
      try {
        const response: AxiosResponse<Object[]> =  await axios.get(`/user/credentials`) 
        
        // {
        //   "success": true,
        //   "message": "Success",
        //   "data": [
        //     {
        //       "credential":    {
        //         "@context": [
        //           "https://www.w3.org/2018/credentials/v1",
        //           "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/HypersignCredentialStatus2023.jsonld",
        //           {
        //             "@context": {
        //               "@protected": true,
        //               "@version": 1.1,
        //               "id": "@id",
        //               "type": "@type",
        //               "TwitterConnect": {
        //                 "@context": {
        //                   "@propagate": true,
        //                   "@protected": true,
        //                   "xsd": "http://www.w3.org/2001/XMLSchema#",
        //                   "cta": {
        //                     "@id": "https://hypersign-schema.org/cta",
        //                     "@type": "xsd:string"
        //                   }
        //                 },
        //                 "@id": "https://hypersign-schema.org"
        //               }
        //             }
        //           },
        //           "https://w3id.org/security/suites/ed25519-2020/v1"
        //         ],
        //         "id": "vc:hid:testnet:z6MktV7zG9sLAnpH4D8Lb7i2hu4Wine5mYkACezbnD4it7wG",
        //         "type": [
        //           "VerifiableCredential",
        //           "TwitterConnect"
        //         ],
        //         "expirationDate": "2029-12-10T18:30:00Z",
        //         "issuanceDate": "2024-06-07T05:49:40Z",
        //         "issuer": "did:hid:testnet:z6MktKyrd9mHiNTorF5gvU7Uh58JQ4gQV44bggucQwACABMN",
        //         "credentialSubject": {
        //           "cta": "Varsha kumari",
        //           "id": "did:hid:testnet:0x704fb505830B4cfDC82298D628bfC56181271926"
        //         },
        //         "credentialSchema": {
        //           "id": "sch:hid:testnet:z6MkeVD8UZBcfa4h1wSQsGKvtcfTaPmQ9aSbbtTqZuXuFSLi:1.0",
        //           "type": "JsonSchemaValidator2018"
        //         },
        //         "credentialStatus": {
        //           "id": "https://api.prajna.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:z6MktV7zG9sLAnpH4D8Lb7i2hu4Wine5mYkACezbnD4it7wG",
        //           "type": "HypersignCredentialStatus2023"
        //         },
        //         "proof": {
        //           "type": "Ed25519Signature2020",
        //           "created": "2024-06-07T05:51:20Z",
        //           "verificationMethod": "did:hid:testnet:z6MktKyrd9mHiNTorF5gvU7Uh58JQ4gQV44bggucQwACABMN#key-1",
        //           "proofPurpose": "assertionMethod",
        //           "proofValue": "z4j98JrAM2sNQZmfc1f2rujZMgmo4PtQrvi6w5h9VJhHyPXG6pEfSq82yz63dbht75yxSUC713JRQqFnjJzCAKUYo"
        //         }
        //       },
        //       "community":{
        //         "communityName":"Osmosis",
        //         "hasDomainVerified": true,
        //         "avatar":"https://storage.googleapis.com/fyre-image-storage/Sommelier.png",
        //         "_id":""
        //       }
        //     },
        //     {
        //       "credential":  {
        //         "@context": [
        //           "https://www.w3.org/2018/credentials/v1",
        //           "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/HypersignCredentialStatus2023.jsonld",
        //           {
        //             "@context": {
        //               "@protected": true,
        //               "@version": 1.1,
        //               "id": "@id",
        //               "type": "@type",
        //               "DiscordConnect": {
        //                 "@context": {
        //                   "@propagate": true,
        //                   "@protected": true,
        //                   "xsd": "http://www.w3.org/2001/XMLSchema#",
        //                   "cta": {
        //                     "@id": "https://hypersign-schema.org/cta",
        //                     "@type": "xsd:string"
        //                   }
        //                 },
        //                 "@id": "https://hypersign-schema.org"
        //               }
        //             }
        //           },
        //           "https://w3id.org/security/suites/ed25519-2020/v1"
        //         ],
        //         "id": "vc:hid:testnet:z6MkwPyS8DLcZjCb4iUaTfq6ZcBQAr8b22bthgGdh88NZDGy",
        //         "type": [
        //           "VerifiableCredential",
        //           "DiscordConnect"
        //         ],
        //         "expirationDate": "2029-12-10T18:30:00Z",
        //         "issuanceDate": "2024-06-07T05:49:31Z",
        //         "issuer": "did:hid:testnet:z6MktKyrd9mHiNTorF5gvU7Uh58JQ4gQV44bggucQwACABMN",
        //         "credentialSubject": {
        //           "cta": "varshakumari5998",
        //           "id": "did:hid:testnet:0x704fb505830B4cfDC82298D628bfC56181271926"
        //         },
        //         "credentialSchema": {
        //           "id": "sch:hid:testnet:z6MkvmDv5DtaZuDX9epuu2tEB4aPqrvSGLasWtPnw2E9s88z:1.0",
        //           "type": "JsonSchemaValidator2018"
        //         },
        //         "credentialStatus": {
        //           "id": "https://api.prajna.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:z6MkwPyS8DLcZjCb4iUaTfq6ZcBQAr8b22bthgGdh88NZDGy",
        //           "type": "HypersignCredentialStatus2023"
        //         },
        //         "proof": {
        //           "type": "Ed25519Signature2020",
        //           "created": "2024-06-07T05:51:11Z",
        //           "verificationMethod": "did:hid:testnet:z6MktKyrd9mHiNTorF5gvU7Uh58JQ4gQV44bggucQwACABMN#key-1",
        //           "proofPurpose": "assertionMethod",
        //           "proofValue": "z4gcbxgyA64TX4GyPBhTtVC79sBaUavFuCEgmcnbi4EdtGCqee9nJfpUw71xVBxHuFgARH5CL88dPTKjD9z2E7cis"
        //         }
        //       },
        //       "community":{
        //       "communityName":"HedgeFundDao",
        //       "hasDomainVerified": true,
        //       "avatar":"https://storage.googleapis.com/fyre-image-storage/Sommelier.png",
        //       "_id":""
        //       }
        //     },
        //     {
        //       "credential":  {
        //         "@context": [
        //           "https://www.w3.org/2018/credentials/v1",
        //           "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/HypersignCredentialStatus2023.jsonld",
        //           {
        //             "@context": {
        //               "@protected": true,
        //               "@version": 1.1,
        //               "id": "@id",
        //               "type": "@type",
        //               "DiscordConnect": {
        //                 "@context": {
        //                   "@propagate": true,
        //                   "@protected": true,
        //                   "xsd": "http://www.w3.org/2001/XMLSchema#",
        //                   "cta": {
        //                     "@id": "https://hypersign-schema.org/cta",
        //                     "@type": "xsd:string"
        //                   }
        //                 },
        //                 "@id": "https://hypersign-schema.org"
        //               }
        //             }
        //           },
        //           "https://w3id.org/security/suites/ed25519-2020/v1"
        //         ],
        //         "id": "vc:hid:testnet:z6MkwPyS8DLcZjCb4iUaTfq6ZcBQAr8b22bthgGdh88NZDGy",
        //         "type": [
        //           "VerifiableCredential",
        //           "DiscordJoin"
        //         ],
        //         "expirationDate": "2029-12-10T18:30:00Z",
        //         "issuanceDate": "2024-06-07T05:49:31Z",
        //         "issuer": "did:hid:testnet:z6MktKyrd9mHiNTorF5gvU7Uh58JQ4gQV44bggucQwACABMN",
        //         "credentialSubject": {
        //           "cta": "varshakumari5998",
        //           "id": "did:hid:testnet:0x704fb505830B4cfDC82298D628bfC56181271926"
        //         },
        //         "credentialSchema": {
        //           "id": "sch:hid:testnet:z6MkvmDv5DtaZuDX9epuu2tEB4aPqrvSGLasWtPnw2E9s88z:1.0",
        //           "type": "JsonSchemaValidator2018"
        //         },
        //         "credentialStatus": {
        //           "id": "https://api.prajna.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:z6MkwPyS8DLcZjCb4iUaTfq6ZcBQAr8b22bthgGdh88NZDGy",
        //           "type": "HypersignCredentialStatus2023"
        //         },
        //         "proof": {
        //           "type": "Ed25519Signature2020",
        //           "created": "2024-06-07T05:51:11Z",
        //           "verificationMethod": "did:hid:testnet:z6MktKyrd9mHiNTorF5gvU7Uh58JQ4gQV44bggucQwACABMN#key-1",
        //           "proofPurpose": "assertionMethod",
        //           "proofValue": "z4gcbxgyA64TX4GyPBhTtVC79sBaUavFuCEgmcnbi4EdtGCqee9nJfpUw71xVBxHuFgARH5CL88dPTKjD9z2E7cis"
        //         }
        //       },
        //       "community":{
        //         "communityName":"HedgeFundDao",
        //         "hasDomainVerified": true,
        //         "avatar":"https://storage.googleapis.com/fyre-image-storage/image%2051.png",
        //         "_id":""
        //       }
        //     },
        //     {
        //       "credential":  {
        //         "@context": [
        //           "https://www.w3.org/2018/credentials/v1",
        //           "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/HypersignCredentialStatus2023.jsonld",
        //           {
        //             "@context": {
        //               "@protected": true,
        //               "@version": 1.1,
        //               "id": "@id",
        //               "type": "@type",
        //               "DiscordConnect": {
        //                 "@context": {
        //                   "@propagate": true,
        //                   "@protected": true,
        //                   "xsd": "http://www.w3.org/2001/XMLSchema#",
        //                   "cta": {
        //                     "@id": "https://hypersign-schema.org/cta",
        //                     "@type": "xsd:string"
        //                   }
        //                 },
        //                 "@id": "https://hypersign-schema.org"
        //               }
        //             }
        //           },
        //           "https://w3id.org/security/suites/ed25519-2020/v1"
        //         ],
        //         "id": "vc:hid:testnet:z6MkwPyS8DLcZjCb4iUaTfq6ZcBQAr8b22bthgGdh88NZDGy",
        //         "type": [
        //           "VerifiableCredential",
        //           "GithubConnect"
        //         ],
        //         "expirationDate": "2029-12-10T18:30:00Z",
        //         "issuanceDate": "2024-06-07T05:49:31Z",
        //         "issuer": "did:hid:testnet:z6MktKyrd9mHiNTorF5gvU7Uh58JQ4gQV44bggucQwACABMN",
        //         "credentialSubject": {
        //           "cta": "varshakumari5998",
        //           "id": "did:hid:testnet:0x704fb505830B4cfDC82298D628bfC56181271926"
        //         },
        //         "credentialSchema": {
        //           "id": "sch:hid:testnet:z6MkvmDv5DtaZuDX9epuu2tEB4aPqrvSGLasWtPnw2E9s88z:1.0",
        //           "type": "JsonSchemaValidator2018"
        //         },
        //         "credentialStatus": {
        //           "id": "https://api.prajna.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:z6MkwPyS8DLcZjCb4iUaTfq6ZcBQAr8b22bthgGdh88NZDGy",
        //           "type": "HypersignCredentialStatus2023"
        //         },
        //         "proof": {
        //           "type": "Ed25519Signature2020",
        //           "created": "2024-06-07T05:51:11Z",
        //           "verificationMethod": "did:hid:testnet:z6MktKyrd9mHiNTorF5gvU7Uh58JQ4gQV44bggucQwACABMN#key-1",
        //           "proofPurpose": "assertionMethod",
        //           "proofValue": "z4gcbxgyA64TX4GyPBhTtVC79sBaUavFuCEgmcnbi4EdtGCqee9nJfpUw71xVBxHuFgARH5CL88dPTKjD9z2E7cis"
        //         }
        //       },
        //       "community":{
        //       "communityName":"HedgeFundDao",
        //       "hasDomainVerified": true,
        //       "avatar":"https://storage.googleapis.com/fyre-image-storage/image%20146.png",
        //       "_id":""
        //       }
        //     }
        //   ]
        // }
        
        if (response.success) {
          this.crdentials = response.data
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
  },
  getters: {
    getUserEvents(): EventType[] {
      return this.events
    },
    getUserCommunities(): EventType[] {
      return this.communities
    },
    getUserError() {
      return this.errors
    },
    getUserCredentials(): Object[] {
      return this.crdentials
    },
  }
})
