<template lang="pug">
nav
	a#home-link(href="/") Command Center
	span#device-status(class={connected: device}) {{device? 'Connected' : 'Not connected'}}
</template>


<script>
export default {
	data() {
		return {
			device: {
				deviceType: 'transceiver',
				deviceID: 1
			}
		};
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
	color white
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

		&.connected
			color #00f090
</style>
