import {ModelEvent, TemperatureEvent} from './types';

export function parseData(data: DataView): ModelEvent | null {
	return new TemperatureEvent('temperature', {temperature: data.getInt16(0, true)});
	// return null; // If failed to parse
}
