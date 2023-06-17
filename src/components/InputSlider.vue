<template lang="pug">
.slider
	datalist(v-if="list" :id="'stops-' + idString")
		option(v-for="stop in list" :key="stop" :value="stop")
	.bar
		input(
			type="range"
			v-model="value"
			@change="$emit('update:modelValue', +value)"
			:list="list ? 'stops-' + idString : listID"
			:min="min"
			:max="max")
		.track
		.value.short {{(value / shortScalar ?? 1).toFixed(1)}}
		.value.long {{value}}
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue';

const props = withDefaults(
	defineProps<{
		modelValue: number;
		min?: number;
		max?: number;
		shortScalar?: number;
		list?: number[];
		listID?: string;
	}>(),
	{
		min: -1500,
		max: 1500,
		shortScalar: 1000
	}
);
defineEmits<{(e: 'update:modelValue', value: number): void}>();
watch(
	() => props.modelValue,
	() => (value.value = props.modelValue)
);

const value = ref<number>(props.modelValue ?? 0);
const percentage = computed(() => (value.value - props.min) / (props.max - props.min));

const id = new Uint8Array(4);
crypto.getRandomValues(id);
const idString = Array.from(id, (byte) => byte.toString(16).padStart(2, '0')).join('');
</script>

<style scoped>
.bar {
	position: relative;
	margin: -8px 0;
	--width: 3ch;
	--height: 50px;
}

.bar:not(:focus-within) .long,
.bar:focus-within .short {
	visibility: hidden;
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
	transition: height 0.5s ease, width 0.5s ease;
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
}

input[type='range']::-webkit-slider-thumb {
	-webkit-appearance: none;
}
</style>
