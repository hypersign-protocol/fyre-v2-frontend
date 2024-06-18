<template>
    <!-- <div>
        <button type="button" class="btn btn-primary" @click="login()">Login With Google</button>
    </div> -->
</template>

<script lang="ts" setup>

import { onMounted, reactive, ref, watch } from 'vue'

onMounted(() => {
    const data = {
        message: 'success',
        token: '123123123-tokens'
    }
    window.opener.postMessage(data, window.location.origin);
    window.close()
})

</script>
