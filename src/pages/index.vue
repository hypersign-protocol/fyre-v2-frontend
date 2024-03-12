<template>
  <Banner />
  <Slider />
  <v-container fluid class="background-left padding-global-y">
    <h1 class="text-center py-15 font-55">Top Campaigns</h1>
  </v-container>
  <v-container fluid class="background-left">
    <v-container class="container-large">
      <Tabs />
    </v-container>
  </v-container>
  <v-container fluid class="background-left padding-global-y">
    <h1 class="text-center py-15 font-55">Explore Communities</h1>
    <v-container class="container-large">
      <div class="mx-auto d-flex align-center flex-column justify-center text-center">
        <v-row class="pl-12 ma-0">
          <v-col cols="auto" class="pa-2">
            <div class="explore-community-card">
              <v-avatar size="large" class="mb-2">
                <v-img src="@/assets/images/nibiru.png"></v-img>
              </v-avatar>
              <p>Nibiru</p>
            </div> </v-col
          ><v-col cols="auto" class="pa-2">
            <div class="explore-community-card">
              <v-avatar size="large" class="mb-2">
                <v-img src="@/assets/images/secret.png"></v-img>
              </v-avatar>
              <p>Secret</p>
            </div> </v-col
          ><v-col cols="auto" class="pa-2">
            <div class="explore-community-card">
              <v-avatar size="large" class="mb-2">
                <v-img src="@/assets/images/archway.png"></v-img>
              </v-avatar>
              <p>Archway</p>
            </div> </v-col
          ><v-col cols="auto" class="pa-2">
            <div class="explore-community-card">
              <v-avatar size="large" class="mb-2">
                <v-img src="@/assets/images/agoric.png"></v-img>
              </v-avatar>
              <p>Agoric</p>
            </div> </v-col
          ><v-col cols="auto" class="pa-2">
            <div class="explore-community-card">
              <v-avatar size="large" class="mb-2">
                <v-img src="@/assets/images/comdex.png"></v-img>
              </v-avatar>
              <p>Comdex</p>
            </div> </v-col
          ><v-col cols="auto" class="pa-2">
            <div class="explore-community-card">
              <v-avatar size="large" class="mb-2">
                <v-img src="@/assets/images/omniflix.png"></v-img>
              </v-avatar>
              <p>Omniflix</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pr-15 ma-0">
          <v-col cols="auto" class="pa-2">
            <div class="explore-community-card">
              <v-avatar size="large" class="mb-2">
                <v-img src="@/assets/images/avalache.png"></v-img>
              </v-avatar>
              <p>Avalache</p>
            </div> </v-col
          ><v-col cols="auto" class="pa-2">
            <div class="explore-community-card">
              <v-avatar size="large" class="mb-2">
                <v-img src="@/assets/images/stellar.png"></v-img>
              </v-avatar>
              <p>Stellar</p>
            </div> </v-col
          ><v-col cols="auto" class="pa-2">
            <div class="explore-community-card">
              <v-avatar size="large" class="mb-2">
                <v-img src="@/assets/images/tezos.png"></v-img>
              </v-avatar>
              <p>Tezos</p>
            </div> </v-col
          ><v-col cols="auto" class="pa-2">
            <div class="explore-community-card">
              <v-avatar size="large" class="mb-2">
                <v-img src="@/assets/images/osmosis.png"></v-img>
              </v-avatar>
              <p>Osmosis</p>
            </div> </v-col
          ><v-col cols="auto" class="pa-2">
            <div class="explore-community-card">
              <v-avatar size="large" class="mb-2">
                <v-img src="@/assets/images/moon_beam.png"></v-img>
              </v-avatar>
              <p>Moon Beam</p>
            </div> </v-col
          ><v-col cols="auto" class="pa-2">
            <div class="explore-community-card">
              <v-avatar size="large" class="mb-2">
                <v-img src="@/assets/images/moon_river.png"></v-img>
              </v-avatar>
              <p>Moon River</p>
            </div>
          </v-col>
        </v-row>
        <v-btn class="d-flex align-center my-5" variant="outlined" rounded>See more</v-btn>
      </div>
    </v-container>
  </v-container>
  <v-container fluid class="background-left">
    <h2 class="text-center font-48 pt-15 pb-3">How To Get Started</h2>
    <p class="text-center width-800 mx-auto mb-10 font-16 text-gray-100">
      With just a few clicks, you can access a variety of rewards and benefits. Browse and claim the
      rewards that interest you the most and start earning now!
    </p>
    <v-container>
      <v-row class="mt-5">
        <v-col cols="12" md="4">
          <div class="d-flex flex-column align-center text-center">
            <v-img src="@/assets/images/check-mark.png" class="w-100 height-70 mb-4"></v-img>
            <h4 class="font-28 font-weight-medium mb-4">Choose a Event</h4>
            <p>
              Browse our list of exciting events. Find the one that resonates with your interests or
              cause. Click on the event to get started.
            </p>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <div class="d-flex flex-column align-center text-center">
            <v-img src="@/assets/images/task.png" class="w-100 height-70 mb-4"></v-img>
            <h4 class="font-28 font-weight-medium mb-4">Complete the Tasks</h4>
            <p>
              Participate in the event by completing tasks or activities associated with it and
              unlock rewards or badges for your achievements.
            </p>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <div class="d-flex flex-column align-center text-center">
            <v-img src="@/assets/images/reward.png" class="w-100 height-70 mb-4"></v-img>
            <h4 class="font-28 font-weight-medium mb-4">Receive the Rewards</h4>
            <p>
              As you complete tasks and engage in the event, you'll earn rewards or recognition.
              Celebrate your achievements!
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid class="background-left padding-global-y">
      <v-container>
        <v-row class="mt-5">
          <v-col cols="12" md="3">
            <div class="camp--card">
              <div class="camp--icon">
                <img src="@/assets/images/camp001.svg" />
              </div>
              <div class="orange-number">+112,256</div>
              <div class="title__text">Campaigns</div>
              <div class="description__text">Total Campaigns</div>
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <div class="camp--card">
              <div class="camp--icon">
                <img src="@/assets/images/camp002.svg" />
              </div>
              <div class="purple-number">+1,600,000</div>
              <div class="title__text">Rewards</div>
              <div class="description__text">Total Rewards</div>
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <div class="camp--card">
              <div class="camp--icon">
                <img src="@/assets/images/camp003.svg" />
              </div>
              <div class="green-number">+50</div>
              <div class="title__text">Communities</div>
              <div class="description__text">Total Communities</div>
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <div class="camp--card">
              <div class="camp--icon">
                <img src="@/assets/images/camp004.svg" />
              </div>
              <div class="yellow-number">+116,000</div>
              <div class="title__text">Participants</div>
              <div class="description__text">Total Participants</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-container>
  <SupportedChain />

  <Faq />
</template>
