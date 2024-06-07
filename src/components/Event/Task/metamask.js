//chaning the chain id


await window.ethereum.request({
  "method": "wallet_switchEthereumChain",
  "params": [{
    "chainId": "0x56"
  }]
});

//fetching the wallet address

await window.ethereum.request({ method: 'eth_requestAccounts' })

[
  "0x428e7692223363087e5c70ae2e05b395ce4392ce"
]


//

await window.ethereum.request({
  "method": "eth_signTypedData_v4",
  "params": [
    "0x428e7692223363087e5c70ae2e05b395ce4392ce",
    {
      "domain": {
        "name": "Provide your wallet address",
        "version": "1"
      },
      "message": {
        "purpose": "We request your wallet address to verify your identity.",
        "information": "We will only access your public wallet address ([unique string of characters]). We will not access any private information or your token balances without your explicit consent.",
        "permissions": "By connecting your wallet, you are granting us permission to view your public address only."
      },
      "primaryType": "Consent",
      "types": {
        "EIP712Domain": [{
          "name": "name",
          "type": "string"
        },
        {
          "name": "version",
          "type": "string"
        }
        ],
        "Consent": [{
          "name": "purpose",
          "type": "string"
        },
        {
          "name": "information",
          "type": "string"
        },
        {
          "name": "permissions",
          "type": "string"
        }
        ]

      }
    }
  ]
});



{
  "_id": "65e6c3cfb3899ba2db1e825d",
    "eventId": "65e62111b3899ba2db1e8211",
      "type": "COLLECT_WALLETADDRESS_EVM_BINANCE",
        "title": "Connect Wallet",
          "description": "This is requires each participant to follow twitter",
            "isMandatory": false,
              "xp": 10,
                "priority": 0,
                  "options":
  {
    "proofConfig":
    {
      "proof":
      {
        "signature": "0x4f291154528d4140704b260356866ad20e7b2996c03e09e46b80b9cb54534da877b4141eb0bf6015d7bee9b7deff4e355ffe6db1f8718478777ff93d459672b71c",
          "msgParams":
        {
          "domain":
          {
            "name": "Provide your wallet address",
              "version": "1"
          },
          "message":
          {
            "purpose": "We request your wallet address to verify your identity.",
              "information": "We will only access your public wallet address ([unique string of characters]). We will not access any private information or your token balances without your explicit consent.",
                "permissions": "By connecting your wallet, you are granting us permission to view your public address only."
          },
          "primaryType": "Consent",
            "types":
          {
            "EIP712Domain": [
              {
                "name": "name",
                "type": "string"
              },
              {
                "name": "version",
                "type": "string"
              }],
              "Consent": [
                {
                  "name": "purpose",
                  "type": "string"
                },
                {
                  "name": "information",
                  "type": "string"
                },
                {
                  "name": "permissions",
                  "type": "string"
                }]
          }
        },
        "walletAddress": "0x428e7692223363087e5c70ae2e05b395ce4392ce"
      }
    }
  },
  "__v": 0
}