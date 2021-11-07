<template lang="pug">
nav#title-bar
	a#home-link(href='/') Command Center
	label#device-status(for="device-toggle" :class='{connected: sharedState.devices.length}')
		| {{sharedState.devices.length? 'Connected' : 'Not connected'}}
	input#device-toggle.hidden(type="checkbox" v-model="deviceSelectorShown")
	DeviceSelector(v-show="deviceSelectorShown")
</template>


<style scoped lang="stylus">
@require "../style/colors.styl"

#title-bar #home-link
	font-size 2em
	font-weight bold

	@media screen and (max-width 768px)
		font-size 1.5em

#device-status
	font-weight bold
	cursor pointer
	margin-left auto
	user-select none
	color lighten(color-gray, 50%)

	&.error
		color color-red

	&.warning
		color color-orange

	&.connected
		color color-green

#device-temp
	margin-left 1em
</style>


<script>
import store from '../js/store.js';
import DeviceSelector from './DeviceSelector.vue';


let pollHandle;

export default {
	name: 'NavBar',
	components: {DeviceSelector},
	data() {
		return {
			deviceSelectorShown: false,
			sharedState: store
		};
	}
};
</script>
