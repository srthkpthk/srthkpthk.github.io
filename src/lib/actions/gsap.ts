import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

export function scrollReveal(
	node: HTMLElement,
	params?: { delay?: number; y?: number; duration?: number; stagger?: number }
) {
	const { delay = 0, y = 60, duration = 1, stagger = 0 } = params ?? {};

	const children = stagger > 0 ? Array.from(node.children) : [node];

	gsap.set(children, { y, opacity: 0 });

	const tl = gsap.to(children, {
		y: 0,
		opacity: 1,
		duration,
		delay,
		stagger,
		ease: 'power3.out',
		scrollTrigger: {
			trigger: node,
			start: 'top 85%',
			end: 'top 20%',
			toggleActions: 'play none none none'
		}
	});

	return {
		destroy() {
			tl.kill();
		}
	};
}

export function textReveal(node: HTMLElement, params?: { delay?: number; duration?: number }) {
	const { delay = 0, duration = 0.8 } = params ?? {};

	const text = node.textContent ?? '';
	node.textContent = '';
	node.style.overflow = 'hidden';

	const wrapper = document.createElement('span');
	wrapper.style.display = 'inline-block';
	wrapper.style.overflow = 'hidden';

	const inner = document.createElement('span');
	inner.textContent = text;
	inner.style.display = 'inline-block';

	wrapper.appendChild(inner);
	node.appendChild(wrapper);

	const tl = gsap.from(inner, {
		yPercent: 110,
		duration,
		delay,
		ease: 'power4.out',
		scrollTrigger: {
			trigger: node,
			start: 'top 85%',
			toggleActions: 'play none none none'
		}
	});

	return {
		destroy() {
			tl.kill();
		}
	};
}

export function parallax(node: HTMLElement, params?: { speed?: number }) {
	const { speed = 0.3 } = params ?? {};

	const tl = gsap.to(node, {
		yPercent: speed * 100,
		ease: 'none',
		scrollTrigger: {
			trigger: node,
			start: 'top bottom',
			end: 'bottom top',
			scrub: true
		}
	});

	return {
		destroy() {
			tl.kill();
		}
	};
}

export { gsap, ScrollTrigger };
