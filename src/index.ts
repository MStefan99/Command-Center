'use strict';

import './assets/style.css';

import {createApp} from 'vue';
import App from './App.vue';

import router from './scripts/routes';

createApp(App).use(router).mount('#app');
