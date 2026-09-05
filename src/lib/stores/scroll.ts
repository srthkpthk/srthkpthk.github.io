import { writable } from 'svelte/store';
import type { SectionId } from '$lib/data/sections';

export const scrollY = writable(0);
export const scrollDirection = writable<'up' | 'down'>('down');
export const scrollProgress = writable(0);
export const activeSection = writable<SectionId>('hero');
export const scrollVelocity = writable(0);
