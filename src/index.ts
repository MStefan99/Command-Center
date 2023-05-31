'use strict';

import './assets/style.styl';

import {createApp} from 'vue';
import App from './App.vue';

if (localStorage.getItem('intro-viewed')) {
	createApp(App).mount('#app');
} else {
	window.location.href = '/intro/';
}
