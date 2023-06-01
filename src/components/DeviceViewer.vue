<template lang="pug">
#device-viewer.container-sm
	.d-flex.align-items-start.justify-content-between
		h2 Device information
		span.text-danger.cursor-pointer.ml-2(@click="$emit('close')") X
	.d-flex.justify-content-between
		span Vendor
		span.bold.my-1 {{device.usbDevice.manufacturerName}}
	.d-flex.justify-content-between
		span Name
		span.bold.my-1 {{device.usbDevice.productName}}
	.d-flex.justify-content-between
		span Device version
		span.bold.my-1 {{device.deviceVersion}}
	.d-flex.justify-content-between
		span Supported USB version
		span.bold.my-1 {{device.usbVersion}}
</template>

<script setup lang="ts">
import {Device} from '../scripts/driver';

defineProps<{device: Device}>();
defineEmits<{(e: 'close'): void}>();
</script>

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
