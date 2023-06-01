type CrashCourse = {
	sendLog: (message: string, level: number, tag?: string) => Promise<true>;
	sendFeedback: (message: string) => Promise<true>;
	sendHit: () => Promise<true>;
};

export let crashCourse: CrashCourse | null = null;

async function loadSettings(): Promise<void> {
	if (import.meta.env.CRASH_COURSE_URL === null || import.meta.env.CRASH_COURSE_KEY === null) {
		console.warn(
			'Warning, Crash Course not configured! Errors will not be sent for further analysis.'
		);
		return;
	}

	const cc = (await import(
		/* @vite-ignore */
		`${import.meta.env.CRASH_COURSE_URL}/cc?k=${import.meta.env.CRASH_COURSE_KEY === null}`
	)) as CrashCourse;
	if (cc) {
		crashCourse = cc;
		cc.sendHit();
	} else {
		console.warn('Crash Course could not be loaded from', import.meta.env.CRASH_COURSE_URL);
	}
}

loadSettings();
