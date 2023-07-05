<template lang="pug">
.popup-wrapper(@click.self="$emit('close')")
	.device-selector
		span.bold.block(v-if="connectedDevices.length") Connected devices
		span.bold.block(v-else) No devices connected
		.device(v-for="device of connectedDevices" :key="device.id")
			span.cursor-pointer(@click="viewedDevice = device") {{device.productName}}
			.flex.flex-row.flex-wrap.gap-4
				button.green-outline.grow(v-if="device.is(activeDevice)") Active device
				button.green.grow(v-else @click="activeDevice = device") Set active
				button.red.grow(@click="device.disconnect()") Disconnect
		span.bold.block.my-2 Connect
		button.accent.bold.w-full(v-if="usbAvailable" @click="connect()")
			| {{connectedDevices.length ? 'Connect another' : 'Connect'}}
		button.bold.accent-outline.w-full.mt-2(@click="connect(true)") Connect demo device
		p.text-red.mt-4(v-if="!usbAvailable").
			Unfortunately, WebUSB is unavailable on this page.
			This might happen because you are using an browser that doesn't support WebUSB
			or you opened this page using an insecure HTTP connection.
			Please ensure you are using a secure connection or try another browser and/or device.
	Transition
		DeviceViewer(v-if="viewedDevice" :device="viewedDevice" @close="viewedDevice = null")
</template>

<script setup lang="ts">
import {connectDevice, connectedDevices, activeDevice, Device} from '../scripts/driver';
import DeviceViewer from './DeviceViewer.vue';
import {ref} from 'vue';
import {alert, PopupColor} from '../scripts/popups';

defineEmits<{(e: 'close'): void}>();
const viewedDevice = ref<Device | null>(null);
const usbAvailable = 'usb' in navigator;

function connect(demo?: true): void {
	connectDevice(demo).catch(() =>
		alert('Failed to connect', PopupColor.Red, 'An error occurred while trying to connect device')
	);
}
</script>

<style scoped>
.device {
	@apply my-2 flex flex-wrap gap-4 items-center;
	border: 1px solid var(--color-accent);
	padding: 1em;
	border-radius: 8px;
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
