'use strict';

const store = {
	devices: [],
	applicationState: {
		deviceSelectorOpen: false,
		viewedDevice: null
	},
	addDevice(device) {
		this.devices.push(device);
	},
	removeDevice(device) {
		this.devices = this.devices.filter(d => d !== device);
	},
	viewDevice(device) {
		this.applicationState.viewedDevice = device;
	},
	stopViewingDevice() {
		this.applicationState.viewedDevice = null;
	}
};


export default store;
