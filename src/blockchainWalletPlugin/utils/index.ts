import { HypersignDID } from 'hs-ssi-sdk'
import jsonld from 'jsonld'

import { base58btc } from 'multiformats/bases/base58'
import { EthereumEip712Signature2021 } from 'ethereumeip712signature2021suite'
import { EcdsaSecp256k1Signature2019 } from 'keplr-ecdsasecp256k1signature2019'
import jsSig, { purposes } from 'jsonld-signatures'

//getting challenge from store
import { storeToRefs } from 'pinia'
import { useInterChainStore } from '../stores/interchain'
const store = useInterChainStore()
const { challenge } = storeToRefs(store)

const nodeDocumentLoader = jsonld.documentLoader
import ecdsasecp2019 from './lds-ecdsa-secp256k1-recovery2019.json'

const CONTEXTS: any = Object.freeze({
  'https://ns.did.ai/suites/secp256k1-2019/v1/': {
    ...ecdsasecp2019
  }
})

export const docloader = async (url, options) => {
  if (url in CONTEXTS) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: CONTEXTS[url], // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    }
  }

  return nodeDocumentLoader(url)
}

const nodeRestURL = 'https://api.prajna.hypersign.id/'

const nodeRpcURL = 'https://rpc.prajna.hypersign.id/'

export const initializeDidSDK = (): HypersignDID => {
  const hsDID = new HypersignDID({
    namespace: 'testnet',
    nodeRestEndpoint: nodeRestURL,
    nodeRpcEndpoint: nodeRpcURL
  })

  return hsDID
}

export const signData = async (payload) => {
  const hsSDK = initializeDidSDK()

  const address = payload.address
  const chainId = payload.chainId
  const clientSpec = payload.clientSpec
  const suiteType = payload.suiteType
  const wallet = payload.wallet
  const reactiveConnector = payload.reactiveConnector
  let eth = null
  let eds = null
  let signInId = null
  let authentication = null

  const formData = {
    address,
    publicKey: suiteType === 'cosmos' ? base58btc.encode(wallet.pubKey.data.key) : null,
    methodSpecificId: address,
    chainId,
    clientSpec
  }

  const didDoc = await hsSDK.createByClientSpec(formData)
  delete didDoc.keyAgreement

  const prefix = address.split('1')[0]
  const prefixDomain = 'http://example.com' // or 'https://example.com' based on your requirements

  try {
    if (suiteType === 'cosmos') {
      eds = new EcdsaSecp256k1Signature2019({
        chainId,
        provider: wallet.ext ? wallet.ext : wallet.wc,
        bech32AddressPrefix: prefix
      })

      signInId = didDoc.verificationMethod[0].id
      authentication = didDoc.authentication[0]
    } else {
      const provider = await reactiveConnector.connector.connector.getProvider()
      eth = new EthereumEip712Signature2021({}, { _provider: provider })

      signInId = didDoc.id
      authentication = didDoc.authentication
    }

    const proof = await jsSig.sign(didDoc, {
      suite: suiteType === 'cosmos' ? eds : eth,
      purpose: new purposes.AuthenticationProofPurpose({
        controller: {
          '@context': ['https://w3id.org/security/v2'],
          id: signInId,
          authentication: authentication
        },
        challenge: store.challenge
      }),
      verificationMethod: didDoc.verificationMethod[0].id,
      documentLoader: docloader
    })

    const verifed = await jsSig.verify(proof, {
      suite:
        suiteType === 'cosmos'
          ? new EcdsaSecp256k1Signature2019({
              chainId,
              bech32AddressPrefix: prefix
            })
          : new EthereumEip712Signature2021({}),

      purpose: new purposes.AuthenticationProofPurpose({
        controller: {
          '@context': ['https://w3id.org/security/v2'],
          id: signInId,
          authentication: authentication
        },
        challenge: store.challenge,
        domain: prefixDomain
      }),
      verificationMethod: didDoc.verificationMethod[0].id,
      domain: {},
      documentLoader: docloader
    })

    return { proof, verifed }
  } catch (err) {
    console.log(err)
    return { proof: null, verifed: false }
  }
}
