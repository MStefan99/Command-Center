<template lang="pug">
.iomixer
	datalist#stops
		option(value="-1000")
		option(value="-500")
		option(value="0")
		option(value="500")
		option(value="1000")
	table
		thead
			tr(v-for="i in inputNumber + 1" :key="i")
				th(v-for="j in inputNumber + 1" :key="j")
					InputSlider(type="range" listID="stops" :modelValue="i === j ? 1000 : 0")
</template>

<script setup lang="ts">
import InputSlider from './InputSlider.vue';

const inputNumber = 8;
const outputNumber = 8;
</script>

<style scoped></style>
