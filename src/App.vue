<template lang="pug">
div
	NavBar
	RouterView(v-if="connectedDevices.length")
	div(v-else) Please connect a device
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import {connectedDevices} from './scripts/driver';
</script>
