<template lang="pug">
#home
	AttitudeIndicator.attitude(:roll="0" :pitch="0")
	p Acceleration
	div(v-for="(axis, i) of device.acceleration" :key="i")
		p {{accLabels[i]}} axis: {{axis.toFixed(2)}}
		meter(min="-2" max="2" :value="axis")
	p Rotation
	div(v-for="(axis, i) of device.rotation" :key="i")
		p {{rotLabels[i]}} axis: {{axis.toFixed(2)}}
		meter(min="-250" max="250" :value="axis")
	p Temperature {{device.temperature.toFixed(1)}}°C
	meter(min="10" max="70" :value="device.temperature ?? 0")
</template>

<script setup lang="ts">
import AttitudeIndicator from '../components/AttitudeIndicator.vue';
import {ref} from 'vue';
import {deviceEventEmitter} from '../scripts/driver';
import {ModelEvent, StatusDescriptor} from '../scripts/types';

const accLSB = 0.122 / 1000;
const rotLSB = 8.75 / 1000;

const accLabels = ['X', 'Y', 'Z'];
const rotLabels = ['P', 'Q', 'R'];

deviceEventEmitter.addEventListener('data', (e) => {
	const ev = e as ModelEvent;

	switch (ev.detail.descriptor.constructor) {
		case StatusDescriptor:
			{
				const d = ev.detail.descriptor as StatusDescriptor;
				device.value.temperature = d.data.temperature;
				device.value.acceleration = d.data.acceleration.map((a) => a * accLSB);
				device.value.rotation = d.data.rotation.map((r) => r * rotLSB);
			}
			break;
	}
});

const device = ref({
	acceleration: [0, 0, 0],
	rotation: [0, 0, 0],
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
