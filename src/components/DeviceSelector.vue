<template lang="pug">
div#device-selector.my-5.mx-3
	span.bold(v-if="sharedState.usbDriver.devices.length") Connected devices
	span.bold(v-else) No devices connected
	div.my-3
		div.my-2.device(v-for="device of sharedState.usbDriver.devices"
			:key="device._usb.productId")
			span.cursor-pointer(@click="this.sharedState.viewDevice(device)") {{device._usb.productName}}
			i.fi.fi-br-cross-circle.text-danger.cursor-pointer.ml-2(@click="sharedState.usbDriver.disconnectDevice(device)")
	button.btn-primary.bold.user-select-none.w-100.mt-1(@click="connect")
		| {{sharedState.usbDriver.devices.length? 'Connect another' : 'Connect'}}
</template>


<style lang="stylus" scoped>
@require "../style/colors.styl"
@require "../style/stylify.styl"

#device-selector
	position absolute
	top 0
	right 0
	background-color color-gray
	box-shadow 0 0 1em #0005
	border-radius 6px
	padding 1em
</style>


<script>
import store from '../js/store.js';
import {connectDevice} from '../js/driver.js';


export default {
	name: 'DeviceSelector',
	data() {
		return {
			sharedState: store
		};
	},
	methods: {
		connect() {
			navigator.usb.requestDevice({
				filters: [
					{vendorId: 0x04D8, productId: 0x000a},
					{vendorId: 0x04D8, productId: 0x000b}
				]
			})
				.then(device => connectDevice(device))
				.catch(() => console.warn('No device selected to connect'));
		}
	}
};
</script>
