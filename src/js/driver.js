'use strict';


import store from './store.js';


const devices = [];

const commands = new Map();
commands.set(0x1, (data) => {
	store.aircraft.accX = data.getInt16(2, true);
	store.aircraft.accY = data.getInt16(4, true);
	store.aircraft.accZ = data.getInt16(6, true);
});


export function connectDevice(device) {
	return new Promise((resolve, reject) => {
		if (devices.some(d => d._device.productId === device.productId)) {
			alert('Looks like this device is already connected!');
			reject();
		}

		return device.open()
			.then(() => device.selectConfiguration(1))
			.then(() => device.claimInterface(0))
			.then(() => {
				devices.push({
					_device: device,
					type: device.productId !== 0x000a? 'controller' : 'receiver'
				});

				setInterval(() => {
					device.transferIn(1, 8)
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
				}, 20);
			})
			.catch(err => reject(err));
	});
}


export function disconnectDevice(device) {
	if (!device.productId) {
		this.devices = this.devices.filter(d => d !== device);
	} else {
		this.devices = this.devices.filter(d => d._device !== device);
	}
	if (device.opened) {
		device.close();
	}
}


export function connectedDevices() {
	return devices;
}


navigator.usb.addEventListener('disconnect', event => {
	disconnectDevice(event.device);
	alert('USB connection lost! Please check your connection!');
});
