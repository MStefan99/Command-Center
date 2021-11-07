<template lang="pug">
div#device-selector
	span.bold(v-if="sharedState.devices.length") Connected devices
	span.bold(v-else) No devices connected
	div#devices
		div.device(v-for="device of sharedState.devices")
			span {{device.usbDevice.productName}}
			span.disconnect-button(@click="disconnect(device)") X
	div#connect-button(@click="connect") {{sharedState.devices.length? 'Connect another' : 'Connect'}}
</template>


<style lang="stylus" scoped>
@require "../style/colors.styl"

#device-selector
	position absolute
	right 1em
	top 3em
	background-color color-gray
	box-shadow 0 0 1em #0005
	border-radius 6px
	padding 1em

	#devices
		margin 1em 0

		.device
			margin-bottom .5em

	.disconnect-button
		color color-red
		font-weight bold
		margin-left 1ch
		cursor pointer
		user-select none

	#connect-button
		background-color color-blue
		font-weight bold
		padding .5em
		border-radius 4px
		text-align center
		cursor pointer
</style>


<script>
import store from '../js/store.js';


export default {
	name: 'DeviceSelector',
	data() {
		return {
			sharedState: store
		};
	},
	methods: {
		connect() {
			navigator.usb.requestDevice({filters: [{vendorId: 0x04D8}]})
					.then(device => {
						this.sharedState.addDevice({
							usbDevice: device,
							type: device.productId === 0x000a? 'transceiver' : 'controller'
						});
						return device.open();
					})
					.catch(() => {
						console.warn('No device selected to connect');
					});
		},
		disconnect(device) {
			if (confirm('Are you sure you want to disconnect ' + device.usbDevice.productName + '?')) {
				this.sharedState.removeDevice(device);
				device.usbDevice.close();
			}
		}
	}
};
</script>
