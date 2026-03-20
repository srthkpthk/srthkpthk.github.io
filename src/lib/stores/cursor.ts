import { writable } from 'svelte/store';

export const cursorPos = writable({ x: 0, y: 0 });
export const cursorHover = writable(false);
export const cursorHidden = writable(false);
