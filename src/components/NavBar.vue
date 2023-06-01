<template lang="pug">
div
	nav#title-bar
		span#title Command Center
		label#device-status.connected(v-if="connectedDevices.length" for="device-toggle") Connected
		label#device-status(v-else for="device-toggle") Not connected
		input#device-toggle.hidden(type="checkbox" v-model="deviceSelectorOpen")
	Teleport(to="body")
		Transition
			DeviceSelector(v-if="deviceSelectorOpen" @close="deviceSelectorOpen = false")
</template>

<script setup lang="ts">
import DeviceSelector from './DeviceSelector.vue';
import {connectedDevices} from '../scripts/driver';
import {ref} from 'vue';

const deviceSelectorOpen = ref<boolean>(false);
</script>

<style scoped>
#title-bar #title {
	font-size: 1.5em;
	font-weight: bold;
}

#device-status {
	font-weight: bold;
	cursor: pointer;
	margin-left: auto;
	user-select: none;
	color: var(--color-light);
}

#device-status.connected {
	color: var(--color-white);
}
</style>
