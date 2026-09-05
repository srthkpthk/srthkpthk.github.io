import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tailwindcss(), glsl(), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.ts'],
		environment: 'node'
	}
});
