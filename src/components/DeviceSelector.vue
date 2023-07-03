<template lang="pug">
.popup-wrapper(@click.self="$emit('close')")
	.device-selector
		div(v-if="usbAvailable")
			span.bold(v-if="connectedDevices.length") Connected devices
			span.bold(v-else) No devices connected
			.device(v-for="device of connectedDevices" :key="device.usbDevice.productId")
				span.cursor-pointer(@click="viewedDevice = device") {{device.usbDevice.productName}}
				button.red(@click="device.disconnect()") Disconnect
			button.bold.w-full.mt-4(@click="connect")
				| {{connectedDevices.length ? 'Connect another' : 'Connect'}}
		.no-usb(v-else)
			p.text-red Unfortunately, WebUSB is unavailable on this page.
			p.text-red This might happen because you are using an older browser that doesn't support WebUSB
				|
				| or you opened this page using an insecure HTTP connection.
			p.text-red Please ensure you are using a secure connection or try another browser and/or device.
	Transition
		DeviceViewer(v-if="viewedDevice" :device="viewedDevice" @close="viewedDevice = null")
</template>

<script setup lang="ts">
import {Device, connectDevice, connectedDevices} from '../scripts/driver';
import DeviceViewer from './DeviceViewer.vue';
import {ref} from 'vue';

defineEmits<{(e: 'close'): void}>();
const viewedDevice = ref<Device | null>(null);
const usbAvailable = 'usb' in navigator;

function connect(): void {
	connectDevice();
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

.no-usb p {
	margin-bottom: 1em;
}

@media screen and (prefers-color-scheme: dark) {
	.device-selector {
		border: 1px solid var(--color-foreground);
	}
}
</style>
