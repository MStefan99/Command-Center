'use strict';

import {reactive} from 'vue';


const store = reactive({
	devices: [],
	applicationState: {
		deviceSelectorOpen: false,
		viewedDevice: null
	},
	addDevice(device) {
		this.devices.push(device);
	},
	removeDevice(device) {
		if (!device.productId) {
			this.devices = this.devices.filter(d => d !== device);
		} else {
			this.devices = this.devices.filter(d => d.usbDevice !== device);
		}
	},
	viewDevice(device) {
		this.applicationState.viewedDevice = device;
	},
	stopViewingDevice() {
		this.applicationState.viewedDevice = null;
	}
});


export default store;
