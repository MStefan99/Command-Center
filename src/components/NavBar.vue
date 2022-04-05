<template lang="pug">
nav#title-bar
	a#home-link(href='/') Command Center
	label#device-status(for="device-toggle" :class='getConnectionMethod().class') {{getConnectionMethod().message}}
	input#device-toggle.hidden(type="checkbox" v-model="this.sharedState.applicationState.deviceSelectorOpen")
</template>


<style lang="stylus" scoped>
@require "../style/colors.styl"
@require "../style/stylify.styl"

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
		color color-yellow

	&.connected
		color color-green
</style>


<script>
import store from '../js/store.js';
import DeviceSelector from './DeviceSelector.vue';
import DeviceViewer from './DeviceViewer.vue';


export default {
	name: 'NavBar',
	components: {DeviceViewer, DeviceSelector},
	data() {
		return {
			sharedState: store
		};
	},
	methods: {
		getConnectionMethod() {
			if (this.sharedState.usbDriver.devices.some(d => d.type === 'controller')) {
				return {message: 'Direct connection', class: 'connected'};
			} else if (this.sharedState.usbDriver.devices.some(d => d.type === 'transceiver')) {
				// noinspection PointlessBooleanExpressionJS  // TODO: Check whether wireless link is established
				if (true) {
					return {message: 'Wireless connection', class: 'warning'};
				} else {
					// noinspection UnreachableCodeJS
					return {message: 'Wireless connection lost', class: 'error'};
				}
			} else {
				return {message: 'No connection'};
			}
		}
	}
};
</script>
