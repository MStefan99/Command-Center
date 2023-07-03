<template lang="pug">
#home
	AttitudeIndicator.attitude.m-4(:roll="roll" :pitch="pitch")
</template>

<script setup lang="ts">
import AttitudeIndicator from '../components/AttitudeIndicator.vue';
import {onUnmounted, ref} from 'vue';
import {deviceEventEmitter} from '../scripts/driver';
import {ModelEvent, StatusDescriptor} from '../scripts/types';

const roll = ref(0);
const pitch = ref(0);

function listener(e: Event): void {
	const ev = e as ModelEvent;

	switch (ev.detail.descriptor.constructor) {
		case StatusDescriptor:
			{
				const data = (ev.detail.descriptor as StatusDescriptor).data;

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
.attitude {
	max-width: min(500px, 90vw);
}
</style>
