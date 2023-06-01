import {ModelEvent, TemperatureEvent} from './types';

export function parseData(data: DataView, dt: number): ModelEvent | null {
	return new TemperatureEvent('temperature', {temperature: data.getInt16(0, true), dt});
	// return null; // If failed to parse
}
