<template lang="pug">
#device-selector.my-5.mx-3
	span.bold(v-if="sharedState.usbDriver.devices.length") Connected devices
	span.bold(v-else) No devices connected
	.my-3
		.my-2.device(v-for="device of sharedState.usbDriver.devices" :key="device._usb.productId")
			span.cursor-pointer(@click="this.sharedState.viewDevice(device)") {{device._usb.productName}}
			i.fi.fi-br-cross-circle.text-danger.cursor-pointer.ml-2(
				@click="sharedState.usbDriver.disconnectDevice(device)")
	button.btn-primary.bold.user-select-none.w-100.mt-1(@click="connect")
		| {{sharedState.usbDriver.devices.length ? 'Connect another' : 'Connect'}}
</template>

<style lang="stylus" scoped>
@require "../assets/colors.styl"
@require "../assets/stylify.styl"

#device-selector
	position absolute
	top 0
	right 0
	color color-white
	background-color color-gray
	box-shadow 0 0 1em #0005
	border-radius 6px
	padding 1em
</style>

<script setup lang="ts">
import {connectDevice} from '../scripts/driver';

function connect(): void {
	navigator.usb
		.requestDevice({
			filters: [
				{vendorId: 0x04d8, productId: 0x000a},
				{vendorId: 0x04d8, productId: 0x000b}
			]
		})
		.then((device) => connectDevice(device))
		.catch(() => console.warn('No device selected to connect'));
}
</script>
