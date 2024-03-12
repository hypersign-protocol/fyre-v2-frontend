export type EventTaskType = {
  _id: string
  eventId: string
  type: string
  title: string
  description: string
  isMandatory: boolean
  xp: number
  priority: number
  options: {
    proofConfig: {
      proof: {
        signature: string
        msgParams: {
          domain: {
            name: string
            version: string
          }
          message: {
            purpose: string
            information: string
            permissions: string
          }
          primaryType: string
          types: {
            EIP712Domain: {
              name: string
              type: string
            }[]
            Consent: {
              name: string
              type: string
            }[]
          }
        }
        walletAddress: string
      }
    }
  }
  __v: number
}
