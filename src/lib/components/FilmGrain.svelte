<div class="film-grain pointer-events-none fixed inset-0 z-[45]"></div>

<style>
	.film-grain {
		opacity: 0.06;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
		animation: grain 0.8s steps(6) infinite;
	}

	@keyframes grain {
		0% {
			transform: translate(0, 0);
		}
		10% {
			transform: translate(-2%, -3%);
		}
		20% {
			transform: translate(3%, 1%);
		}
		30% {
			transform: translate(-1%, 2%);
		}
		40% {
			transform: translate(2%, -2%);
		}
		50% {
			transform: translate(-3%, 3%);
		}
		60% {
			transform: translate(1%, -1%);
		}
		70% {
			transform: translate(-2%, 2%);
		}
		80% {
			transform: translate(3%, -3%);
		}
		90% {
			transform: translate(-1%, 1%);
		}
		100% {
			transform: translate(0, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.film-grain {
			animation: none;
		}
	}
</style>
