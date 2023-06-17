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
					InputSlider(type="range" listID="stops" v-model="inputs[i]")
	.text *
	.flex.flex-row.items-stretch
		table
			tbody
				tr(v-for="(row, i) in mixes" :key="i")
					td(v-for="(value, j) in row" :key="j")
						InputSlider(type="range" listID="stops" v-model="mixes[i][j]")
		.text +
		table
			tbody
				tr(v-for="(trim, i) in trims" :key="i")
					td
						InputSlider(type="range" listID="stops" v-model="trims[i]")
		.text =
		table
			tbody
				tr(v-for="(output, i) in outputs" :key="i")
					td
						InputSlider(type="range" listID="stops" v-model="outputs[i]")
</template>

<script setup lang="ts">
import InputSlider from './InputSlider.vue';
import {ref} from 'vue';

const inputNumber = 8;
const outputNumber = 8;

const inputs = ref<number[]>(new Array<number>(inputNumber).fill(0));
const mixes = ref<number[][]>(
	Array.from({length: outputNumber}, () => new Array<number>(inputNumber).fill(0))
);
const trims = ref<number[]>(new Array<number>(outputNumber).fill(0));
const outputs = ref<number[]>(new Array<number>(outputNumber).fill(0));
</script>

<style scoped>
.text {
	@apply m-2;

	align-self: center;
	font-size: 3em;
	font-weight: bold;
}
</style>
