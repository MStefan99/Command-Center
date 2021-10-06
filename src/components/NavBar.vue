<template lang="pug">
nav
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
nav
	display flex
	flex-flow row wrap
	justify-content space-between
	align-items center
	background-color #555
	color #fff
	padding .5em
	margin-bottom 1em

	a
		color inherit
		text-decoration none

		&#home-link
			font-size 2em
			font-weight bold

	#device-status
		font-weight bold
		cursor pointer
		color #f06070

		&.connected
			color #50f0b0
</style>
