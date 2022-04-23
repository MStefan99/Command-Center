'use strict';


import {reactive} from 'vue';
import store from './store.js';


export const devices = reactive([]);


function buf2hex(buffer) {
	return [...new Uint8Array(buffer)]
		.map(x => x.toString(16).padStart(2, '0'))
		.join(' ');
}


const factor = 360 / 16384 / Math.PI;


const commands = new Map([
	[1, (data) => {
		store.aircraft.roll = data.getInt16(2, true) * factor;
		store.aircraft.pitch = data.getInt16(4, true) * factor;
	}]
]);


function poll(device) {
	if (!device._usb.opened) {
		disconnectDevice(device);
		alert('Warning! ' + device._usb.productName + ' was disconnected!');
		return;
	}

	device._usb.transferIn(1, 8)
		.then(result => {
			device._pollHandle = setTimeout(() => poll(device), 15);

			if (result.data.byteLength < 8) {
				return;
			}
			// console.log(buf2hex(result.data.buffer));
			const commandCode = result.data.getUint8(1);
			const fn = commands.get(commandCode);
			if (!fn) {
				return;
			}
			fn(result.data);
		})
		.catch(err => {
			console.warn(err);
			disconnectDevice(device);
			alert('Warning! ' + device._usb.productName + ' was disconnected!');
		});
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
	const idx = devices.findIndex(d => d._usb.productId === device._usb.productId);
	if (idx > -1) {
		devices.splice(idx, 1);
	}
	if (device._usb.opened) {
		device._usb.close();
	}
}


export function connectedDevices() {
	return devices;
}
