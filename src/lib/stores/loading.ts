import { writable } from 'svelte/store';

/** True while the intro preloader covers the page. */
export const isLoading = writable(true);

/** True once the hero scene has drawn its first frame, or as soon as it decides not to render. */
export const sceneReady = writable(false);
