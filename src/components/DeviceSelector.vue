<link rel="stylesheet" href="../style/style.styl">
<template lang="pug">
div#device-selector
	span.bold(v-if="sharedState.devices.length") Connected devices
	span.bold(v-else) No devices connected
	div.my-3
		div.my-2.device(v-for="device of sharedState.devices" :key="device.id")
			span.cursor-pointer(@click="this.sharedState.viewDevice(device)") {{device.usbDevice.productName}}
			span.text-danger.cursor-pointer.bold.ml-2(@click="disconnect(device)") X
	button.btn-primary.bold.user-select-none.w-100.mt-1(@click="connect")
		| {{sharedState.devices.length? 'Connect another' : 'Connect'}}
</template>


<style lang="stylus" scoped>
@require "../style/colors.styl"
@require "../style/stylify.styl"

#device-selector
	position absolute
	right 1em
	top 3em
	background-color color-gray
	box-shadow 0 0 1em #0005
	border-radius 6px
	padding 1em
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
			navigator.usb.requestDevice({
				filters: [
					{vendorId: 0x04D8, productId: 0x000a},
					{vendorId: 0x04D8, productId: 0x000b}
				]
			})
					.then(device => {
						this.sharedState.addDevice({
							usbDevice: device,
							id: Math.floor((Math.random() * 0xffff)).toString(16),
							type: device.productId !== 0x000a? 'controller' : 'transceiver'
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
