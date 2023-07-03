'use strict';

import './assets/style.scss';

import {createApp} from 'vue';
import App from './App.vue';

import router from './scripts/routes';

createApp(App).use(router).mount('#app');
