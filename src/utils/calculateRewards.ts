

function sortByValue(map: Iterable<unknown> | ArrayLike<unknown>) {
    // Convert the Map to an array of key-value pairs
    const entries = Array.from(map)
  
    // Sort the array by value (descending order)
    entries.sort((a:any, b:any) => b[1] - a[1])
  
    // Return a new Map from the sorted array
    return entries
  }
  
const getRewards = (event: { rewards: { rewardType: string; denomination: any; winnerCount: number; rewardPerPerson: number }[] }) => {    
  const token = new Map()
  const nft = new Map()
  event.rewards?.forEach(
    (element: {
      rewardType: string
      denomination: any
      winnerCount: number
      rewardPerPerson: number
    }) => {
      if (element.rewardType == 'TOKEN') {
        token.set(
          element.denomination ? element.denomination : 'Token',
          token.has(element.denomination ? element.denomination : 'Token')
            ? element.winnerCount * element.rewardPerPerson +
                token.get(element.denomination ? element.denomination : 'Token')
            : element.winnerCount * element.rewardPerPerson
        )
      }
      if (element.rewardType == 'NFT') {
        nft.set(
          element.denomination ? element.denomination : 'Nft',
          nft.has(element.denomination ? element.denomination : 'Nft')
            ? element.winnerCount * element.rewardPerPerson +
                token.get(element.denomination ? element.denomination : 'Nft')
            : element.winnerCount * element.rewardPerPerson
        )
      }
    }
  )

  return {
    token: sortByValue(token) as any,
    nft: sortByValue(nft) as any
  }
}

export { getRewards }
