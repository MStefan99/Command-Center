<template lang="pug">
div#device-viewer.container-sm
	div.d-flex.align-items-start.justify-content-between
		h2 Device information
		i.fi.fi-br-cross.text-danger.cursor-pointer.ml-2(@click="this.sharedState.stopViewingDevice()")
	div.d-flex.justify-content-between
		span Vendor
		span.bold.my-1 {{device.manufacturerName}}
	div.d-flex.justify-content-between
		span Name
		span.bold.my-1 {{device.productName}}
	div.d-flex.justify-content-between
		span Device version
		span.bold.my-1 {{device.deviceVersionMajor}}.{{device.deviceVersionMinor}}.{{device.deviceVersionSubminor}}
	div.d-flex.justify-content-between
		span Supported USB version
		span.bold.my-1 {{device.usbVersionMajor}}.{{device.usbVersionMinor}}
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
	color color-white
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
			device: store.applicationState.viewedDevice._usb
		}
	}
};
</script>
