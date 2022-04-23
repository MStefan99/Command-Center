<template lang="pug">
div#container
	AttitudeIndicator#attitude-indicator(:roll="aircraft.roll ?? 0", :pitch="aircraft.pitch ?? 0")
	div.d-flex
		label Roll
		span.ml-3 {{Math.round(aircraft.roll)}}°
	meter(min="-90" max="90" :value="aircraft.roll ?? 0")
	div.d-flex
		label Pitch
		span.ml-3 {{Math.round(aircraft.pitch)}}°
	meter(min="-90" max="90" :value="aircraft.pitch ?? 0")
</template>


<style scoped lang="stylus">
@require "../style/stylify.styl"

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


<script>
import store from '../js/store.js';
import AttitudeIndicator from './AttitudeIndicator.vue';

export default {
	name: 'HUD',
	components: {
		AttitudeIndicator
	},
	data() {
		return {
			aircraft: store.aircraft
		};
	}
};
</script>
