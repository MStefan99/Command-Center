<template lang="pug">
div#device-viewer.container-sm
	div.d-flex.align-items-start.justify-content-between
		h2 Device information
		span.text-danger.cursor-pointer.bold.ml-2(@click="this.sharedState.stopViewingDevice()") X
	div.d-flex.justify-content-between
		span Vendor
		span.bold.my-1 {{device.usbDevice.manufacturerName}}
	div.d-flex.justify-content-between
		span Vendor ID
		span.bold.my-1 {{device.usbDevice.vendorId}}
	div.d-flex.justify-content-between
		span Name
		span.bold.my-1 {{device.usbDevice.productName || 'N/A'}}
	div.d-flex.justify-content-between
		span Device ID
		span.bold.my-1 {{device.usbDevice.productId}}
	div.d-flex.justify-content-between
		span Device version
		span.bold.my-1 {{device.usbDevice.deviceVersionMajor}}.{{device.usbDevice.deviceVersionMinor}}.{{device.usbDevice.deviceVersionSubminor}}
	div.d-flex.justify-content-between
		span Supported USB version
		span.bold.my-1 {{device.usbDevice.usbVersionMajor}}.{{device.usbDevice.usbVersionMinor}}.{{device.usbDevice.usbVersionSubminor}}
	div.d-flex.justify-content-between
		span Connected
		span.bold.my-1 {{device.usbDevice.opened? 'Yes' : 'No'}}
	div.d-flex.justify-content-between
		span Application ID
		span.bold.my-1 0x{{device.id}}
</template>


<style lang="stylus" scoped>
@require "../style/colors.styl"
@require "../style/stylify.styl"

#device-viewer
	position fixed
	top 20vh
	left 0
	right 0
	margin 0 auto
	background-color color-gray
	box-shadow 0 0 1em #0005
	border-radius 6px
	padding 1em
</style>


<script>
import store from '../js/store.js';


export default {
	name: 'DeviceViewer',
	data() {
		return {
			sharedState: store,
			device: store.applicationState.viewedDevice
		}
	}
};
</script>
