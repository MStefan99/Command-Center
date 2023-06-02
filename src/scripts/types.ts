export enum CommandDescriptorType {
	DataIN = 0
}

export enum MessageDescriptorType {
	Temperature = 0x00,
	Attitude = 0x01,
	Input = 0x02,
	Output = 0x03
}

export type ModelMessage = object;

export type TemperatureMessage = {
	temperature: number;
} & ModelMessage;

export type AttitudeMessage = {
	roll: number;
	pitch: number;
} & ModelMessage;

export type InputMessage = {
	channels: number[];
} & ModelMessage;

export type OutputMessage = {
	channels: number[];
} & ModelMessage;

export type ModelEventDetail = {
	messages: ModelMessage[];
	dt: number;
};

export class ModelEvent extends CustomEvent<ModelEventDetail> {
	constructor(name: string, messages: ModelMessage[], dt: number) {
		super(name, {detail: {messages, dt}});
	}
}
