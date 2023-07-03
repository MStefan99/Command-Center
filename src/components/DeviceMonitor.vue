<template lang="pug">
.monitor
	h2.mb-4.text-xl.font-bold Sensor data
	p.font-bold Acceleration
	div(v-for="(axis, i) of acceleration" :key="i")
		p {{accLabels[i]}} axis: {{axis.toFixed(2)}}g
		meter(min="-2" max="2" :value="axis")
	p.font-bold Rotation
	div(v-for="(axis, i) of rotation" :key="i")
		p {{rotLabels[i]}} axis: {{axis.toFixed(2)}}°/s
		meter(min="-250" max="250" :value="axis")
	p.font-bold Attitude
	div
		p Roll: {{roll.toFixed(2)}}°
		meter(min="-90" max="90" :value="roll ?? 0")
	div
		p Pitch: {{pitch.toFixed(2)}}°
		meter(min="-90" max="90" :value="pitch ?? 0")
	p.font-bold Temperature
	div
		p Temperature: {{temperature}}°C
		meter(min="10" max="60" :value="temperature ?? 0")
</template>

<script setup lang="ts">
import {deviceEventEmitter} from '../scripts/driver';
import {ModelEvent, StatusDescriptor} from '../scripts/types';
import {onUnmounted, ref} from 'vue';

const accLabels = ['X', 'Y', 'Z'];
const rotLabels = ['P', 'Q', 'R'];

const temperature = ref(0);
const acceleration = ref([0, 0, 0]);
const rotation = ref([0, 0, 0]);
const roll = ref(0);
const pitch = ref(0);

function listener(e: Event): void {
	const ev = e as ModelEvent;

	switch (ev.detail.descriptor.constructor) {
		case StatusDescriptor:
			{
				const data = (ev.detail.descriptor as StatusDescriptor).data;

				temperature.value = data.temperature;
				acceleration.value = data.acceleration;
				rotation.value = data.rotation;
				roll.value = data.roll;
				pitch.value = data.pitch;
			}
			break;
	}
}

deviceEventEmitter.addEventListener('data', listener);
onUnmounted(() => deviceEventEmitter.removeEventListener('data', listener));
</script>

<style scoped>
.monitor {
	@apply m-4 w-full flex flex-col;
}

meter {
	margin-bottom: 1em;
	height: 3em;
	width: 100%;
	max-width: 700px;
}
</style>
