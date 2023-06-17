<template lang="pug">
.iomixer
	datalist#stops
		option(value="-1000")
		option(value="-500")
		option(value="0")
		option(value="500")
		option(value="1000")
	table
		tbody
			tr
				td(v-for="(input, i) in inputs" :key="i")
					RangeSlider(type="range" listID="stops" v-model="inputs[i]")
	.text *
	.flex.flex-row.items-stretch
		table
			tbody
				tr(v-for="(row, i) in mixes" :key="i")
					td(v-for="(value, j) in row" :key="j")
						RangeSlider(type="range" listID="stops" v-model="mixes[i][j]")
		.text +
		table
			tbody
				tr(v-for="(trim, i) in trims" :key="i")
					td
						RangeSlider(type="range" listID="stops" v-model="trims[i]")
		.text =
		table
			tbody
				tr(v-for="(output, i) in outputs" :key="i")
					td
						RangeSlider(type="range" listID="stops" v-model="outputs[i]" disabled)
</template>

<script setup lang="ts">
import RangeSlider from './RangeSlider.vue';
import {computed, ref} from 'vue';

const inputNumber = 8;
const outputNumber = 8;

const clamp = (val: number, min: number, max: number): number =>
	val < min ? min : val > max ? max : val;

const inputs = ref<number[]>(new Array<number>(inputNumber).fill(0));
const mixes = ref<number[][]>(
	Array.from({length: outputNumber}, () => new Array<number>(inputNumber).fill(0))
);
const trims = ref<number[]>(new Array<number>(outputNumber).fill(0));
const outputs = computed(() => {
	const result = new Array(outputNumber);

	for (let j = 0; j < inputNumber; ++j) {
		for (let i = 0; i < outputNumber; ++i) {
			let sum = 0;

			for (let k = 0; k < inputNumber; ++k) {
				sum += (inputs.value[k] * mixes.value[k][j]) / 1000;
			}
			result[j] = clamp(sum + trims.value[j], -1500, 1500);
		}
	}
	return result;
});
</script>

<style scoped>
.text {
	@apply m-2;

	align-self: center;
	font-size: 3em;
	font-weight: bold;
}
</style>
