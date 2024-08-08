<template>
    <v-container fluid class="background-center">

        <div class="homepage-section background-center pt-10">
            <div class="section-content" style="max-width: 700px;">
                <div class="base-style mb-1" v-if="usernotifications && (usernotifications.length > 0)"
                    v-for="eachNotification in usernotifications"
                    style="display: block; padding:24px;     word-wrap: break-word; cursor: pointer;"
                    @click="callToaction(eachNotification.actionUrl)">
                    <v-row>
                        <v-col-2 style="padding:15px">
                            <span>
                                <img :src="getNotificationIcon(eachNotification.type)" width="50" height="50" />
                            </span>
                        </v-col-2>
                        <v-col style="padding:5px;">
                            <p v-html="eachNotification.message"></p>
                            <p style="color:grey">{{ getFormattedDate(eachNotification.createdAt) }} </p>
                        </v-col>
                        <!-- <v-col-1>
                            <span class="right">X</span>
                        </v-col-1> -->
                    </v-row>
                </div>
                <div class="base-style mb-1 pt-3 pb-3 pl-3" v-else>
                    <h2>All good, no notificaiton(s) found!</h2>
                </div>
            </div>
        </div>
    </v-container>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import _ from 'lodash'
import { useUserStore, InAppNotificationType } from '@/store/user.ts'

const userStore = useUserStore()
const loading = ref(false)
const usernotifications = computed(() => userStore.getUserNotifcations)

watch(
    () => usernotifications.value,
    (value: any) => {
        setTimeout(() => {
            loading.value = false
        }, 1000)
    }
)

const getFormattedDate = (dateStr: string) => {

    const isoDateString = dateStr; // Replace with your ISO date string
    const date = new Date(isoDateString);
    const now = new Date();

    const diffInSeconds = Math.floor((now - date) / 1000);

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    const getRelativeTime = (seconds: number) => {
        if (seconds < 60) return rtf.format(-Math.floor(seconds / 1), 'second');
        if (seconds < 3600) return rtf.format(-Math.floor(seconds / 60), 'minute');
        if (seconds < 86400) return rtf.format(-Math.floor(seconds / 3600), 'hour');
        if (seconds < 604800) return rtf.format(-Math.floor(seconds / 86400), 'day');
        if (seconds < 2419200) return rtf.format(-Math.floor(seconds / 604800), 'week');
        if (seconds < 29030400) return rtf.format(-Math.floor(seconds / 2419200), 'month');
        return rtf.format(-Math.floor(seconds / 29030400), 'year');
    };

    return getRelativeTime(diffInSeconds)
}

const getUserNotifications = async () => {
    loading.value = true
    await userStore.USER_NOTIFICATIONS()
}

const getNotificationIcon = (notificationType: InAppNotificationType) => {
    let src = ""
    switch (notificationType) {
        case InAppNotificationType.FOLLOW_COMMUNITY: {
            src = "src/assets/images/task/community-follow.png"
            break;
        }
        case InAppNotificationType.CUSTOM: {
            src = "src/assets/images/custom-notification.png"
            break;
        }
        case InAppNotificationType.NEW_EVENT: {
            src = "src/assets/images/new-campaign.png"
            break;
        }
        case InAppNotificationType.NEW_COMMUNITY_CREATED: {
            src = "src/assets/images/community-created.png"
            break;
        }
        default: {
            src = "src/assets/images/custom-notification.png"
        }
    }
    return src
}

const callToaction = (cta: string) => {
    if (cta) {
        window.open(cta);
    }
}

onMounted(async () => {
    getUserNotifications()
})
</script>