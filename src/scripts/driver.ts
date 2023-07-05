'use strict';

import {reactive, ref} from 'vue';
import {
	ChannelDescriptor,
	DEG_TO_RAD,
	DescriptorData,
	DescriptorType,
	ModelEvent,
	SettingsDescriptor,
	StatusDescriptor
} from './types';
import {alert, PopupColor} from './popups';

export const connectedDevices = reactive<Device[]>([]);
export const activeDevice = ref<Device | null>(null);

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

export abstract class Device extends EventTarget {
	id: number = Math.floor(Math.random() * 0xffffffff);

	abstract get deviceVersion(): string;

	abstract get usbVersion(): string;

	abstract get manufacturerName(): string;

	abstract get productName(): string;

	abstract get productID(): number;

	abstract is(device: Device): boolean;

	abstract read(type: DescriptorType): Promise<DescriptorData>;

	abstract write(type: DescriptorType, data: DescriptorData): Promise<void>;

	disconnect(): void {
		const idx = connectedDevices.findIndex((d) => this.is(d));
		if (idx > -1) {
			const device = connectedDevices[idx];
			connectedDevices.splice(idx, 1);

			if (activeDevice.value === device) {
				activeDevice.value = connectedDevices[0] ?? null;
			}
		}
	}
}

export class DemoDevice extends Device {
	_temperature: number = 15;
	_roll: number = 0;
	_pitch: number = 0;
	_targets: {
		roll: number;
		pitch: number;
	} = {
		roll: 0,
		pitch: 0
	};
	_speeds: {
		roll: number;
		pitch: number;
	} = {
		roll: 0,
		pitch: 0
	};
	_mixes: number[][] = [
		[-1, 1, 1, 1],
		[1, 1, 1, -1],
		[1, -1, 1, 1],
		[-1, -1, 1, -1]
	];
	_trims: number[] = new Array(this._mixes.length).fill(0);
	_updateInterval: number;
	_lastUpdate: number = Date.now();

	constructor() {
		super();

		this._updateInterval = setInterval(() => {
			const now = Date.now();
			const dt = Date.now() - this._lastUpdate;
			this._lastUpdate = now;

			const dr = (this._targets.roll - this._roll) * this._speeds.roll;
			const dp = (this._targets.pitch - this._pitch) * this._speeds.pitch;
			this._roll += dr * dt;
			this._pitch += dp * dt;
			this._temperature += Math.random() - 0.5 + (45 - this._temperature) / (dt * 10);

			if (Math.abs(dr) < 0.01) {
				this._targets.roll = Math.random() * 90 - 45;
				this._speeds.roll = Math.random() / 200;
			}

			if (Math.abs(dp) < 0.01) {
				this._targets.pitch = Math.random() * 90 - 45;
				this._speeds.pitch = Math.random() / 200;
			}

			const accY = Math.sin(this._pitch * DEG_TO_RAD);
			const accX = Math.sqrt(1 - Math.pow(accY, 2)) * Math.sin(this._roll * DEG_TO_RAD);

			const data = new StatusDescriptor({
				temperature: this._temperature,
				acceleration: [accX, accY, Math.sqrt(1 - Math.pow(accX, 2) - Math.pow(accY, 2))],
				rotation: [dr * 1000, dp * 1000, 0],
				roll: this._roll,
				pitch: this._pitch
			});
			const modelEvent = new ModelEvent('data', data, dt);
			this.dispatchEvent(modelEvent);
		}, 30);
	}

	get deviceVersion(): string {
		return '1.0.0';
	}

	get usbVersion(): string {
		return '2.0';
	}

	get manufacturerName(): string {
		return 'Demo manufacturer';
	}

	get productName(): string {
		return 'Demo device';
	}

	get productID(): number {
		return 1;
	}

	is(device: DemoDevice): boolean {
		return this === device;
	}

	read(type: DescriptorType): Promise<DescriptorData> {
		switch (type) {
			case DescriptorType.Settings:
				return Promise.resolve(
					new SettingsDescriptor({
						inputChannelNumber: this._mixes[0].length,
						outputChannelNumber: this._mixes.length,
						activeSensors: 0
					})
				);
			case DescriptorType.Inputs:
				return Promise.resolve(
					new ChannelDescriptor({values: new Array(this._mixes[0].length).fill(0)})
				);
			case DescriptorType.Mux:
				return Promise.resolve(new ChannelDescriptor({values: this._mixes.flat()}));
			case DescriptorType.Trims:
				return Promise.resolve(new ChannelDescriptor({values: this._trims}));
		}
	}

	write(type: DescriptorType, data: DescriptorData): Promise<void> {
		switch (type) {
			case DescriptorType.Mux:
				{
					const values = (data as ChannelDescriptor).data.values;
					const mux = [];

					while (values.length) {
						mux.push(values.splice(0, this._mixes[0].length));
					}
					this._mixes = mux;
				}
				break;
			case DescriptorType.Trims:
				this._trims = (data as ChannelDescriptor).data.values;
		}
		return Promise.resolve();
	}

	override disconnect(): void {
		super.disconnect();
		clearInterval(this._updateInterval);
	}
}

export class PhysicalDevice extends Device {
	_usbDevice: USBDevice;
	_transferPromise: Promise<unknown> = Promise.resolve();
	_pollHandle: number | null;

	constructor(usbDevice: USBDevice) {
		super();
		this._usbDevice = usbDevice;
		lastPollTime = Date.now();
		this.#poll();
	}

	get deviceVersion(): string {
		return (
			this._usbDevice.deviceVersionMajor +
			'.' +
			this._usbDevice.deviceVersionMinor +
			'.' +
			this._usbDevice.deviceVersionSubminor
		);
	}

	get usbVersion(): string {
		return (
			this._usbDevice.usbVersionMajor +
			'.' +
			this._usbDevice.usbVersionMinor +
			'.' +
			this._usbDevice.usbVersionSubminor
		);
	}

	get manufacturerName(): string {
		return this._usbDevice.manufacturerName;
	}

	get productName(): string {
		return this._usbDevice.productName;
	}

	get productID(): number {
		return this._usbDevice.productId;
	}

	is(device: PhysicalDevice): boolean {
		return this._usbDevice === device._usbDevice;
	}

	read(type: DescriptorType): Promise<DescriptorData> {
		return new Promise<DescriptorData>((resolve) => {
			const data = new Uint8Array([
				0x00, // Read descriptor
				type // Descriptor type
			]);

			this._transferPromise = this._transferPromise
				.then(() => this._usbDevice.transferOut(1, data))
				.then(() => this._usbDevice.transferIn(1, 0xff))
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
				.then(() => this._usbDevice.transferOut(1, d))
				.then(() => resolve());
		});
	}

	#poll(): void {
		if (!this._usbDevice.opened) {
			this.disconnect();
			return;
		}

		this._transferPromise = this._transferPromise
			.then(() => this._usbDevice.transferIn(1, 0xff))
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
				this.dispatchEvent(modelEvent);

				lastPollTime = now;
			})
			.catch((err) => {
				console.warn(err);
				if (connectedDevices.includes(this)) {
					alert(
						this._usbDevice.productName + ' disconnected!',
						PopupColor.Red,
						'Connection was lost to the device'
					);
					this.disconnect();
				}
			});
	}

	override disconnect(): void {
		super.disconnect();

		clearTimeout(this._pollHandle);
		if (this._usbDevice.opened) {
			this._usbDevice.close();
		}
	}
}

export function connectDevice(demo?: true): Promise<Device | null> {
	if (demo) {
		const device = new DemoDevice();
		connectedDevices.push(device);
		activeDevice.value = device;

		return Promise.resolve(device);
	}

	return navigator.usb
		.requestDevice({
			filters: [
				{vendorId: 0x0424} // TODO: add product ID(s)
			]
		})
		.then((usbDevice) => {
			return new Promise((resolve, reject) => {
				if (connectedDevices.some((d) => (d as PhysicalDevice)?._usbDevice === usbDevice)) {
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
						const device = new PhysicalDevice(usbDevice);
						connectedDevices.push(device);
						activeDevice.value = device;
						return device;
					})
					.catch((err) => reject(err));
			});
		});
}
