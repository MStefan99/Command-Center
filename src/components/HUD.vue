<template lang="pug">
div#container
	AttitudeIndicator#attitude-indicator(:roll="aircraft.accY ?? 0", :pitch="aircraft.accX ?? 0")
	label Acceleration X
	meter(min="-32768" max="32768" :value="aircraft.accX ?? 0")
	label Acceleration Y
	meter(min="-32768" max="32768" :value="aircraft.accY ?? 0")
	label Acceleration Z
	meter(min="-32768" max="32768" :value="aircraft.accZ ?? 0")
	label Rotation X
	meter(min="-32768" max="32768" :value="aircraft.rotX ?? 0")
	label Rotation Y
	meter(min="-32768" max="32768" :value="aircraft.rotY ?? 0")
	label Rotation Z
	meter(min="-32768" max="32768" :value="aircraft.rotZ ?? 0")
</template>


<style scoped lang="stylus">
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
