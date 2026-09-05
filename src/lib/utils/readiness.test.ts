import { writable } from 'svelte/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { firstTruthy, waitForReady, type ReadinessOutcome } from './readiness';

const after = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function track(promise: Promise<ReadinessOutcome>) {
	const box: { value?: ReadinessOutcome } = {};
	promise.then((v) => (box.value = v));
	return box;
}

describe('waitForReady', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('holds for the minimum even when signals settle early', async () => {
		const result = track(waitForReady({ signals: [after(100)], min: 500, cap: 1200 }));

		await vi.advanceTimersByTimeAsync(499);
		expect(result.value).toBeUndefined();

		await vi.advanceTimersByTimeAsync(1);
		expect(result.value).toBe('ready');
	});

	it('waits for slow signals past the minimum', async () => {
		const result = track(waitForReady({ signals: [after(900), after(100)], min: 500, cap: 1200 }));

		await vi.advanceTimersByTimeAsync(899);
		expect(result.value).toBeUndefined();

		await vi.advanceTimersByTimeAsync(1);
		expect(result.value).toBe('ready');
	});

	it('gives up at the cap when a signal never settles', async () => {
		const result = track(waitForReady({ signals: [new Promise(() => {})], min: 500, cap: 1200 }));

		await vi.advanceTimersByTimeAsync(1199);
		expect(result.value).toBeUndefined();

		await vi.advanceTimersByTimeAsync(1);
		expect(result.value).toBe('timeout');
	});

	it('treats rejected signals as settled', async () => {
		const result = track(
			waitForReady({ signals: [Promise.reject(new Error('fonts failed'))], min: 500, cap: 1200 })
		);

		await vi.advanceTimersByTimeAsync(500);
		expect(result.value).toBe('ready');
	});
});

describe('firstTruthy', () => {
	it('resolves immediately when the store already holds a truthy value', async () => {
		await expect(firstTruthy(writable(true))).resolves.toBe(true);
	});

	it('resolves on the first truthy emission and then unsubscribes', async () => {
		const store = writable(false);
		const promise = firstTruthy(store);

		store.set(false);
		store.set(true);
		await expect(promise).resolves.toBe(true);

		// A later change must not throw or re-resolve; the promise is settled.
		store.set(false);
		await expect(promise).resolves.toBe(true);
	});
});
