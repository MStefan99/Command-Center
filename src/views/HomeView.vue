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
import {ModelEvent, StatusDescriptor} from '../scripts/types';

deviceEventEmitter.addEventListener('data', (e) => {
	const ev = e as ModelEvent;

	switch (ev.detail.descriptor.constructor) {
		case StatusDescriptor:
			{
				const d = ev.detail.descriptor as StatusDescriptor;
				device.value.temperature = d.data.temperature;
			}
			break;
	}
});

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
