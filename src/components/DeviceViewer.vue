<template lang="pug">
.popup-wrapper(@click.self="$emit('close')")
	.device-viewer.popup
		h2.text-xl Device information
		p Vendor:
			|
			|
			b {{device.usbDevice.manufacturerName}}
		p Name:
			|
			|
			b {{device.usbDevice.productName}}
		p Device version:
			|
			|
			b {{device.deviceVersion}}
		p Supported USB version:
			|
			|
			b {{device.usbVersion}}
</template>

<script setup lang="ts">
import {Device} from '../scripts/driver';

defineProps<{device: Device}>();
defineEmits<{(e: 'close'): void}>();
</script>

<style scoped>
.popup-wrapper {
	background-color: unset;
}

.device-viewer {
	color: var(--color-foreground);
	background-color: var(--color-background);
}

@media screen and (prefers-color-scheme: dark) {
	.device-viewer {
		border: 1px solid var(--color-foreground);
	}
}
</style>
