<template>
    <div class="d-flex flex-fill flex-column align-center cursor-pointer bg-grey-lighten-5 pa-4 rounded-xl"
        @click="login()">
        <v-avatar color="#D4D7DE" size="50">
            <img height="40" src="../assets/images/google.svg" />
        </v-avatar>
        <div class="pt-3">{{ buttontext }}</div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

let buttontext = ref('Google')
let isDisabled = ref(false)
let token = ref(null)
let interval = ref(null)

const emit = defineEmits(['getGoogleCode', 'close', 'loading'])

//const { googleClientId, googleCallBackUrl } = defineProps(['googleClientId', 'googleCallBackUrl'])
const { googleClientId, googleCallBackUrl } = defineProps({
    googleClientId: { type: String, required: true },
    googleCallBackUrl: { type: String, required: true },
})

onMounted(() => {
    buttontext.value = 'Google'
    isDisabled.value = false
})

const login = () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${googleCallBackUrl}&scope=email%20profile&client_id=${googleClientId}`
    const childWindow = window.open(url, 'google login', 'height=500,width=500')
    emit('loading', true)
    buttontext.value = "Logging...."
    isDisabled.value = true
    interval.value = setInterval(() => {
        if (childWindow && childWindow.closed && token.value == null) {
            buttontext.value = "Google"
            isDisabled.value = false
            clearInterval(interval.value)
            // emit('close', 'User did not proceed with Google Login')
        }
    }, 500)
}

window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin) return;
    if (event.data) {
        if (event.data && event.data.code) {
            token.value = event.data.code
            console.log('gauth:indexvue:: Authorization Code:', token.value)
            emit('getGoogleCode', token.value)
            buttontext.value = "Logged In"
            isDisabled.value = true
            clearInterval(interval.value)
            // emit('loading', false)
        }
    }
});
</script>
