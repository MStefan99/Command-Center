<template lang="pug">
NavBar
main
	RouterView(v-if="activeDevice")
	.no-device(v-else)
		p.mb-4 Start by clicking here ↑
		p Connect a device to start using Command Center
	PopupContainer
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import {activeDevice} from './scripts/driver';
import PopupContainer from './components/PopupContainer.vue';
</script>

<style>
.no-device {
	@apply flex flex-row-reverse flex-wrap justify-between;
	margin: 16px;
	color: var(--color-accent);
	font-weight: bold;
	font-size: 1.2em;
}
</style>
