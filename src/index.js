'use strict';

import './style/style.styl';
import './style/uicons-bold-rounded.css';

import {createApp} from 'vue';
import App from './App.vue';


if (localStorage.getItem('intro-viewed')) {
	createApp(App).mount('#app');
} else {
	window.location.href = '/intro/';
}
