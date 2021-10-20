<template lang="pug">
nav#title-bar
	a#home-link(href='/') Command Center
	span#device-status(:class='{connected: device}' @click="connection") {{device? 'Connected' : 'Not connected'}}
</template>


<script>
export default {
	data() {
		return {
			device: null
		};
	},
	methods: {
		connection: function () {
			if (this.device) {
				if (confirm('Are you sure you want to disconnect?')) {
					this.device = null;
					// close usb device
				}
			} else {
				navigator.usb.requestDevice({filters: [{vendorId: 0x04D8}]}).then(d => this.device = d);
				// open usb device
			}
		}
	}
};
</script>


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
	color lighten(color-gray, 50%)

	&.error
		color color-error

	&.warning
		color color-warning

	&.connected
		color color-success
</style>
