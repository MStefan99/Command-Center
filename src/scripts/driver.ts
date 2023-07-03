'use strict';

import {reactive, ref} from 'vue';
import {
	ChannelDescriptor,
	DescriptorData,
	DescriptorType,
	ModelEvent,
	SettingsDescriptor,
	StatusDescriptor
} from './types';
import {alert, PopupColor} from './popups';

export const connectedDevices = reactive<Device[]>([]);
export const activeDevice = ref<Device | null>(null);
export const deviceEventEmitter = new EventTarget();

function buf2hex(buffer: ArrayBuffer): string {
	return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join(' ');
}

let lastPollTime = 0;

function requestToDescriptor(data: DataView): DataView {
	const d: DataView = new DataView(data.buffer.slice(0));
	const type: DescriptorType = d.getUint8(1);

	d.setUint8(0, d.byteLength);
	d.setUint8(1, type);

	return d;
}

function parseData(data: DataView): DescriptorData {
	const type: DescriptorType = data.getUint8(1);

	return parsers[type](new DataView(data.buffer, 1, data.byteLength - 1));
}

const parsers: Record<DescriptorType, (data: DataView) => DescriptorData> = {
	[DescriptorType.Status]: (data) => new StatusDescriptor(data),
	[DescriptorType.Settings]: (data) => new SettingsDescriptor(data),
	[DescriptorType.Inputs]: (data) => new ChannelDescriptor(data),
	[DescriptorType.Mux]: (data) => new ChannelDescriptor(data),
	[DescriptorType.Trims]: (data) => new ChannelDescriptor(data),
	[DescriptorType.Outputs]: (data) => new ChannelDescriptor(data)
};

export class Device {
	usbDevice: USBDevice;
	_transferPromise: Promise<unknown> = Promise.resolve();
	_pollHandle: number | null;

	constructor(usbDevice: USBDevice) {
		this.usbDevice = usbDevice;
		lastPollTime = Date.now();
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

	read(type: DescriptorType): Promise<DescriptorData> {
		return new Promise<DescriptorData>((resolve) => {
			const data = new Uint8Array([
				0x00, // Read descriptor
				type // Descriptor type
			]);

			this._transferPromise = this._transferPromise
				.then(() => this.usbDevice.transferOut(1, data))
				.then(() => this.usbDevice.transferIn(1, 0xff))
				.then((r) => resolve(parseData(r.data)));
		});
	}

	write(type: DescriptorType, data: DescriptorData): Promise<void> {
		return new Promise<void>((resolve) => {
			const d = new Uint8Array(2 + data.view.byteLength);

			d.set([
				0x01, // Write descriptor
				type // Descriptor type
			]);
			d.set(new Uint8Array(data.view.buffer), 2);

			// console.log('write', d, parseData(requestToDescriptor(new DataView(d.buffer))));
			this._transferPromise = this._transferPromise
				.then(() => this.usbDevice.transferOut(1, d))
				.then(() => resolve());
		});
	}

	#poll(): void {
		if (!this.usbDevice.opened) {
			this.disconnect();
			return;
		}

		this._transferPromise = this._transferPromise
			.then(() => this.usbDevice.transferIn(1, 0xff))
			.then((result: USBInTransferResult) => {
				this._pollHandle = setTimeout(() => this.#poll(), 20);

				if (!result.data.byteLength) {
					return;
				}
				// console.log(
				// 	'Data from device,',
				// 	result.data.byteLength,
				// 	'bytes:',
				// 	buf2hex(result.data.buffer)
				// );

				const now = Date.now();
				const data = parseData(result.data);
				const modelEvent = new ModelEvent('data', data, now - lastPollTime);
				deviceEventEmitter.dispatchEvent(modelEvent);

				lastPollTime = now;
			})
			.catch((err) => {
				console.warn(err);
				if (connectedDevices.includes(this)) {
					alert(
						this.usbDevice.productName + ' disconnected!',
						PopupColor.Red,
						'Connection was lost to the device'
					);
					this.disconnect();
				}
			});
	}

	disconnect(): void {
		const idx = connectedDevices.findIndex((d) => d.usbDevice === this.usbDevice);
		if (idx > -1) {
			if (connectedDevices[idx] === activeDevice.value) {
				activeDevice.value = null;
			}
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
					alert(
						'This device is already connected',
						PopupColor.Red,
						'Please select another device to connect'
					);
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
						activeDevice.value = device;
						return device;
					})
					.catch((err) => reject(err));
			});
		});
}
