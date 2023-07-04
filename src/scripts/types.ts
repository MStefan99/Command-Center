const accLSB = 0.122 / 1000;
const rotLSB = 8.75 / 1000;
const attLSB = 1 / 20860;
export const RAD_TO_DEG = 180 / Math.PI;
export const DEG_TO_RAD = Math.PI / 180;

export enum DescriptorType {
	Status = 0x00,
	Settings = 0x01,
	Inputs = 0x02,
	Mux = 0x03,
	Trims = 0x04,
	Outputs = 0x05
}

export type ParsedDescriptor = {
	type: DescriptorType;
	data: DescriptorData;
};

export type ModelEventDetail = {
	descriptor: DescriptorData;
	dt: number;
};

export class ModelEvent extends CustomEvent<ModelEventDetail> {
	constructor(name: string, descriptor: DescriptorData, dt: number) {
		super(name, {detail: {descriptor, dt}});
	}
}

export class DescriptorData {
	view: DataView;

	constructor() {
		// Nothing to do
	}

	get data(): object {
		return {};
	}
}

export class StatusDescriptor extends DescriptorData {
	constructor(
		data:
			| {
					temperature: number;
					acceleration: number[];
					rotation: number[];
					roll: number;
					pitch: number;
			  }
			| DataView
	) {
		super();
		if (data instanceof DataView) {
			this.view = data;
			return;
		}

		const buffer = new ArrayBuffer(18);
		this.view = new DataView(buffer);

		this.view.setInt8(0, data.temperature);
		for (let i = 0; i < 3; ++i) {
			this.view.setInt16(2 + i * Int16Array.BYTES_PER_ELEMENT, data.acceleration[i] / accLSB, true);
			this.view.setInt16(8 + i * Int16Array.BYTES_PER_ELEMENT, data.rotation[i] / rotLSB, true);
		}
		this.view.setInt16(14, (data.roll / attLSB) * DEG_TO_RAD, true);
		this.view.setInt16(16, (data.pitch / attLSB) * DEG_TO_RAD, true);
	}

	override get data(): {
		temperature: number;
		acceleration: number[];
		rotation: number[];
		roll: number;
		pitch: number;
	} {
		return {
			temperature: this.view.getInt8(this.view.byteOffset),
			acceleration: new Array(3)
				.fill(0)
				.map(
					(val, i) =>
						this.view.getInt16(this.view.byteOffset + 2 + i * Int16Array.BYTES_PER_ELEMENT, true) *
						accLSB
				),
			rotation: new Array(3)
				.fill(0)
				.map(
					(val, i) =>
						this.view.getInt16(this.view.byteOffset + 8 + i * Int16Array.BYTES_PER_ELEMENT, true) *
						rotLSB
				),
			roll: this.view.getInt16(this.view.byteOffset + 14, true) * attLSB * RAD_TO_DEG,
			pitch: this.view.getInt16(this.view.byteOffset + 16, true) * attLSB * RAD_TO_DEG
		};
	}
}

export class SettingsDescriptor extends DescriptorData {
	constructor(
		data:
			| {inputChannelNumber: number; outputChannelNumber: number; activeSensors: number}
			| DataView
	) {
		super();
		if (data instanceof DataView) {
			this.view = data;
			return;
		}

		const buffer = new ArrayBuffer(3);
		this.view = new DataView(buffer);
		this.view.setUint8(0, data.inputChannelNumber);
		this.view.setUint8(1, data.outputChannelNumber);
		this.view.setUint8(2, data.activeSensors);
	}

	override get data(): {
		inputChannelNumber: number;
		outputChannelNumber: number;
		activeSensors: number;
	} {
		return {
			inputChannelNumber: this.view.getUint8(this.view.byteOffset),
			outputChannelNumber: this.view.getUint8(this.view.byteOffset + 1),
			activeSensors: this.view.getUint8(this.view.byteOffset + 2)
		};
	}
}

export class ArrayDescriptor extends DescriptorData {
	constructor(data: {values: number[]} | DataView) {
		super();
		if (data instanceof DataView) {
			this.view = data;
			return;
		}

		const buffer = new ArrayBuffer(data.values.length * Int16Array.BYTES_PER_ELEMENT);
		this.view = new DataView(buffer);
		for (let i = 0; i < data.values.length; ++i) {
			this.view.setInt16(i * Int16Array.BYTES_PER_ELEMENT, data.values[i], true);
		}
	}

	override get data(): {values: number[]} {
		return {
			values: new Array<number>(
				(this.view.byteLength - this.view.byteOffset) / Int16Array.BYTES_PER_ELEMENT
			)
				.fill(0)
				.map((val, i) =>
					this.view.getInt16(this.view.byteOffset + i * Int16Array.BYTES_PER_ELEMENT, true)
				)
		};
	}
}

export class ChannelDescriptor extends ArrayDescriptor {
	constructor(data: {values: number[]} | DataView) {
		if (data instanceof DataView) {
			super(data);
			return;
		}

		data.values = data.values.map((v) => v * 1024);
		super(data);
	}

	override get data(): {values: number[]} {
		return {values: super.data.values.map((v) => v / 1024)};
	}
}
