<template lang="pug">
#device-viewer.container-sm
	.d-flex.align-items-start.justify-content-between
		h2 Device information
		i.fi.fi-br-cross.text-danger.cursor-pointer.ml-2(@click="this.sharedState.stopViewingDevice()")
	.d-flex.justify-content-between
		span Vendor
		span.bold.my-1 {{device.manufacturerName}}
	.d-flex.justify-content-between
		span Name
		span.bold.my-1 {{device.productName}}
	.d-flex.justify-content-between
		span Device version
		span.bold.my-1 {{device.deviceVersionMajor}}.{{device.deviceVersionMinor}}.{{device.deviceVersionSubminor}}
	.d-flex.justify-content-between
		span Supported USB version
		span.bold.my-1 {{device.usbVersionMajor}}.{{device.usbVersionMinor}}
</template>

<style lang="stylus" scoped>
@require "../assets/colors.styl"
@require "../assets/stylify.styl"

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

<script setup lang="ts">
const device = {};
</script>
