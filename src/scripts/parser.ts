import {
	AttitudeMessage,
	CommandDescriptorType,
	InputMessage,
	MessageDescriptorType,
	ModelMessage,
	OutputMessage,
	TemperatureMessage
} from './types';

const commandParsers: Record<CommandDescriptorType, (data: DataView) => ModelMessage[]> = {
	[CommandDescriptorType.DataIN]: parseDataIN
};

const dataInParsers: Record<MessageDescriptorType, (data: DataView) => ModelMessage> = {
	[MessageDescriptorType.Temperature]: parseTemperature,
	[MessageDescriptorType.Attitude]: parseAttitude,
	[MessageDescriptorType.Input]: parseInput,
	[MessageDescriptorType.Output]: parseOutput
};

function parseTemperature(data: DataView): TemperatureMessage {
	return {temperature: data.getInt16(0, true)};
}

function parseAttitude(data: DataView): AttitudeMessage {
	return {roll: data.getInt16(0, true), pitch: data.getInt16(2, true)};
}

function parseInput(data: DataView): InputMessage {
	return {
		channels: Array.from(
			new Uint16Array(data.buffer, data.byteOffset, data.byteLength / Uint16Array.BYTES_PER_ELEMENT)
		)
	};
}

function parseOutput(data: DataView): OutputMessage {
	return {
		channels: Array.from(
			new Uint16Array(data.buffer, data.byteOffset, data.byteLength / Uint16Array.BYTES_PER_ELEMENT)
		)
	};
}

function parseDataIN(data: DataView): ModelMessage[] {
	const messages: ModelMessage[] = [];

	for (let i = 0; i < data.byteLength; ) {
		// Byte i contains the length of the message
		const len = data.getUint8(i);
		// Byte i + 1 contains the length of the message
		const type: MessageDescriptorType = data.getUint8(i + 1);

		messages.push(dataInParsers[type](new DataView(data.buffer, data.byteOffset + i + 2, len - 2)));
		i += len;
	}
	return messages;
}

export function parseData(data: DataView): ModelMessage[] {
	// Byte 0 contains the length of the entire descriptor
	const totalLength = data.getUint8(0);
	const messages: ModelMessage[] = [];

	for (let i = 0; i < totalLength; ) {
		// Byte 0 contains the length of the descriptor
		const len = data.getUint8(0);
		messages.push(
			// Byte i + 1 is the descriptor type and
			// byte i + 2 is the start of descriptor parameters
			...commandParsers[data.getUint8(i + 1) as CommandDescriptorType](
				new DataView(data.buffer, i + 2, len - 2)
			)
		);

		console.log(messages);
		i += len;
	}
	return messages;
}
