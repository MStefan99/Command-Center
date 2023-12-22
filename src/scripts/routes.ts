import {createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SettingsView from '../views/SettingsView.vue';
import DeviceMonitor from '../components/DeviceMonitor.vue';
import IOMixer from '../components/IOMixer.vue';
import {crashCourse} from './analytics';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'home',
		component: HomeView
	},
	{
		path: '/settings',
		name: 'settings',
		component: SettingsView,
		redirect: {name: 'settings-monitor'},
		children: [
			{
				path: '/settings/monitor',
				name: 'settings-monitor',
				component: DeviceMonitor
			},
			{
				path: '/settings/mixes',
				name: 'settings-mixes',
				component: IOMixer
			}
		]
	},
	{
		path: '/:pathname(.*)*',
		redirect: {
			name: 'home'
		}
	}
];

const router = createRouter({
	history: import.meta.env.VITE_ROUTER === 'hash' ? createWebHashHistory() : createWebHistory('/'),
	routes
});

router.afterEach(() => crashCourse.value?.sendHit());

export default router;
