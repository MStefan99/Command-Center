<template lang="pug">
div#container
	label Acceleration X
	meter(min="-1200" max="1200" :value="aircraft.accX ?? 0")
	label Acceleration Y
	meter(min="-1200" max="1200" :value="aircraft.accY ?? 0")
	label Acceleration Z
	meter(min="-1200" max="1200" :value="aircraft.accZ ?? 0")
</template>


<style scoped lang="stylus">
#container
	display flex
	flex-flow column
	padding 2em

	meter
		padding-bottom 1em
		height 3em
		width 40em
		transition value .2s
</style>


<script>
import store from '../js/store.js';

export default {
	name: 'HUD',
	data() {
		return {
			aircraft: store.aircraft
		};
	}
};
</script>
