<script lang="ts">
	import { onMount } from 'svelte';

	const KONAMI = [
		'ArrowUp',
		'ArrowUp',
		'ArrowDown',
		'ArrowDown',
		'ArrowLeft',
		'ArrowRight',
		'ArrowLeft',
		'ArrowRight',
		'KeyB',
		'KeyA'
	];

	onMount(() => {
		let buffer: string[] = [];

		function onKeyDown(e: KeyboardEvent) {
			buffer.push(e.code);
			if (buffer.length > KONAMI.length) {
				buffer = buffer.slice(-KONAMI.length);
			}
			if (buffer.length === KONAMI.length && buffer.every((k, i) => k === KONAMI[i])) {
				document.dispatchEvent(new CustomEvent('konami'));
				buffer = [];
			}
		}

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});
</script>
