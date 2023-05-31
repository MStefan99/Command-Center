'use strict';

import {reactive} from 'vue';

const devices = reactive([]);

function buf2hex(buffer: ArrayBuffer): string {
	return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join(' ');
}

// const factor = 360 / 16384 / Math.PI;

export class Device {
	#usb: USBDevice;
	#pollHandle: number | null;

	get name(): string {
		return this.#usb.productName;
	}

	constructor(usbDevice: USBDevice) {
		this.#usb = usbDevice;
		this.#poll();
	}

	#poll(): void {
		if (!this.#usb.opened) {
			this.disconnect();
			alert('Warning! ' + this.#usb.productName + ' was disconnected!');
			return;
		}

		this.#usb
			.transferIn(1, 8)
			.then((result: USBInTransferResult) => {
				this.#pollHandle = setTimeout(() => this.#poll(), 15);

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
				this.disconnect();
				alert('Warning! ' + this.#usb.productName + ' was disconnected!');
			});
	}

	disconnect(): void {
		const idx = devices.findIndex((d) => d._usb.productId === this.#usb.productId);
		if (idx > -1) {
			devices.splice(idx, 1);
		}
		if (this.#usb.opened) {
			this.#usb.close();
		}
	}
}

export function connectDevice(usbDevice: USBDevice): Promise<Device> {
	return new Promise((resolve, reject) => {
		if (devices.some((d) => d._usb.productId === usbDevice.productId)) {
			alert('Looks like this device is already connected!');
			reject();
		}

		return usbDevice
			.open()
			.then(() => usbDevice.selectConfiguration(1))
			.then(() => usbDevice.claimInterface(0))
			.then(() => {
				const device = new Device(usbDevice);
				devices.push(device);
				return device;
			})
			.catch((err) => reject(err));
	});
}

export function connectedDevices(): Device[] {
	return devices;
}
