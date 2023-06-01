<template lang="pug">
#container
	AttitudeIndicator#attitude-indicator(:roll="device.roll ?? 0" :pitch="device.pitch ?? 0")
	.d-flex
		label Roll
		span.ml-3 {{Math.round(device.roll)}}°
	meter(min="-90" max="90" :value="device.roll ?? 0")
	.d-flex
		label Pitch
		span.ml-3 {{Math.round(device.pitch)}}°
	meter(min="-90" max="90" :value="device.pitch ?? 0")
	.d-flex
		label Temperature
		span.ml-3 {{Math.round(device.temperature)}}°C
	meter(min="10" max="70" :value="device.temperature ?? 0")
</template>

<script setup lang="ts">
import AttitudeIndicator from '../components/AttitudeIndicator.vue';
import {ref} from 'vue';
import {deviceEventEmitter} from '../scripts/driver';
import {TemperatureEvent} from '../scripts/types';

deviceEventEmitter.addEventListener('temperature', (e) => {
	const ev = e as TemperatureEvent;
	device.value.temperature = ev.detail.temperature;
});

const device = ref({
	roll: 0,
	pitch: 0,
	temperature: 0
});
</script>

<style scoped lang="stylus">
@require "../assets/stylify.styl"

#container
	display flex
	flex-flow column
	padding 2em

	meter
		margin-bottom 1em
		height 3em
		width 40em
		transition value .2s

	#attitude-indicator
		max-width 25em
		margin 3em
</style>
