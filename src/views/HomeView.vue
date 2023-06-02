<template lang="pug">
#home
	AttitudeIndicator.attitude(:roll="device.roll ?? 0" :pitch="device.pitch ?? 0")
	div
		p Roll {{Math.round(device.roll)}}°
		meter(min="-90" max="90" :value="device.roll ?? 0")
	div
		p Pitch {{Math.round(device.pitch)}}°
		meter(min="-90" max="90" :value="device.pitch ?? 0")
	div
		p Temperature {{device.temperature.toFixed(1)}}°C
		meter(min="10" max="70" :value="device.temperature ?? 0")
</template>

<script setup lang="ts">
import AttitudeIndicator from '../components/AttitudeIndicator.vue';
import {ref} from 'vue';
import {deviceEventEmitter} from '../scripts/driver';
import {ModelEvent} from '../scripts/types';

deviceEventEmitter.addEventListener('temperature', (e) => {
	const ev = e as ModelEvent;
	console.log(ev.detail.commands);
});

const data = new Uint8Array([
	48, // Total length
	0x00, // Data IN descriptor
	4, // Temp length,
	0x00, // Temp type
	45, // Temperature
	0x00,
	6, // Attitude length
	0x01, // Attitude type
	100,
	0x00, // Roll
	50,
	0x00, // Pitch
	18, // Input channels length,
	0x02, // Input channels type
	0x70, // Channel 0-8 values
	0x72,
	0xb2,
	0x26,
	0x7d,
	0x7e,
	0xa7,
	0xf6,
	0xaf,
	0x24,
	0xa1,
	0x44,
	0x19,
	0x0f,
	0x5a,
	0x00,
	18, // Output channels length
	0x03, // Output channels type
	0x47, // Channel 0-8 values
	0xe2,
	0x12,
	0xb6,
	0x40,
	0x59,
	0x81,
	0xae,
	0xa5,
	0x8d,
	0xc4,
	0x90,
	0x46,
	0xef,
	0xeb,
	0x00
]);

const device = ref({
	roll: 0,
	pitch: 0,
	temperature: 0
});
</script>

<style scoped>
#home {
	display: flex;
	flex-flow: column;
	padding: 2em;
}

meter {
	margin-bottom: 1em;
	height: 3em;
	width: 40em;
	max-width: 90vw;
}

.attitude {
	max-width: min(500px, 90vw);
	margin: 1em;
}
</style>
