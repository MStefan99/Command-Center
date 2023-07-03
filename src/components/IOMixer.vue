<template lang="pug">
.iomixer
	datalist#stops
		option(value="-1")
		option(value="-0.5")
		option(value="0")
		option(value="0.5")
		option(value="1")
	.m-4
		h2.mb-4.text-xl.font-bold Channel mixer
		table
			tbody
				tr
					td(v-for="(input, i) in inputs" :key="i")
						RangeSlider(type="range" listID="stops" v-model="inputs[i]")
		.text *
		.flex.flex-row.items-stretch
			table
				tbody
					tr(v-for="(row, j) in mixes" :key="j")
						td(v-for="(value, i) in row" :key="i")
							RangeSlider(
								type="range"
								listID="stops"
								v-model="mixes[j][i]"
								@change="activeDevice.write(DescriptorType.Mux, new ChannelDescriptor({values: mixes.flat()}))")
			.text +
			table
				tbody
					tr(v-for="(trim, i) in trims" :key="i")
						td
							RangeSlider(
								type="range"
								listID="stops"
								v-model="trims[i]"
								@change="activeDevice.write(DescriptorType.Trims, new ChannelDescriptor({values: trims}))")
			.text =
			table
				tbody
					tr(v-for="(output, i) in outputs" :key="i")
						td
							RangeSlider(type="range" listID="stops" v-model="outputs[i]" disabled)
</template>

<script setup lang="ts">
import RangeSlider from './RangeSlider.vue';
import {computed, onMounted, ref} from 'vue';
import {activeDevice} from '../scripts/driver';
import {ChannelDescriptor, DescriptorType} from '../scripts/types';

const clamp = (val: number, min: number, max: number): number =>
	val < min ? min : val > max ? max : val;

const inputs = ref<number[]>([]);
const mixes = ref<number[][]>([]);
const trims = ref<number[]>([]);

const outputs = computed(() => {
	const h = mixes.value.length;
	const w = inputs.value.length;

	const result = new Array(h);

	for (let j = 0; j < h; ++j) {
		for (let i = 0; i < w; ++i) {
			let sum = 0;

			for (let k = 0; k < w; ++k) {
				sum += inputs.value[k] * mixes.value[j][k];
			}
			result[j] = clamp(sum + trims.value[j], -1.5, 1.5);
		}
	}
	return result;
});

onMounted(() => {
	if (!activeDevice.value) {
		return;
	}

	activeDevice.value
		.read(DescriptorType.Inputs)
		.then((r) => {
			inputs.value = (r as ChannelDescriptor).data.values;
		})
		.then(() => activeDevice.value.read(DescriptorType.Mux))
		.then((r) => {
			const values = (r as ChannelDescriptor).data.values;
			const mux = [];

			while (values.length) {
				mux.push(values.splice(0, inputs.value.length));
			}
			mixes.value = mux;
		})
		.then(() => activeDevice.value.read(DescriptorType.Trims))
		.then((r) => {
			trims.value = (r as ChannelDescriptor).data.values;
		});
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
