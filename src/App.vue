<template lang="pug">
NavBar
HUD
transition(name="popup")
	DeviceSelector(@deviceInfo="device => this.sharedState.viewDevice(device)"
		v-if="this.sharedState.applicationState.deviceSelectorOpen")
transition(name="popup")
	DeviceViewer(v-if="sharedState.applicationState.viewedDevice")
</template>


<script>
import store from './js/store.js';

import NavBar from './components/NavBar.vue';
import HUD from './components/HUD.vue';
import DeviceSelector from './components/DeviceSelector.vue';
import DeviceViewer from './components/DeviceViewer.vue';


export default {
	name: 'App',
	data() {
		return {
			sharedState: store
		}
	},
	components: {
		NavBar,
		HUD,
		DeviceSelector,
		DeviceViewer
	}
};
</script>
