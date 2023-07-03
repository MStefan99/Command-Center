import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SettingsView from '../views/SettingsView.vue';
import ModelMonitor from '../components/ModelMonitor.vue';
import IOMixer from '../components/IOMixer.vue';

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
				component: ModelMonitor
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
	history: createWebHistory('/'),
	routes
});

export default router;
