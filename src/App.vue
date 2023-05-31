<template lang="pug">
NavBar
HUD
transition(name="popup")
	DeviceSelector(
		@deviceInfo="(device) => this.sharedState.viewDevice(device)"
		v-if="this.sharedState.applicationState.deviceSelectorOpen")
transition(name="popup")
	DeviceViewer(v-if="sharedState.applicationState.viewedDevice")
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import HUD from './components/HUD.vue';
import DeviceSelector from './components/DeviceSelector.vue';
import DeviceViewer from './components/DeviceViewer.vue';
</script>
