export type ModelMessage = {
	dt: number;
};

export type TemperatureMessage = {
	temperature: number;
} & ModelMessage;

export class ModelEvent extends CustomEvent<ModelMessage> {
	constructor(name: string, detail: ModelMessage) {
		super(name, {detail});
	}
}

export class TemperatureEvent extends CustomEvent<TemperatureMessage> {
	constructor(name: string, detail: TemperatureMessage) {
		super(name, {detail});
	}
}
