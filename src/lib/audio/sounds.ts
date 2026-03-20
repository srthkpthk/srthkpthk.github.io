import { get } from 'svelte/store';
import { soundEnabled } from '$lib/stores/audio';

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
	if (!get(soundEnabled)) return null;
	if (!ctx) {
		ctx = new AudioContext();
	}
	if (ctx.state === 'suspended') {
		ctx.resume();
	}
	return ctx;
}

export function playHoverTick() {
	const ac = getContext();
	if (!ac) return;

	const osc = ac.createOscillator();
	const gain = ac.createGain();
	osc.type = 'sine';
	osc.frequency.setValueAtTime(4000, ac.currentTime);
	osc.frequency.exponentialRampToValueAtTime(2000, ac.currentTime + 0.05);
	gain.gain.setValueAtTime(0.03, ac.currentTime);
	gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05);

	osc.connect(gain).connect(ac.destination);
	osc.start();
	osc.stop(ac.currentTime + 0.05);
}

export function playClickPop() {
	const ac = getContext();
	if (!ac) return;

	const osc = ac.createOscillator();
	const gain = ac.createGain();
	osc.type = 'triangle';
	osc.frequency.setValueAtTime(800, ac.currentTime);
	osc.frequency.exponentialRampToValueAtTime(300, ac.currentTime + 0.08);
	gain.gain.setValueAtTime(0.05, ac.currentTime);
	gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);

	osc.connect(gain).connect(ac.destination);
	osc.start();
	osc.stop(ac.currentTime + 0.08);
}

export function playScrollWhoosh(velocity: number) {
	const ac = getContext();
	if (!ac) return;

	const bufferSize = ac.sampleRate * 0.1;
	const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) {
		data[i] = Math.random() * 2 - 1;
	}

	const noise = ac.createBufferSource();
	noise.buffer = buffer;

	const bandpass = ac.createBiquadFilter();
	bandpass.type = 'bandpass';
	bandpass.frequency.value = 1000 + velocity * 2000;
	bandpass.Q.value = 0.5;

	const gain = ac.createGain();
	const vol = Math.min(velocity * 0.06, 0.03);
	gain.gain.setValueAtTime(vol, ac.currentTime);
	gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);

	noise.connect(bandpass).connect(gain).connect(ac.destination);
	noise.start();
	noise.stop(ac.currentTime + 0.1);
}
