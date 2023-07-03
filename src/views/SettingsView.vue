<template lang="pug">
SideBar
	template(#sidebar)
		RouterLink(:to="{name: 'settings-monitor'}") Monitor
		RouterLink(:to="{name: 'settings-mixes'}") Mixes
	RouterView
</template>

<script setup lang="ts">
import SideBar from '../components/SideBar.vue';
</script>
