import { writable } from 'svelte/store';

export const scrollY = writable(0);
export const scrollDirection = writable<'up' | 'down'>('down');
export const scrollProgress = writable(0);
export const activeSection = writable<string>('hero');
export const scrollVelocity = writable(0);
