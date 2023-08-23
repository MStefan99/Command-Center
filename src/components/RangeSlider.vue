<template lang="pug">
.slider
	datalist(v-if="list" :id="'stops-' + idString")
		option(v-for="stop in list" :key="stop" :value="stop")
	//- tabindex enables :focus-within in Safari
	.bar(tabindex="-1" :class="{vertical: vertical}")
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
		vertical?: boolean;
		min?: number;
		max?: number;
		step?: number;
		list?: number[];
		listID?: string;
	}>(),
	{
		vertical: true,
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

<style lang="scss" scoped>
.bar {
	position: relative;
	margin: auto -8px;
	transition: width 0.5s ease;
	--width: calc(4ch + 16px);
	--height: 1.2em;
	width: var(--width);
}

.bar:hover {
	--width: calc(6ch + 16px);
}

.bar:focus-within {
	--width: 200px;
	--height: 80px;
}

.bar:after {
	content: '';
	position: absolute;
	pointer-events: none;
	top: 0;
	bottom: 0;
	left: 8px;
	right: 8px;
	border: 1px solid var(--color-accent);
	border-radius: 4px;
}

.bar input[type='range'] {
	vertical-align: middle;
	height: var(--height);
	width: var(--width);
	opacity: 0;
	transition: height 0.5s ease;
}

.track {
	border-radius: 4px;
	position: absolute;
	pointer-events: none;
	left: 8px;
	bottom: 0;
	width: max(8px, calc((100% - 16px) * v-bind(percentage)));
	height: 100%;
	background-color: var(--color-accent);
	transition: height 0.5s ease;
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
