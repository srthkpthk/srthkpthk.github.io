# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SvelteKit portfolio site for Sarthak Pathak. Static site with Three.js particle effects, GSAP animations, and project detail pages. Deployed to GitHub Pages via GitHub Actions on push to `master`.

## Build & Run Commands

```bash
npm install              # Install dependencies
npm run dev              # Run locally (Vite dev server)
npm run build            # Production build (static adapter)
npm run preview          # Preview production build
```

## Architecture

- **Framework**: SvelteKit 2 with Svelte 5 (runes mode), TypeScript, Tailwind CSS
- **Entry point**: `src/routes/+layout.svelte` — global layout with Lenis smooth scroll, Three.js scene, navbar, command palette, page transitions
- **Homepage**: `src/routes/+page.svelte` — Hero, About, Skills, Education, Projects, Contact sections
- **Project detail pages**: `src/routes/projects/[slug]/+page.svelte` — prerendered detail pages for each project
- **Content data**: `src/lib/data/content.ts` — all content strings, project data, helper functions (`getProjectBySlug`, `getAllSlugs`)
- **Three.js particles**: `src/lib/three/ParticleField.ts` — dual-layer particle system with section-based morphing, scroll velocity response, mouse repulsion
- **Animations**: `src/lib/actions/gsap.ts` — `scrollReveal`, `textReveal`, `parallax` Svelte actions using GSAP + ScrollTrigger
- **Static adapter**: `svelte.config.js` — `@sveltejs/adapter-static` with `BASE_PATH` env for GitHub Pages

## Key Details

- Prerender: `+layout.ts` exports `prerender = true` and `ssr = false`
- Particles: 35k desktop / 10k mobile, WebGL shaders with additive blending
- Page transitions: `PageTransition.svelte` uses `onNavigate`/`afterNavigate` with GSAP overlay
- Command palette: `Cmd+K` with nav links and project quick-access
- Smooth scroll: Lenis with scroll velocity piped to particle shader
- Profile image: `static/dp.jpg`
- CI: GitHub Actions workflow at `.github/workflows/web_app.yml`
