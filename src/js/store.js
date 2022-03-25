'use strict';

import {reactive} from 'vue';


const store = reactive({
	devices: [],
	applicationState: {
		deviceSelectorOpen: false,
		viewedDevice: null
	},
	aircraft: {},
	viewDevice(device) {
		this.applicationState.viewedDevice = device;
	},
	stopViewingDevice() {
		this.applicationState.viewedDevice = null;
	}
});


export default store;
