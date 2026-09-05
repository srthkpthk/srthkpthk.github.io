import type { Readable } from 'svelte/store';

export type ReadinessOutcome = 'ready' | 'timeout';

export interface ReadinessOptions {
	/** Things to wait for; rejections count as settled. */
	signals: Promise<unknown>[];
	/** Minimum time to wait even if every signal is already settled. */
	min?: number;
	/** Hard cap after which we stop waiting. */
	cap?: number;
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Resolves 'ready' once all signals have settled and at least `min` ms have elapsed, or
 * 'timeout' when `cap` ms pass first.
 */
export function waitForReady({
	signals,
	min = 500,
	cap = 1200
}: ReadinessOptions): Promise<ReadinessOutcome> {
	const ready = Promise.all([Promise.allSettled(signals), delay(min)]).then(() => 'ready' as const);
	const timeout = delay(cap).then(() => 'timeout' as const);
	return Promise.race([ready, timeout]);
}

/** Resolves with the first truthy value a store emits and unsubscribes. */
export function firstTruthy<T>(store: Readable<T>): Promise<T> {
	return new Promise((resolve) => {
		let settled = false;
		const unsubscribe = store.subscribe((value) => {
			if (!value || settled) return;
			settled = true;
			resolve(value);
			// subscribe() may still be executing its synchronous first call; defer the unsubscribe.
			Promise.resolve().then(() => unsubscribe());
		});
		if (settled) unsubscribe();
	});
}
