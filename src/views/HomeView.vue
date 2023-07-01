<template lang="pug">
#home
	AttitudeIndicator.attitude(:roll="device.roll" :pitch="device.pitch")
	p Acceleration
	div(v-for="(axis, i) of device.acceleration" :key="i")
		p {{accLabels[i]}} axis: {{axis.toFixed(2)}}
		meter(min="-2" max="2" :value="axis")
	p Rotation
	div(v-for="(axis, i) of device.rotation" :key="i")
		p {{rotLabels[i]}} axis: {{axis.toFixed(2)}}
		meter(min="-250" max="250" :value="axis")
	p Attitude
	div
		p Roll: {{device.roll.toFixed(2)}}°
		meter(min="-90" max="90" :value="device.roll ?? 0")
	div
		p Pitch: {{device.pitch.toFixed(2)}}°
		meter(min="-90" max="90" :value="device.pitch ?? 0")
	div
		p Temperature: {{device.temperature}}°C
		meter(min="10" max="60" :value="device.temperature ?? 0")
</template>

<script setup lang="ts">
import AttitudeIndicator from '../components/AttitudeIndicator.vue';
import {ref} from 'vue';
import {deviceEventEmitter} from '../scripts/driver';
import {ModelEvent, StatusDescriptor} from '../scripts/types';

const accLabels = ['X', 'Y', 'Z'];
const rotLabels = ['P', 'Q', 'R'];

deviceEventEmitter.addEventListener('data', (e) => {
	const ev = e as ModelEvent;

	switch (ev.detail.descriptor.constructor) {
		case StatusDescriptor:
			{
				const data = (ev.detail.descriptor as StatusDescriptor).data;

				device.value.temperature = data.temperature;
				device.value.acceleration = data.acceleration;
				device.value.rotation = data.rotation;
				device.value.roll = data.roll;
				device.value.pitch = data.pitch;
			}
			break;
	}
});

const device = ref({
	acceleration: [0, 0, 0],
	rotation: [0, 0, 0],
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
