'use strict';

import {reactive} from 'vue';
import * as usbDriver from '../js/driver.js';


const store = reactive({
	usbDriver: usbDriver,
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
