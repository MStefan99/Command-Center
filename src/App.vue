<template lang="pug">
NavBar
Dashboard
</template>


<script>
import NavBar from './components/NavBar.vue';
import Dashboard from './components/Dashboard.vue';


export default {
	name: 'App',
	components: {
		Dashboard,
		NavBar
	}
};
</script>
