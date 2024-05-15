import { HypersignDID } from 'hs-ssi-sdk'
import jsonld from 'jsonld'

import { base58btc } from 'multiformats/bases/base58'
import { EthereumEip712Signature2021 } from 'ethereumeip712signature2021suite'
import {
  EcdsaSecp256k1Signature2019,
  docloader as docloader1
} from 'keplr-ecdsasecp256k1signature2019'
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
  let provider = payload.provider

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
      authentication = didDoc.authentication
    } else {
      //(provider)

      eth = new EthereumEip712Signature2021({}, { _provider: provider })

      signInId = didDoc.verificationMethod[0].id
      authentication = didDoc.authentication
    }

    if (suiteType !== 'cosmos') {
      didDoc.verificationMethod[0].publicKeyMultibase = ''
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
      // verificationMethod: didDoc.verificationMethod[0].id,
      documentLoader: docloader
    })

    // const verifed = await jsSig.verify(proof, {
    //   suite:
    //     suiteType === 'cosmos'
    //       ? new EcdsaSecp256k1Signature2019({
    //           chainId,
    //           bech32AddressPrefix: prefix
    //         })
    //       : new EthereumEip712Signature2021({}),

    //   purpose: new purposes.AuthenticationProofPurpose({
    //     controller: {
    //       '@context': ['https://w3id.org/security/v2'],
    //       id: signInId,
    //       authentication: authentication
    //     },
    //     challenge: store.challenge,
    //     domain: prefixDomain
    //   }),
    //   // verificationMethod: didDoc.verificationMethod[0].id,
    //   // domain: {},
    //   documentLoader: docloader
    // })

    return { proof }
  } catch (err) {
    //(err)
    emit('collectError', err)
    return { proof: null, verifed: false }
  }
}

const verifyBlockchainAccountId = (didDoc, provider, chainId, chainAddress) => {
  //(didDoc)
  const verificationMethods = didDoc.verificationMethod

  for (const method of verificationMethods) {
    if (
      method.blockchainAccountId &&
      method.blockchainAccountId.startsWith(`${provider}:${chainId}:${chainAddress}`)
    ) {
      return true // Found matching blockchainAccountId
    }
  }

  return false // Not found
}

//connet wallet and add verification methods

export const addWallet = async (payload) => {
  //(payload)
  //(store.walletOptions)
  try {
    const signType = payload.signType
    const wallet = payload.wallet
    const localDidDoc = payload.localDidDoc
    let address = payload.address
    let chainId = payload.chainId
    const provider = payload.provider

    let publicKey, blockchainAccountId, suite

    if (signType === 'cosmos') {
      // Assuming wallet.pubKey exists for Cosmos

      chainId = wallet.pubKey.data.chainId
      address = wallet.address
      publicKey = base58btc.encode(wallet.pubKey.data.key)
      blockchainAccountId = `${signType}:${chainId}:${address}`
      const prefix = address.split('1')[0]
      suite = new EcdsaSecp256k1Signature2019({
        chainId,
        provider: wallet.ext ? wallet.ext : wallet.wc,
        bech32AddressPrefix: prefix
      })
    } else {
      blockchainAccountId = `${signType}:${chainId}:${address}`

      suite = new EthereumEip712Signature2021({}, { _provider: provider })
    }

    //(chainId)

    const hsSDK = initializeDidSDK()

    const isBlockchainAccountIdVerified = verifyBlockchainAccountId(
      localDidDoc,
      signType,
      chainId,
      address
    )

    let localDidKey = '#key-1'

    //(localDidKey)

    // //({
    //   didDocument: localDidDoc,
    //   type: wallet?.pubKey
    //     ? 'EcdsaSecp256k1VerificationKey2019'
    //     : 'EcdsaSecp256k1RecoveryMethod2020',
    //   id: `${localDidDoc.id}${localDidKey}`,
    //   controller: localDidDoc.controller,
    //   blockchainAccountId,
    //   publicKeyMultibase: wallet?.pubKey ? base58btc.encode(wallet?.pubKey.data.key) : undefined
    // })

    if (store.walletOptions.addVerificationMethod) {
      localDidKey = `#key-${localDidDoc.verificationMethod.length + 1}`

      const addVerification = await hsSDK.addVerificationMethod({
        didDocument: localDidDoc,
        type: wallet?.pubKey
          ? 'EcdsaSecp256k1VerificationKey2019'
          : 'EcdsaSecp256k1RecoveryMethod2020',
        id: `${localDidDoc.id}${localDidKey}`,
        controller: localDidDoc.controller,
        blockchainAccountId,
        publicKeyMultibase: wallet?.pubKey ? base58btc.encode(wallet?.pubKey.data.key) : undefined
      })
    }
    const length = localDidDoc.verificationMethod.length
    if (localDidDoc.verificationMethod[length - 1].publicKeyMultibase === undefined) {
      localDidDoc.verificationMethod[length - 1]['publicKeyMultibase'] = ''
    }

    //(localDidDoc.alsoKnownAs)
    delete localDidDoc.service
    const proof = await jsSig.sign(localDidDoc, {
      suite,
      purpose: new purposes.AssertionProofPurpose({
        controller: {
          '@context': ['https://w3id.org/security/v2'],
          id: `${localDidDoc.id}${localDidKey}`,
          assertionMethod: [`${localDidDoc.id}${localDidKey}`]
        }
      }),
      documentLoader: wallet?.pubKey ? docloader1 : docloader
    })
    //(proof)

    // const verifed = await jsSig.verify(proof, {
    //   suite,
    //   purpose: new purposes.AssertionProofPurpose({
    //     controller: {
    //       '@context': ['https://w3id.org/security/v2'],
    //       id: `${localDidDoc.id}${localDidKey}`,
    //       assertionMethod: [`${localDidDoc.id}${localDidKey}`]
    //     }
    //   }),
    //   documentLoader: wallet?.pubKey ? docloader1 : docloader
    // })

    return { proof }
  } catch (err) {
    //(err)
  }
}
