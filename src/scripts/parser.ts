import {
	AttitudeMessage,
	CommandDescriptorType,
	InputMessage,
	MessageDescriptorType,
	ModelMessage,
	OutputMessage,
	TemperatureMessage
} from './types';

const commandParsers: Record<
	CommandDescriptorType,
	(data: DataView) => Map<MessageDescriptorType, ModelMessage>
> = {
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

function parseDataIN(data: DataView): Map<MessageDescriptorType, ModelMessage> {
	const messages = new Map<MessageDescriptorType, ModelMessage>();

	for (let i = 0; i < data.byteLength; ) {
		// Byte i contains the length of the message
		const len = data.getUint8(i);
		// Byte i + 1 contains the length of the message
		const type: MessageDescriptorType = data.getUint8(i + 1);

		messages.set(
			type,
			dataInParsers[type](new DataView(data.buffer, data.byteOffset + i + 2, len - 2))
		);
		i += len;
	}
	return messages;
}

export function parseData(
	data: DataView
): Map<CommandDescriptorType, Map<MessageDescriptorType, ModelMessage>> {
	// Byte 0 contains the length of the entire descriptor
	const totalLength = data.getUint8(0);
	const messages = new Map<CommandDescriptorType, Map<MessageDescriptorType, ModelMessage>>();

	for (let i = 0; i < totalLength; ) {
		// Byte 0 contains the length of the descriptor
		const len = data.getUint8(0);
		const type: CommandDescriptorType = data.getUint8(i + 1);
		messages.set(
			type,
			// Byte i + 1 is the descriptor type and
			// byte i + 2 is the start of descriptor parameters
			commandParsers[type](new DataView(data.buffer, i + 2, len - 2))
		);

		i += len;
	}
	return messages;
}
