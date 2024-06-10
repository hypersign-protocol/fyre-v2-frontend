<template>
  <v-card class="event-card rounded-xl cursor-pointer" @click="viewEvent(eventData)">
    <!-- <div class="overlay" v-if="checkEventEnded()"></div> -->
    <v-overlay
      :model-value="checkEventEnded()"
      class="align-center justify-center"
      scrim="grey"
      contained
    >
    </v-overlay>

    <div>
      <v-img class="align-end text-white" height="200" :src="eventData.banner" cover> </v-img>
      <v-card-text class="card__body">
        <v-card-title class="pa-0 font-16">{{ eventData.eventName }}</v-card-title>
        <EventStatus class="font-12" :eventData="eventData" />
        <div class="d-flex align-center">
          <v-chip size="small" label class="orange--chip mr-2">
            {{ eventData.totalEventXp }} XP
          </v-chip>
          <v-chip
            size="small"
            label
            class="green--chip mr-2"
            v-if="getRewards(eventData).token.length > 0"
          >
            {{ numberToWords(Number(getRewards(eventData).token[0][1])) }}
            {{ getRewards(eventData).token[0][0] }}
          </v-chip>
          <v-chip
            size="small"
            label
            class="green--chip mr-2"
            v-if="getRewards(eventData).token.length > 1"
          >
            {{ numberToWords(Number(getRewards(eventData).token[1][1])) }}
            {{ getRewards(eventData).token[1][0] }}
          </v-chip>

          <v-chip
            size="small"
            label
            class="purple--chip mr-2"
            v-if="getRewards(eventData).nft.length > 0"
          >
            {{ numberToWords(Number(getRewards(eventData).nft[0][1])) }}
            {{ getRewards(eventData).nft[0][0] }}
          </v-chip>
          <v-chip
            size="small"
            label
            class="purple--chip mr-2"
            v-if="getRewards(eventData).nft.length > 1"
          >
            {{ numberToWords(Number(getRewards(eventData).nft[1][1])) }}
            {{ getRewards(eventData).nft[1][0] }}
          </v-chip>
        </div>
        <p class="my-2">{{ eventData.participantCount }} Participants</p>
        <div class="d-flex align-center mb-2">
          <v-chip class="tag__chip" size="x-small" v-for="(item, index) in eventData.tags">{{
            item
          }}</v-chip>
        </div>
      </v-card-text>
      <div class="card__footer">
        <v-divider></v-divider>
        <v-card-actions class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar class="cursor-pointer mr-2">
              <v-img alt="John" :src="eventData.communityDetail?.avatar"></v-img>
            </v-avatar>
            <p class="mr-2 font-14 lh-16">{{ eventData.communityDetail?.communityName }}</p>
            <img
              v-if="eventData.communityDetail?.hasDomainVerified"
              src="@/assets/images/verify.svg"
              height="16"
            />
          </div>
          <div class="d-flex align-center">
            <v-avatar size="small" class="cursor-pointer mr-2">
              <v-img alt="John" src="@/assets/images/verify-check.svg"></v-img>
            </v-avatar>
          </div>
        </v-card-actions>
      </div>
    </div>
  </v-card>
</template>
<script lang="ts" setup>
import { isEventHappening } from '@/composables/event.ts'

const { eventData } = defineProps(['eventData'])

const viewEvent = (event) => {
  window.location.href = `/event/${eventData._id}`
}
function sortByValue(map) {
  // Convert the Map to an array of key-value pairs
  const entries = Array.from(map)

  // Sort the array by value (descending order)
  entries.sort((a, b) => b[1] - a[1])

  // Return a new Map from the sorted array
  return entries
}
const getRewards = (event) => {
  let token = new Map()
  let nft = new Map()
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

getRewards(eventData)

function numberToWords(n) {
  // Handle negative numbers
  if (n < 0) {
    return 'Please enter a non-negative number.'
  }

  const singleDigit = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const doubleDigit = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19']
  const belowHundred = ['20', '30', '40', '50', '60', '70', '80', '90']
  const largeNumbers = [
    '',
    '1000',
    ' Million',
    ' Billion',
    ' Trillion',
    ' Quadrillion',
    ' Quintillion'
  ]

  // Handle zero
  if (n === 0) {
    return '0'
  }

  function translate(n) {
    let word = ''
    if (n === 100) {
      word = '100'
    } else if (n < 10) {
      word = singleDigit[n] + ' '
    } else if (n < 20) {
      word = doubleDigit[n - 10] + ' '
    } else if (n < 100) {
      const rem = translate(n % 10)
      word = belowHundred[(n - (n % 10)) / 10 - 2] + ' ' + rem
    } else {
      word = translate(Math.floor(n / 100)) + '' + translate(n % 100)
    }
    return word.trim()
  }

  // Handle numbers up to quintillion (10^18)
  let words = ''
  let i = 0
  while (n > 0) {
    const group = n % 1000
    // Check if group has non-zero digits
    if (group !== 0) {
      words = translate(group) + largeNumbers[i] + ' ' + words
    }
    n = Math.floor(n / 1000)
    i++
    // Limit to quintillion (adjust LARGE_NUMBERS if needed)
    if (i === largeNumbers.length) {
      break
    }
  }

  // Handle very large numbers beyond supported range
  if (i === largeNumbers.length && n > 0) {
    words = 'Number too large for precise conversion. (Exceeds Quintillion)'
  }

  return words.trim()
}

const checkEventEnded = () => {
  const res = isEventHappening(eventData.startDate, eventData.endDate)
  return !res.eventInProgress ? true : false
}
</script>
