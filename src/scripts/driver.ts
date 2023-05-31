'use strict';

import {reactive} from 'vue';

export const devices = reactive([]);

function buf2hex(buffer: ArrayBuffer): string {
	return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join(' ');
}

type Device = {
	_usb: USBDevice;
	_pollHandle: number | null;
	type: string;
};

// const factor = 360 / 16384 / Math.PI;

function poll(device: Device): void {
	if (!device._usb.opened) {
		disconnectDevice(device);
		alert('Warning! ' + device._usb.productName + ' was disconnected!');
		return;
	}

	device._usb
		.transferIn(1, 8)
		.then((result: USBInTransferResult) => {
			device._pollHandle = setTimeout(() => poll(device), 15);

			if (result.data.byteLength < 8) {
				return;
			}
			// console.log(buf2hex(result.data.buffer));
			// const commandCode = result.data.getUint8(1);
			// const fn = commands.get(commandCode);
			// if (!fn) {
			// 	return;
			// }
			// fn(result.data);
		})
		.catch((err) => {
			console.warn(err);
			disconnectDevice(device);
			alert('Warning! ' + device._usb.productName + ' was disconnected!');
		});
}

export function connectDevice(device: USBDevice): Promise<void> {
	return new Promise((resolve, reject) => {
		if (devices.some((d) => d._usb.productId === device.productId)) {
			alert('Looks like this device is already connected!');
			reject();
		}

		return device
			.open()
			.then(() => device.selectConfiguration(1))
			.then(() => device.claimInterface(0))
			.then(() => {
				const vDev: Device = {
					_usb: device,
					_pollHandle: null,
					type: device.productId !== 0x000a ? 'controller' : 'receiver'
				};

				poll(vDev);
				devices.push(vDev);
			})
			.catch((err) => reject(err));
	});
}

export function disconnectDevice(device: Device): void {
	const idx = devices.findIndex((d) => d._usb.productId === device._usb.productId);
	if (idx > -1) {
		devices.splice(idx, 1);
	}
	if (device._usb.opened) {
		device._usb.close();
	}
}

export function connectedDevices(): unknown[] {
	return devices;
}
