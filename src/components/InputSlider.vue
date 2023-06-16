<template lang="pug">
.slider
	datalist(:id="'stops-' + idString")
		option(
			v-for="stop in list"
			:key="stop"
			:value="stop"
			@change="$emit('update:modelValue', value)")
	input(
		type="range"
		:list="list ? 'stops-' + idString : listID"
		:class="vertical && 'vertical'"
		v-model="value"
		min="-1500"
		max="1500")
	div {{value}}
</template>

<script setup lang="ts">
import {ref} from 'vue';

const props = defineProps<{
	modelValue: number;
	vertical?: boolean;
	list?: number[];
	listID?: string;
}>();
defineEmits<{(e: 'update:modelValue', value: number): void}>();

const value = ref<number>(props.modelValue ?? 0);

const id = new Uint8Array(4);
crypto.getRandomValues(id);
const idString = Array.from(id, (byte) => byte.toString(16).padStart(2, '0')).join('');
</script>

<style scoped>
.slider {
	min-width: 5ch;
}

input[type='range']:not(.vertical) {
	width: 50px;
	transition: width 0.4s ease;
}

.slider:not(:hover) input[type='range']:not(.vertical) {
	transition-delay: 0.4s;
}

.slider:hover input[type='range']:not(.vertical) {
	width: 200px;
}

input[type='range'].vertical {
	width: 30px;
	-webkit-appearance: slider-vertical;
}
</style>
