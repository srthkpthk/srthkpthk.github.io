import * as THREE from 'three';
import vertexShader from './shaders/particles.vert';
import fragmentShader from './shaders/particles.frag';

export interface SectionConfig {
	geometry: THREE.BufferGeometry;
	colorA: [number, number, number];
	colorB: [number, number, number];
	rotationSpeed: number;
	useVertexColors?: boolean;
	cameraZ?: number;
	explode?: number;
}

// Simplified continent map — returns true if (lat, lon) is land
function isLand(lat: number, lon: number): boolean {
	if (lat > 25 && lat < 50 && lon > -130 && lon < -60) return true;
	if (lat > 50 && lat < 72 && lon > -170 && lon < -50) return true;
	if (lat > 15 && lat < 30 && lon > -120 && lon < -90) return true;
	if (lat > 7 && lat < 20 && lon > -92 && lon < -77) return true;
	if (lat > -5 && lat < 13 && lon > -82 && lon < -60) return true;
	if (lat > -25 && lat < -5 && lon > -75 && lon < -35) return true;
	if (lat > -56 && lat < -25 && lon > -75 && lon < -50) return true;
	if (lat > 36 && lat < 60 && lon > -10 && lon < 30) return true;
	if (lat > 55 && lat < 71 && lon > 5 && lon < 40) return true;
	if (lat > 50 && lat < 59 && lon > -11 && lon < 2) return true;
	if (lat > -5 && lat < 37 && lon > -18 && lon < 40) return true;
	if (lat > -35 && lat < -5 && lon > 10 && lon < 52) return true;
	if (lat > 0 && lat < 12 && lon > 38 && lon < 52) return true;
	if (lat > 12 && lat < 40 && lon > 30 && lon < 60) return true;
	if (lat > 8 && lat < 35 && lon > 68 && lon < 90) return true;
	if (lat > 10 && lat < 28 && lon > 90 && lon < 110) return true;
	if (lat > -8 && lat < 20 && lon > 95 && lon < 120) return true;
	if (lat > 20 && lat < 55 && lon > 75 && lon < 135) return true;
	if (lat > 30 && lat < 46 && lon > 129 && lon < 146) return true;
	if (lat > 50 && lat < 75 && lon > 40 && lon < 180) return true;
	if (lat > -10 && lat < 6 && lon > 95 && lon < 140) return true;
	if (lat > -40 && lat < -11 && lon > 113 && lon < 154) return true;
	if (lat > -47 && lat < -34 && lon > 166 && lon < 179) return true;
	if (lat > 60 && lat < 84 && lon > -73 && lon < -12) return true;
	if (lat < -65) return true;
	return false;
}

export class ParticleField {
	static readonly MAX_PIXEL_RATIO = 1.5;

	private scene: THREE.Scene;
	private camera: THREE.PerspectiveCamera;
	private backRenderer: THREE.WebGLRenderer;
	private frontRenderer: THREE.WebGLRenderer | null = null;
	private points: THREE.Points | null = null;
	private uniforms: Record<string, THREE.IUniform>;
	private animationId: number = 0;
	private destroyed = false;
	private mouse: THREE.Vector2 = new THREE.Vector2(0, 0);
	private targetMouse: THREE.Vector2 = new THREE.Vector2(0, 0);
	private clock: THREE.Clock = new THREE.Clock();
	private particleCount: number;

	private sectionConfigs: SectionConfig[] = [];
	private currentSection: number = 0;
	private morphProgress: number = 1;
	private morphing: boolean = false;
	private morphSpeed: number = 0.015;

	private geometryArrays: Float32Array[] = [];
	private colorArrays: Float32Array[] = [];
	private positionAttr!: THREE.BufferAttribute;
	private targetAttr!: THREE.BufferAttribute;
	private colorAttr!: THREE.BufferAttribute;

	private currentColorA = new THREE.Color();
	private currentColorB = new THREE.Color();
	private targetColorA = new THREE.Color();
	private targetColorB = new THREE.Color();

	private currentUseVertexColors: number = 0;
	private targetUseVertexColors: number = 0;
	private prevColorArray: Float32Array | null = null;
	private nextColorArray: Float32Array | null = null;

	private currentRotationSpeed: number = 0.05;
	private targetRotationSpeed: number = 0.05;
	private currentCameraZ: number = 4;
	private targetCameraZ: number = 4;

	// Scroll velocity
	private rawVelocity: number = 0;
	private smoothVelocity: number = 0;

	private backCanvas: HTMLCanvasElement;
	private frontCanvas: HTMLCanvasElement | null = null;

	constructor(
		backCanvas: HTMLCanvasElement,
		isMobile: boolean = false,
		frontCanvas?: HTMLCanvasElement
	) {
		this.particleCount = isMobile ? 10000 : 35000;
		this.backCanvas = backCanvas;
		this.frontCanvas = frontCanvas ?? null;

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			70,
			backCanvas.clientWidth / backCanvas.clientHeight,
			0.1,
			100
		);
		this.camera.position.z = 4;

		this.backRenderer = new THREE.WebGLRenderer({
			canvas: backCanvas,
			antialias: false,
			alpha: true
		});
		// Two full-screen renderers run every frame; cap the pixel ratio to keep fill-rate sane.
		const pixelRatio = Math.min(window.devicePixelRatio, ParticleField.MAX_PIXEL_RATIO);
		this.backRenderer.setSize(backCanvas.clientWidth, backCanvas.clientHeight);
		this.backRenderer.setPixelRatio(pixelRatio);

		if (frontCanvas) {
			this.frontRenderer = new THREE.WebGLRenderer({
				canvas: frontCanvas,
				antialias: false,
				alpha: true
			});
			this.frontRenderer.setSize(frontCanvas.clientWidth, frontCanvas.clientHeight);
			this.frontRenderer.setPixelRatio(pixelRatio);
		}

		this.uniforms = {
			uTime: { value: 0 },
			uMorph: { value: 1 },
			uPixelRatio: { value: pixelRatio },
			uMouse: { value: new THREE.Vector2(0, 0) },
			uColorA: { value: new THREE.Color() },
			uColorB: { value: new THREE.Color() },
			uUseVertexColors: { value: 0 },
			uDepthMode: { value: this.frontRenderer ? 0 : -1 },
			uVelocity: { value: 0 },
			uDarkMode: { value: 1.0 }
		};

		this.buildSectionConfigs();
		this.createParticles();
	}

	private buildSectionConfigs() {
		const count = this.particleCount;

		const ico = new THREE.IcosahedronGeometry(1.8, Math.ceil(Math.sqrt(count / 12)));
		this.sectionConfigs.push({
			geometry: ico,
			colorA: [0.545, 0.361, 0.965],
			colorB: [0.024, 0.714, 0.831],
			rotationSpeed: 0.05
		});

		const sphere = new THREE.SphereGeometry(1.6, 64, 64);
		this.sectionConfigs.push({
			geometry: sphere,
			colorA: [0.024, 0.714, 0.831],
			colorB: [0.063, 0.725, 0.506],
			rotationSpeed: 0.03
		});

		const octa = new THREE.OctahedronGeometry(1.8, 4);
		this.sectionConfigs.push({
			geometry: octa,
			colorA: [0.925, 0.282, 0.600],
			colorB: [0.545, 0.361, 0.965],
			rotationSpeed: 0.07,
			cameraZ: 7,
			explode: 2.5
		});

		const torus = new THREE.TorusKnotGeometry(1.2, 0.4, 200, 32);
		this.sectionConfigs.push({
			geometry: torus,
			colorA: [0.961, 0.620, 0.043],
			colorB: [0.957, 0.247, 0.369],
			rotationSpeed: 0.04
		});

		const earth = new THREE.SphereGeometry(1.8, 64, 64);
		this.sectionConfigs.push({
			geometry: earth,
			colorA: [0.06, 0.35, 0.85],
			colorB: [0.15, 0.68, 0.38],
			rotationSpeed: 0.02,
			useVertexColors: true
		});

		const EARTH_INDEX = 4;
		for (let s = 0; s < this.sectionConfigs.length; s++) {
			const config = this.sectionConfigs[s];
			const srcPos = config.geometry.attributes.position.array;
			const srcCount = srcPos.length / 3;
			const posArr = new Float32Array(count * 3);
			const colArr = new Float32Array(count * 3);

			const explode = config.explode ?? 0;

			for (let i = 0; i < count; i++) {
				const i3 = i * 3;
				const srcIdx = (i % srcCount) * 3;
				let x = srcPos[srcIdx] + (Math.random() - 0.5) * 0.08;
				let y = srcPos[srcIdx + 1] + (Math.random() - 0.5) * 0.08;
				let z = srcPos[srcIdx + 2] + (Math.random() - 0.5) * 0.08;

				if (explode > 0) {
					const len = Math.sqrt(x * x + y * y + z * z) || 0.01;
					const spread = explode * (0.6 + Math.random() * 0.8);
					x += (x / len) * spread + (Math.random() - 0.5) * explode * 0.5;
					y += (y / len) * spread + (Math.random() - 0.5) * explode * 0.5;
					z += (z / len) * spread + (Math.random() - 0.5) * explode * 0.5;
				}

				posArr[i3] = x;
				posArr[i3 + 1] = y;
				posArr[i3 + 2] = z;

				if (s === EARTH_INDEX) {
					const r = Math.sqrt(x * x + y * y + z * z);
					const lat = Math.asin(y / r) * (180 / Math.PI);
					const lon = Math.atan2(z, x) * (180 / Math.PI);

					if (isLand(lat, lon)) {
						const v = Math.random();
						if (v < 0.3) {
							colArr[i3] = 0.13 + Math.random() * 0.08;
							colArr[i3 + 1] = 0.55 + Math.random() * 0.2;
							colArr[i3 + 2] = 0.13 + Math.random() * 0.1;
						} else if (v < 0.6) {
							colArr[i3] = 0.2 + Math.random() * 0.1;
							colArr[i3 + 1] = 0.7 + Math.random() * 0.15;
							colArr[i3 + 2] = 0.25 + Math.random() * 0.1;
						} else if (v < 0.8) {
							colArr[i3] = 0.76 + Math.random() * 0.1;
							colArr[i3 + 1] = 0.65 + Math.random() * 0.1;
							colArr[i3 + 2] = 0.35 + Math.random() * 0.1;
						} else {
							if (Math.abs(lat) > 55) {
								colArr[i3] = 0.9;
								colArr[i3 + 1] = 0.93;
								colArr[i3 + 2] = 0.95;
							} else {
								colArr[i3] = 0.18 + Math.random() * 0.1;
								colArr[i3 + 1] = 0.65 + Math.random() * 0.15;
								colArr[i3 + 2] = 0.18 + Math.random() * 0.1;
							}
						}
					} else {
						const v = Math.random();
						if (v < 0.5) {
							colArr[i3] = 0.04 + Math.random() * 0.05;
							colArr[i3 + 1] = 0.25 + Math.random() * 0.15;
							colArr[i3 + 2] = 0.7 + Math.random() * 0.2;
						} else {
							colArr[i3] = 0.06 + Math.random() * 0.06;
							colArr[i3 + 1] = 0.35 + Math.random() * 0.15;
							colArr[i3 + 2] = 0.8 + Math.random() * 0.15;
						}
					}
				} else {
					colArr[i3] = 1;
					colArr[i3 + 1] = 1;
					colArr[i3 + 2] = 1;
				}
			}

			this.geometryArrays.push(posArr);
			this.colorArrays.push(colArr);
			config.geometry.dispose();
		}
	}

	private createParticles() {
		const count = this.particleCount;
		const firstConfig = this.sectionConfigs[0];

		const positions = new Float32Array(this.geometryArrays[0]);
		const targets = new Float32Array(this.geometryArrays[0]);
		const colors = new Float32Array(this.colorArrays[0]);
		const randoms = new Float32Array(count);

		for (let i = 0; i < count; i++) {
			randoms[i] = Math.random();
		}

		const geometry = new THREE.BufferGeometry();
		this.positionAttr = new THREE.BufferAttribute(positions, 3);
		this.targetAttr = new THREE.BufferAttribute(targets, 3);
		this.colorAttr = new THREE.BufferAttribute(colors, 3);

		geometry.setAttribute('position', this.positionAttr);
		geometry.setAttribute('positionTarget', this.targetAttr);
		geometry.setAttribute('aColor', this.colorAttr);
		geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

		this.currentColorA.setRGB(...firstConfig.colorA);
		this.currentColorB.setRGB(...firstConfig.colorB);
		this.targetColorA.copy(this.currentColorA);
		this.targetColorB.copy(this.currentColorB);
		this.uniforms.uColorA.value.copy(this.currentColorA);
		this.uniforms.uColorB.value.copy(this.currentColorB);

		const material = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms: this.uniforms,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending
		});

		this.points = new THREE.Points(geometry, material);
		this.scene.add(this.points);
	}

	transitionTo(sectionIndex: number) {
		if (sectionIndex === this.currentSection) return;
		if (sectionIndex < 0 || sectionIndex >= this.sectionConfigs.length) return;

		const config = this.sectionConfigs[sectionIndex];

		const posArr = this.positionAttr.array as Float32Array;
		const tgtArr = this.targetAttr.array as Float32Array;
		const morph = this.uniforms.uMorph.value;

		for (let i = 0; i < posArr.length; i++) {
			posArr[i] = posArr[i] + (tgtArr[i] - posArr[i]) * morph;
		}
		this.positionAttr.needsUpdate = true;

		const newTarget = this.geometryArrays[sectionIndex];
		for (let i = 0; i < tgtArr.length; i++) {
			tgtArr[i] = newTarget[i];
		}
		this.targetAttr.needsUpdate = true;

		this.prevColorArray = new Float32Array(this.colorAttr.array as Float32Array);
		this.nextColorArray = this.colorArrays[sectionIndex];

		this.uniforms.uMorph.value = 0;
		this.morphProgress = 0;
		this.morphing = true;

		this.currentColorA.copy(this.uniforms.uColorA.value);
		this.currentColorB.copy(this.uniforms.uColorB.value);
		this.targetColorA.setRGB(...config.colorA);
		this.targetColorB.setRGB(...config.colorB);

		this.currentUseVertexColors = this.uniforms.uUseVertexColors.value;
		this.targetUseVertexColors = config.useVertexColors ? 1 : 0;

		this.targetRotationSpeed = config.rotationSpeed;
		this.targetCameraZ = config.cameraZ ?? 4;

		this.currentSection = sectionIndex;
	}

	setDarkMode(isDark: boolean) {
		this.uniforms.uDarkMode.value = isDark ? 1.0 : 0.0;
		if (this.points) {
			const material = this.points.material as THREE.ShaderMaterial;
			material.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
			material.needsUpdate = true;
		}
	}

	updateVelocity(v: number) {
		this.rawVelocity = v;
	}

	start() {
		this.clock.start();
		this.resume();
	}

	/** Whether the render loop is currently scheduled. */
	get isRunning(): boolean {
		return this.animationId !== 0;
	}

	/** Stops scheduling frames (e.g. while the tab is hidden); safe to call repeatedly. */
	pause() {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = 0;
		}
	}

	/** Restarts the render loop if it is not already running. */
	resume() {
		if (this.destroyed || this.animationId) return;
		this.animate();
	}

	private animate = () => {
		this.animationId = requestAnimationFrame(this.animate);

		const elapsed = this.clock.getElapsedTime();
		this.uniforms.uTime.value = elapsed;

		// Smooth velocity towards target, decay when idle
		const targetV = Math.min(this.rawVelocity * 3, 0.8);
		this.smoothVelocity += (targetV - this.smoothVelocity) * 0.1;
		this.smoothVelocity *= 0.85;
		this.uniforms.uVelocity.value = this.smoothVelocity;

		// Morph animation
		if (this.morphing) {
			this.morphProgress += this.morphSpeed;
			if (this.morphProgress >= 1) {
				this.morphProgress = 1;
				this.morphing = false;
			}
			const eased = 1 - Math.pow(1 - this.morphProgress, 3);
			this.uniforms.uMorph.value = eased;

			this.uniforms.uColorA.value.lerpColors(this.currentColorA, this.targetColorA, eased);
			this.uniforms.uColorB.value.lerpColors(this.currentColorB, this.targetColorB, eased);

			this.uniforms.uUseVertexColors.value =
				this.currentUseVertexColors + (this.targetUseVertexColors - this.currentUseVertexColors) * eased;

			if (this.prevColorArray && this.nextColorArray) {
				const colArr = this.colorAttr.array as Float32Array;
				for (let i = 0; i < colArr.length; i++) {
					colArr[i] = this.prevColorArray[i] + (this.nextColorArray[i] - this.prevColorArray[i]) * eased;
				}
				this.colorAttr.needsUpdate = true;
			}

			this.currentRotationSpeed += (this.targetRotationSpeed - this.currentRotationSpeed) * 0.05;
			this.currentCameraZ += (this.targetCameraZ - this.currentCameraZ) * 0.05;
			this.camera.position.z = this.currentCameraZ;
		}

		// Lerp mouse position
		this.mouse.lerp(this.targetMouse, 0.05);
		this.uniforms.uMouse.value = this.mouse;

		// Rotation
		if (this.points) {
			this.points.rotation.y = elapsed * this.currentRotationSpeed;
			this.points.rotation.x = Math.sin(elapsed * 0.03) * 0.1;
		}

		// Dual-layer rendering
		if (this.frontRenderer) {
			// Back layer: far particles only
			this.uniforms.uDepthMode.value = 0;
			this.backRenderer.render(this.scene, this.camera);

			// Front layer: near particles only
			this.uniforms.uDepthMode.value = 1;
			this.frontRenderer.render(this.scene, this.camera);
		} else {
			// Single canvas mode — render all
			this.uniforms.uDepthMode.value = -1;
			this.backRenderer.render(this.scene, this.camera);
		}
	};

	updateMouse(x: number, y: number) {
		this.targetMouse.set(
			(x / this.backCanvas.clientWidth) * 2 - 1,
			-(y / this.backCanvas.clientHeight) * 2 + 1
		);
		this.targetMouse.multiplyScalar(3);
	}

	resize() {
		const width = this.backCanvas.clientWidth;
		const height = this.backCanvas.clientHeight;
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.backRenderer.setSize(width, height);
		if (this.frontRenderer && this.frontCanvas) {
			this.frontRenderer.setSize(this.frontCanvas.clientWidth, this.frontCanvas.clientHeight);
		}
	}

	rainbowScatter() {
		if (!this.points) return;

		const count = this.particleCount;
		const colArr = this.colorAttr.array as Float32Array;

		for (let i = 0; i < count; i++) {
			const hue = (i / count) * 360;
			const color = new THREE.Color();
			color.setHSL(hue / 360, 1, 0.6);
			colArr[i * 3] = color.r;
			colArr[i * 3 + 1] = color.g;
			colArr[i * 3 + 2] = color.b;
		}
		this.colorAttr.needsUpdate = true;

		this.uniforms.uUseVertexColors.value = 1;

		const tgtArr = this.targetAttr.array as Float32Array;
		const posArr = this.positionAttr.array as Float32Array;

		const morph = this.uniforms.uMorph.value;
		for (let i = 0; i < posArr.length; i++) {
			posArr[i] = posArr[i] + (tgtArr[i] - posArr[i]) * morph;
		}

		for (let i = 0; i < count; i++) {
			const i3 = i * 3;
			const x = posArr[i3], y = posArr[i3 + 1], z = posArr[i3 + 2];
			const len = Math.sqrt(x * x + y * y + z * z) || 0.01;
			tgtArr[i3] = (x / len) * 3 * len + (Math.random() - 0.5) * 2;
			tgtArr[i3 + 1] = (y / len) * 3 * len + (Math.random() - 0.5) * 2;
			tgtArr[i3 + 2] = (z / len) * 3 * len + (Math.random() - 0.5) * 2;
		}

		this.positionAttr.needsUpdate = true;
		this.targetAttr.needsUpdate = true;
		this.uniforms.uMorph.value = 0;
		this.morphProgress = 0;
		this.morphing = true;

		const origSpeed = this.morphSpeed;
		this.morphSpeed = 0.025;

		const savedSection = this.currentSection;
		setTimeout(() => {
			this.morphSpeed = origSpeed;
			const target = savedSection;
			this.currentSection = -1;
			this.transitionTo(target);
		}, 3000);
	}

	destroy() {
		this.destroyed = true;
		this.pause();
		this.points?.geometry.dispose();
		(this.points?.material as THREE.ShaderMaterial)?.dispose();
		this.backRenderer.dispose();
		this.frontRenderer?.dispose();
	}
}
