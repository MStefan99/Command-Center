<template lang="pug">
div
	nav#title-bar
		a#home-link(href="/") Command Center
		label.connected(v-if="connectedDevices.length" for="device-toggle") Connected
		label(v-else for="device-toggle") Not connected
		input#device-toggle.hidden(type="checkbox" v-model="deviceSelectorOpen")
	DeviceSelector(v-if="deviceSelectorOpen")
</template>

<script setup lang="ts">
import DeviceSelector from './DeviceSelector.vue';
import {connectedDevices} from '../scripts/driver';
import {ref} from 'vue';

const deviceSelectorOpen = ref<boolean>(false);
</script>

<style lang="stylus" scoped>
@require "../assets/colors.styl"
@require "../assets/stylify.styl"

#title-bar #home-link
	font-size 2em
	font-weight bold

	@media screen and (max-width 768px)
		font-size 1.5em

#device-status
	font-weight bold
	cursor pointer
	margin-left auto
	user-select none
	color lighten(color-gray, 50%)

	&.error
		color color-red

	&.warning
		color color-yellow

	&.connected
		color color-green
</style>
