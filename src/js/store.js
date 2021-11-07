'use strict';

const store = {
	devices: [],
	addDevice: function (device) {
		this.devices.push(device);
	},
	removeDevice: function (device) {
		this.devices = this.devices.filter(d => d !== device);
	}
};


export default store;
