<template lang="pug">
NavBar
main
	RouterView(v-if="connectedDevices.length")
	.no-device(v-else) Connect a device to start using Command Center
	PopupContainer
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import {connectedDevices} from './scripts/driver';
import PopupContainer from './components/PopupContainer.vue';
</script>

<style>
.no-device {
	margin: 16px;
	color: var(--color-accent);
	font-weight: bold;
	font-size: 1.2em;
}
</style>
