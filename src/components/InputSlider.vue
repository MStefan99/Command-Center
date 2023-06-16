<template lang="pug">
.slider
	datalist(:id="'stops-' + idString" v-if="list")
		option(
			v-for="stop in list"
			:key="stop"
			:value="stop"
			@change="$emit('update:modelValue', value)")
	.bar
		input(
			type="range"
			:list="list ? 'stops-' + idString : listID"
			:class="vertical && 'vertical'"
			v-model="value"
			:min="min"
			:max="max")
		.track
		.value {{value}}
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';

const props = defineProps<{
	modelValue: number;
	vertical?: boolean;
	min?: number;
	max?: number;
	list?: number[];
	listID?: string;
}>();
defineEmits<{(e: 'update:modelValue', value: number): void}>();

const value = ref<number>(props.modelValue ?? 0);
const percentage = computed(() => (value.value - props.min) / (props.max - props.min));

const id = new Uint8Array(4);
crypto.getRandomValues(id);
const idString = Array.from(id, (byte) => byte.toString(16).padStart(2, '0')).join('');
</script>

<style scoped>
.bar {
	position: relative;
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
	height: 50px;
	width: 5ch;
	-webkit-appearance: slider-vertical;
	opacity: 0;
	transition: height 0.5s ease;
}

.bar input[type='range']:focus {
	height: 200px;
}

.track {
	border-radius: 4px;
	position: absolute;
	pointer-events: none;
	left: 0;
	bottom: 8px;
	height: max(8px, calc((100% - 16px) * v-bind(percentage)));
	width: 5ch;
	background-color: var(--color-accent);
}

.value {
	position: absolute;
	pointer-events: none;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

input[type='range']::-webkit-slider-thumb {
	-webkit-appearance: none;
}
</style>
