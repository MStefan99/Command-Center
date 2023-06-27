<template lang="pug">
div
	#title-bar
		span#title Command Center
		nav
			RouterLink(:to="{name: 'home'}") Home
			RouterLink(:to="{name: 'settings'}") Settings
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
#title-bar {
	display: flex;
	flex-flow: row wrap;
	justify-content: space-between;
	align-items: center;
	background-color: var(--color-accent);
	color: var(--color-white);
	padding: 0.5em 1em;
	margin-bottom: 1em;
}

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

nav {
	@apply ml-8 flex flex-row gap-4;
	height: 100px;
}

nav a {
	display: inline-block;
	height: 100%;
}

nav a.router-link-active {
	background-color: var(--color-background);
	color: var(--color-accent);
}
</style>
