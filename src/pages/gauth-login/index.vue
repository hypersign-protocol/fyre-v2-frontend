<template>
    <!-- <div>
        <button type="button" class="btn btn-primary" @click="login()">Login With Google</button>
    </div> -->
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch, onBeforeMount } from 'vue'

onBeforeMount(() => {
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http://localhost:9002/gauth-cb&scope=email%20profile&client_id=777246753954-8bfp8l4d70c6hrpaj1pempmdt3a0rh5o.apps.googleusercontent.com'
})
</script>
