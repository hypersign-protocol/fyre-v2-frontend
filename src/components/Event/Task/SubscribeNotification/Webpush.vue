<template>
    <div class="task__wrap">
        <div class="task__top">
            <p class="text-red-100" v-if="task.isMandatory">Mandatory</p>
            <p class="text-green-100" v-if="!task.isMandatory">Optional</p>
        </div>
        <div class="task__header">
            <div class="task__title">
                <span>
                    <img src="@/assets/images/task/subscribe-webpush.png" />
                </span>
                <span class="text text-white-100 text-capitalize">{{ task.title }}</span>
                <span class="points text-blue-100"> +{{ task.xp }}XP </span>
            </div>
            <div class="task__action" @click="checkIfUserLogged">
                <v-btn v-if="!showExpand && !isTaskVerified"> Verify </v-btn>
                <v-btn variant="outlined" v-else-if="!showExpand && isTaskVerified">
                    <v-icon>mdi-check</v-icon>
                    Verified
                </v-btn>
                <v-icon v-if="showExpand" color="white">mdi-close</v-icon>
            </div>
        </div>
        <div class="task__body" v-if="showExpand">
            <div class="task__submit">
                <v-btn @click="subscribeBrowerNotification" :disabled="isTaskVerified"
                    v-if="!redirected && !isTaskVerified">
                    <span v-if="!isTaskVerified">Subscribe</span>
                </v-btn>
                <v-btn :loading="loading" v-if="redirected && !isTaskVerified" @click="performAction"
                    :disabled="isTaskVerified">
                    <span v-if="!isTaskVerified">Verify</span>
                </v-btn>
                <v-btn v-if="isTaskVerified" :disabled="isTaskVerified">
                    <span v-if="isTaskVerified">Subscribed</span>
                </v-btn>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useEventParticipantStore } from '@/store/eventParticipant.ts'
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch } from 'vue'
import { useNotificationStore } from '@/store/notification.ts'
import { webAuth } from '@/composables/twitterAuth.ts'

const props = defineProps({
    communityId: { type: String, required: true },
    token: { type: String, required: true },
    task: {
        type: Object,
        required: true,
        default() {
            return {}
        }
    },
    eventParticipants: {
        type: Object,
        required: true,
        default() {
            return {}
        }
    }
})
const redirected = ref(false)
const showExpand = ref(false)
const loading = ref(false)
const isTaskVerified = ref(false)

const store = useEventParticipantStore()
const { performResult } = storeToRefs(useEventParticipantStore())

const notificationStore = useNotificationStore()

const checkIfUserLogged = () => {
    if (props.token) {
        showExpand.value = !showExpand.value
    } else {
        notificationStore.SHOW_NOTIFICATION({
            show: true,
            type: 'error',
            message: 'Please login to perform action'
        })
    }
}

onMounted(() => {
    fetchResult()
})

const fetchResult = () => {
    if (props.eventParticipants?.tasks?.hasOwnProperty(props.task?._id)) {
        isTaskVerified.value = true
    }
}


watch(
    () => performResult.value,
    (value: any) => {
        setTimeout(() => {
            loading.value = false
            if (performResult.value.tasks.hasOwnProperty(props.task._id)) {
                isTaskVerified.value = true
                showExpand.value = false
            }
        }, 500)
    },
    { deep: true }
)

function urlB64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        // eslint-disable-next-line no-useless-escape
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const subscribeBrowerNotification = async () => {

    const webpushPublicKey = import.meta.env.VITE_APP_WEBPUSH_VAPID_PUBLIC_KEY
    if (!webpushPublicKey) {
        return notificationStore.SHOW_NOTIFICATION({
            show: true,
            type: 'error',
            message: 'Webpush public key is not set, please contact the administrator'
        })
    }

    //eslint-disable-next-line
    debugger;
    if ("Notification" in window && navigator.serviceWorker) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            try {
                try {
                    const brave = await navigator.brave.isBrave();
                    if (brave) {
                        alert(
                            "Brave browser Detected User Google Service to Enable Push brave://settings/privacy"
                        );
                    }
                } catch (error) {
                    console.log("Not Brave");
                }

                await navigator.serviceWorker
                    .register(`/service-worker.js`, { scope: "/" })
                    .then(async () => {
                        return await navigator.serviceWorker.ready;
                    })
                    .then(async (reg) => {

                        const applicationServerKey = await urlB64ToUint8Array(
                            webpushPublicKey
                        );
                        reg.addEventListener("updatefound", () => {
                            reg.update();
                        })

                        reg.pushManager
                            .subscribe({ applicationServerKey, userVisibleOnly: true })
                            .then(async (e) => {

                                console.log(JSON.stringify(e));

                                // // this.data.subObj = e;
                                // this.data.subscription = await this.saveSubscription(e);
                                props.task.options.proofConfig.proof.subObj = e;
                                redirected.value = true;
                                // localStorage.setItem("subsId", this.data.subscription._id);
                            });
                    });


            } catch (error) {
                console.error(error);
                //console.error("Service Worker Registration Faild");
                notificationStore.SHOW_NOTIFICATION({
                    show: true,
                    type: 'error',
                    message: 'Service Worker Registration Faild, ' + error.message
                })
            }
        } else if (permission === "blocked" || permission === "denied") {
            console.error("Notification Blocked");
            notificationStore.SHOW_NOTIFICATION({
                show: true,
                type: 'error',
                message: 'Notification Blocked'
            })
        }
    } else {
        console.error("Notification Not Supported");
        notificationStore.SHOW_NOTIFICATION({
            show: true,
            type: 'error',
            message: 'Notification Not Supported'
        })
    }
}

const performAction = async () => {
    loading.value = true
    await store.PERFORM_EVENT_TASK({
        eventId: props.task.eventId,
        communityId: props.communityId,
        task: {
            id: props.task._id,
            ...props.task.options.proofConfig
        }
    })
}
</script>