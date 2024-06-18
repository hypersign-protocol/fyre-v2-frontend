<template>
    <div class="mt-3 mb-3">
        <!-- <button type="button" class="btn btn-primary" @click="login()">Login With Google</button> -->
        <v-btn color="secondary" variant="flat" class="cursor-pointer login-button" @click="login()"
            :disabled="isDisabled">
            {{ buttontext }}
        </v-btn>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

let buttontext = ref('Login With Google')
let isDisabled = ref(false)
let token = ref(null)
let interval = ref(null)

onMounted(() => {
    buttontext.value = 'Login With Google'
    isDisabled.value = false
})

const login = () => {
    const childWindow = window.open('/gauth-login', 'google login', 'height=500,width=500')
    buttontext.value = "Logging...."
    isDisabled.value = true
    interval.value = setInterval(() => {
        if (childWindow.closed && token.value == null) {
            buttontext.value = "Login With Google"
            isDisabled.value = false
            clearInterval(interval.value)
        }
    }, 500)
}


window.addEventListener('message', function (event) {

    if (event.origin !== window.location.origin) return;

    if (event.data && event.data.message) {
        if (event.data.token) {
            token.value = event.data.token
            buttontext.value = "Logged In"
            isDisabled.value = true
            clearInterval(interval.value)
        }
    }
});
</script>
