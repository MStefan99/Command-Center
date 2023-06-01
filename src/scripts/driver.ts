'use strict';

import {reactive} from 'vue';
import {TemperatureEvent} from './types';
import {parseData} from './parser';

export const connectedDevices = reactive<Device[]>([]);
export const deviceEventEmitter = new EventTarget();

function buf2hex(buffer: ArrayBuffer): string {
	return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join(' ');
}

export class Device {
	usbDevice: USBDevice;
	_pollHandle: number | null;

	constructor(usbDevice: USBDevice) {
		this.usbDevice = usbDevice;
		this.#poll();
	}

	get deviceVersion(): string {
		return (
			this.usbDevice.deviceVersionMajor +
			'.' +
			this.usbDevice.deviceVersionMinor +
			'.' +
			this.usbDevice.deviceVersionSubminor
		);
	}

	get usbVersion(): string {
		return (
			this.usbDevice.usbVersionMajor +
			'.' +
			this.usbDevice.usbVersionMinor +
			'.' +
			this.usbDevice.usbVersionSubminor
		);
	}

	#poll(): void {
		if (!this.usbDevice.opened) {
			this.disconnect();
			return;
		}

		this.usbDevice
			.transferIn(1, 8)
			.then((result: USBInTransferResult) => {
				this._pollHandle = setTimeout(() => this.#poll());

				if (!result.data.byteLength) {
					return;
				}

				const event = parseData(result.data);
				event && deviceEventEmitter.dispatchEvent(event);
			})
			.catch((err) => {
				console.warn(err);
				if (connectedDevices.includes(this)) {
					alert('Warning! ' + this.usbDevice.productName + ' was disconnected!');
					this.disconnect();
				}
			});
	}

	disconnect(): void {
		const idx = connectedDevices.findIndex((d) => d.usbDevice === this.usbDevice);
		if (idx > -1) {
			connectedDevices.splice(idx, 1);
		}
		clearTimeout(this._pollHandle);
		if (this.usbDevice.opened) {
			this.usbDevice.close();
		}
	}
}

export function connectDevice(): Promise<Device | null> {
	return navigator.usb
		.requestDevice({
			filters: [
				{vendorId: 0x0424} // TODO: add product ID(s)
			]
		})
		.then((usbDevice) => {
			return new Promise((resolve, reject) => {
				if (connectedDevices.some((d) => d.usbDevice === usbDevice)) {
					alert('Looks like this device is already connected!');
					reject();
					return null;
				}

				return usbDevice
					.open()
					.then(() => usbDevice.selectConfiguration(1))
					.then(() => usbDevice.claimInterface(0))
					.then(() => {
						const device = new Device(usbDevice);
						connectedDevices.push(device);
						return device;
					})
					.catch((err) => reject(err));
			});
		});
}
