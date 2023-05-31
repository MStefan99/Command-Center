import {reactive} from 'vue';

import {Device, connectDevice, connectedDevices} from './driver';

type CrashCourse = {
	sendLog: (message: string, level: number, tag?: string) => Promise<true>;
	sendFeedback: (message: string) => Promise<true>;
	sendHit: () => Promise<true>;
};

type Store = {
	connectDevice(device: USBDevice): Promise<Device>;
	connectedDevices(): Device[];
	crashCourse: CrashCourse | null;
};

export const appState = reactive<Store>({
	connectDevice(usbDevice: USBDevice): Promise<Device> {
		return connectDevice(usbDevice);
	},
	connectedDevices(): Device[] {
		return connectedDevices();
	},
	crashCourse: null
});

export default appState;

async function loadSettings(): Promise<void> {
	if (import.meta.env.CRASH_COURSE_URL === null || import.meta.env.CRASH_COURSE_KEY === null) {
		console.warn(
			'Warning, Crash Course not configured! Errors will not be sent for further analysis.'
		);
		return;
	}

	const crashCourse = (await import(
		/* @vite-ignore */
		`${import.meta.env.CRASH_COURSE_URL}/cc?k=${import.meta.env.CRASH_COURSE_KEY === null}`
	)) as CrashCourse;
	if (crashCourse) {
		appState.crashCourse = crashCourse;
		crashCourse.sendHit();
	} else {
		console.warn('Crash Course could not be loaded from', import.meta.env.CRASH_COURSE_URL);
	}
}

loadSettings();
