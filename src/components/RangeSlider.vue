<template lang="pug">
.slider
	datalist(v-if="list" :id="'stops-' + idString")
		option(v-for="stop in list" :key="stop" :value="stop")
	//- tabindex enables :focus-within in Safari
	.bar(tabindex="-1")
		input(
			type="range"
			v-model="sliderModel"
			@input="$emit('update:modelValue', value)"
			@change="$emit('change', value)"
			:disabled="disabled"
			:list="list ? 'stops-' + idString : listID"
			:min="min"
			:max="max"
			:step="step")
		.track
		.value.short {{value.toFixed(1)}}
		.value.long {{Math.round(value * 100)}}%
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue';

const props = withDefaults(
	defineProps<{
		modelValue?: number;
		disabled?: boolean;
		min?: number;
		max?: number;
		step?: number;
		list?: number[];
		listID?: string;
	}>(),
	{
		min: -1.5,
		max: 1.5,
		step: 0.001
	}
);
defineEmits<{(e: 'update:modelValue', value: number): void; (e: 'change', value: number): void}>();
watch(
	() => props.modelValue,
	() => (sliderModel.value = props.modelValue?.toString() ?? '0')
);

const sliderModel = ref<string>(props.modelValue?.toString() ?? '0');
const value = computed(() => +sliderModel.value);
const percentage = computed(() => (value.value - props.min) / (props.max - props.min));

const id = new Uint8Array(4);
crypto.getRandomValues(id);
const idString = Array.from(id, (byte) => byte.toString(16).padStart(2, '0')).join('');
</script>

<style scoped>
.bar {
	position: relative;
	margin: -8px auto;
	--width: 4ch;
	--height: 50px;
	width: var(--width);
	transition: width 0.5s ease;
}

.bar:hover {
	--width: 6ch;
}

.bar:focus-within {
	--width: 8ch;
	--height: 200px;
}

.bar:after {
	content: '';
	position: absolute;
	pointer-events: none;
	left: 0;
	right: 0;
	top: 8px;
	bottom: 8px;
	border: 1px solid var(--color-accent);
	border-radius: 4px;
}

.bar input[type='range'] {
	vertical-align: middle;
	height: var(--height);
	width: var(--width);
	-webkit-appearance: slider-vertical;
	opacity: 0;
	transition: height 0.5s ease;
}

.track {
	border-radius: 4px;
	position: absolute;
	pointer-events: none;
	left: 0;
	bottom: 8px;
	height: max(8px, calc((100% - 16px) * v-bind(percentage)));
	width: 100%;
	background-color: var(--color-accent);
	transition: width 0.5s ease;
}

.value {
	position: absolute;
	pointer-events: none;
	font-weight: bold;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	transition: opacity 0.2s ease;
}

.bar:not(:hover) .value.long,
.bar:hover .value.short {
	opacity: 0;
}

input[type='range']::-webkit-slider-thumb {
	-webkit-appearance: none;
}
</style>
