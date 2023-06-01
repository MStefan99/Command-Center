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
import {TemperatureEvent} from '../scripts/types';

deviceEventEmitter.addEventListener('temperature', (e) => {
	const ev = e as TemperatureEvent;
	device.value.temperature +=
		(ev.detail.temperature - device.value.temperature) / (2000 / ev.detail.dt);
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
