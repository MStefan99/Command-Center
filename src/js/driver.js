'use strict';


import {reactive} from 'vue';
import store from './store.js';


export const devices = reactive([]);


const commands = new Map();
commands.set(0x1, (data) => {
	store.aircraft.accX = data.getInt16(2, true);
	store.aircraft.accY = data.getInt16(4, true);
	store.aircraft.accZ = data.getInt16(6, true);
});


function poll(device) {
	device._usb.transferIn(1, 8)
		.then(result => {
			if (result.data.byteLength < 8) {
				return;
			}
			const commandCode = result.data.getUint8(1);
			const fn = commands.get(commandCode);
			if (!fn) {
				return;
			}
			fn(result.data);
		});

	device._pollHandle = setTimeout(() => poll(device), 35);
}


export function connectDevice(device) {
	return new Promise((resolve, reject) => {
		if (devices.some(d => d._usb.productId === device.productId)) {
			alert('Looks like this device is already connected!');
			reject();
		}

		return device.open()
			.then(() => device.selectConfiguration(1))
			.then(() => device.claimInterface(0))
			.then(() => {
				const vDev = {
					_usb: device,
					_pollHandle: null,
					type: device.productId !== 0x000a? 'controller' : 'receiver'
				};

				poll(vDev);
				devices.push(vDev);
			})
			.catch(err => reject(err));
	});
}


export function disconnectDevice(device) {
	devices.splice(devices.findIndex(d => d._usb === device), 1);
	if (device._pollHandle) {
		clearTimeout(device._pollHandle);
	}
	if (device._usb.opened) {
		device._usb.close();
	}
}


export function connectedDevices() {
	return devices;
}


navigator.usb.addEventListener('disconnect', event => {
	disconnectDevice({_usb: event.device});
	alert('USB connection lost! Please check your connection!');
});
