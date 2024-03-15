<template>
  <v-container fluid class="background-left padding-global-y">
    <h2 class="text-center font-48 pt-15 pb-3">FAQs</h2>
    <v-container>
      <v-expansion-panels color="transparent" variant="accordion">
        <v-expansion-panel
          bg-color="transparent"
          v-for="(item, index) in faqs"
          :key="index"
          collapse-icon="mdi-minus"
          expand-icon="mdi-plus"
        >
          <template v-slot:title>
            <p class="font-16 llh-18 font-weight-medium">{{ item.title }}</p>
          </template>
          <template v-slot:text>
            <p class="font-16 llh-18 font-weight-regular">{{ item.description }}</p>
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </v-container>
</template>
<script lang="ts" setup>
  import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
const faqs = ref([
  {
    title: `What is Fyre?`,
    description: `Fyre is a  platform that lets you build custom campaigns for Whitelisting, Sweepstakes, verification of token/NFT holding on most EVM compatible chains and Cosmos, or rewarding people for performing specific actions on your dApp, which is verified through APIs.`
  },
  {
    title: `Who  uses Fyre?`,
    description: `Businesses(Surveys, Customer, Profiling, promotional Campaigns), Non Profits(Secure distribution of charity funds and giveaways), Influencers(Run campaigns to identify fans and followers), IDO Launchpads(Marketing and promotional campaigns to filter and Verify Users)`
  },
  {
    title: `How to login as organizer?`,
    description: `While you login into Fyre you get an option to choose roles, choose “Organiser” role while creating a profile on the platform. `
  },
  {
    title: `How to login as Participant?`,
    description: `While you login into Fyre you get an option to choose roles, choose “Participant” role while creating a profile on the platform. `
  },
  {
    title: `How to Participate?`,
    description: `Scroll through live events on the landing page post login & participate in any by following the steps. `
  },
  {
    title: `What is Event?`,
    description: `Event is the core feature of Fyre platform. Organisers can create an event by navigating to the Events page from the left navigation bar.`
  },
  {
    title: `What is Community?`,
    description: `A community is a company profile on the Fyre platform, community creates a campaign. `
  },
  {
    title: `What is Pricing?`,
    description: ` Clear details about the cost associated with each plan, which includes four plans(Ape, Degen, Lambo, Moon, Satoshi) , one-time payments, or usage-based charges. This involves access to features, and other benefits. `
  }
])
</script>
