<template lang="pug">
.popup-wrapper(@click.self="$emit('close')")
	.device-selector
		span.bold(v-if="connectedDevices.length") Connected devices
		span.bold(v-else) No devices connected
		.device(v-for="device of connectedDevices" :key="device.usbDevice.productId")
			span.cursor-pointer(@click="viewedDevice = device") {{device.usbDevice.productName}}
			button.red(@click="device.disconnect()") Disconnect
		button.bold.w-full.mt-4(@click="connect")
			| {{connectedDevices.length ? 'Connect another' : 'Connect'}}
	Transition
		DeviceViewer(v-if="viewedDevice" :device="viewedDevice" @close="viewedDevice = null")
</template>

<script setup lang="ts">
import {Device, connectDevice, connectedDevices} from '../scripts/driver';
import DeviceViewer from './DeviceViewer.vue';
import {ref} from 'vue';

defineEmits<{(e: 'close'): void}>();
const viewedDevice = ref<Device | null>(null);

function connect(): void {
	connectDevice().catch(() => console.warn('No device selected to connect'));
}
</script>

<style scoped>
.device {
	@apply my-2 flex flex-wrap gap-4 items-center;
}

.device-selector {
	position: fixed;
	right: 30px;
	top: 30px;
	max-width: min(768px, 90vw);
	margin-left: 30px;
	padding: 2rem min(2rem, 10%);
	border-radius: 1rem;
	color: var(--color-foreground);
	background-color: var(--color-background);
}

@media screen and (prefers-color-scheme: dark) {
	.device-selector {
		border: 1px solid var(--color-foreground);
	}
}
</style>
