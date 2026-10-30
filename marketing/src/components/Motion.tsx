'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type IllustrationVariant = 'paths' | 'open-form' | 'focus';

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function BrandIllustration({
  variant,
  className = '',
  progress = 0,
}: {
  variant: IllustrationVariant;
  className?: string;
  progress?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const svg = ref.current;
    if (!svg || prefersReducedMotion()) return;

    if (variant === 'focus') {
      if (progress === 0) return;
      const accent = svg.querySelector<SVGPathElement>('[data-focus-accent]');
      if (!accent) return;
      const length = accent.getTotalLength();
      gsap.fromTo(accent, { strokeDasharray: length, strokeDashoffset: length }, {
        strokeDashoffset: 0,
        duration: 0.24,
        ease: 'power2.out',
      });
      return;
    }

    const strokes = Array.from(svg.querySelectorAll<SVGPathElement>('[data-draw]'));
    const endpoints = Array.from(svg.querySelectorAll<SVGCircleElement>('[data-settle]'));
    strokes.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });
    gsap.set(endpoints, { autoAlpha: 0, scale: 0.72, transformOrigin: 'center' });
    const reveal = gsap.timeline({
      scrollTrigger: {
        trigger: svg,
        start: 'top 82%',
        once: true,
      },
    });
    reveal.to(strokes, {
      strokeDashoffset: 0,
      duration: variant === 'paths' ? 0.8 : 0.84,
      stagger: 0.06,
      ease: 'power2.out',
    }, 0);
    if (endpoints.length) reveal.to(endpoints, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.22,
      stagger: 0.05,
      ease: 'back.out(1.4)',
    }, 0.7);
  }, { scope: ref, dependencies: [progress], revertOnUpdate: variant === 'focus' });

  return (
    <svg
      ref={ref}
      className={`brand-illustration brand-illustration-${variant} ${className}`.trim()}
      viewBox="0 0 560 200"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {variant === 'paths' && <>
        <circle cx="34" cy="100" r="8" fill="var(--accent-soft)" />
        <path data-draw d="M34 100 H78" className="illustration-stroke" />
        <path data-draw d="M78 100 C160 100 180 35 270 35 H520" className="illustration-stroke" />
        <path data-draw d="M78 100 C170 100 190 100 280 100 H520" className="illustration-stroke" />
        <path data-draw d="M78 100 C160 100 180 165 270 165 H520" className="illustration-stroke" />
        <circle data-settle cx="520" cy="35" r="6" fill="var(--accent-soft)" />
        <circle data-settle cx="520" cy="100" r="6" fill="var(--accent)" />
        <circle data-settle cx="520" cy="165" r="6" fill="var(--accent)" />
      </>}
      {variant === 'open-form' && <>
        <path data-draw d="M60 118 C74 72 122 42 178 42" className="illustration-stroke" />
        <path data-draw d="M202 41 C277 33 359 68 391 116" className="illustration-stroke" />
        <path data-draw d="M388 142 C352 180 277 186 218 164" className="illustration-stroke illustration-stroke-soft" />
        <circle data-settle cx="218" cy="164" r="6" fill="var(--accent-soft)" />
      </>}
      {variant === 'focus' && <>
        <rect x="18" y="15" width="524" height="170" rx="22" className="focus-outline" />
        <path d="M18 65 V42 Q18 15 45 15 H78" className="focus-corner" />
        <path d="M482 15 H515 Q542 15 542 42 V65" className="focus-corner" />
        <path d="M542 135 V158 Q542 185 515 185 H482" className="focus-corner" />
        <path d="M78 185 H45 Q18 185 18 158 V135" className="focus-corner" />
        <path data-focus-accent d="M78 15 H280" className="focus-accent" />
      </>}
    </svg>
  );
}

export function MotionEntrance({ pageKey }: { pageKey: string }) {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (pageKey !== 'home' || prefersReducedMotion()) return;
    const main = anchor.current?.closest('main');
    if (!main) return;
    const lines = main.querySelectorAll('[data-home-hero-line]');
    const support = main.querySelector('[data-home-hero-support]');
    const actions = main.querySelector('[data-home-hero-actions]');
    const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
    timeline.fromTo(lines, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.12 });
    if (support) timeline.fromTo(support, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.45);
    if (actions) timeline.fromTo(actions, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.58);
  }, { scope: anchor, dependencies: [pageKey], revertOnUpdate: true });

  return <span ref={anchor} className="motion-anchor" aria-hidden="true" />;
}
