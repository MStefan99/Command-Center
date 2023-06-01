<template lang="pug">
#device-selector.my-5.mx-3
	span.bold(v-if="connectedDevices.length") Connected devices
	span.bold(v-else) No devices connected
	.my-3
		.my-2.device(v-for="device of connectedDevices" :key="device.usbDevice.productId")
			span.cursor-pointer(@click="viewedDevice = device") {{device.usbDevice.productName}}
			span.text-danger.cursor-pointer.ml-2(@click="device.disconnect()") Disconnect
	button.btn-primary.bold.user-select-none.w-100.mt-1(@click="connect")
		| {{connectedDevices.length ? 'Connect another' : 'Connect'}}
	Transition(v-if="viewedDevice")
		DeviceViewer(:device="viewedDevice" @close="viewedDevice = null")
</template>

<script setup lang="ts">
import {Device, connectDevice, connectedDevices} from '../scripts/driver';
import DeviceViewer from './DeviceViewer.vue';
import {ref} from 'vue';

const viewedDevice = ref<Device | null>(null);

function connect(): void {
	connectDevice().catch(() => console.warn('No device selected to connect'));
}
</script>

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
