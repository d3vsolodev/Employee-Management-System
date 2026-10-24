import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';

// Three.js + the scene are code-split so the ~600KB WebGL bundle never blocks
// the landing page's first paint. Until it resolves (or if WebGL is missing),
// the CSS gradient backdrop underneath shows through.
const HeroCanvas = lazy(() => import('./HeroCanvas'));

// If anything in the 3D layer throws (no WebGL, context loss, driver bug),
// fall back silently to the gradient — the page must never break.
class SceneBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // Non-fatal: keep the gradient, log for diagnostics.
    // eslint-disable-next-line no-console
    if (process.env.NODE_ENV !== 'production') console.warn('HeroCanvas failed, using gradient fallback:', error);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return reduced;
};

const HeroBackground = () => {
  const reducedMotion = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  // Only mount the heavy canvas on capable, idle clients.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    setIsMobile(window.matchMedia('(max-width: 900px)').matches);

    const start = () => setEnabled(true);
    const id = window.requestIdleCallback ? window.requestIdleCallback(start, { timeout: 1200 }) : window.setTimeout(start, 400);
    return () => {
      if (window.cancelIdleCallback && window.requestIdleCallback) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  // Track normalized pointer position globally (canvas itself is click-through).
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onMove = e => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [pointer]);

  // Track scroll position so the scene reacts as the user scrolls the page.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onScroll = () => {
      scroll.current = window.scrollY || window.pageYOffset || 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scroll]);

  const count = isMobile ? 60 : 150;
  const animate = !reducedMotion;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        // Keep the procedural scene on a light backdrop so the landing page
        // stays bright even when WebGL is unavailable.
        background:
          'radial-gradient(circle at 16% 14%, rgba(129, 140, 248, 0.2), transparent 42%),' +
          'radial-gradient(circle at 84% 12%, rgba(34, 211, 238, 0.14), transparent 40%),' +
          'radial-gradient(circle at 55% 96%, rgba(167, 139, 250, 0.16), transparent 48%),' +
          'linear-gradient(170deg, #f8faff 0%, #eef2fb 50%, #f7fbff 100%)',
      }}
    >
      {enabled && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <HeroCanvas count={count} animate={animate} pointer={pointer} scroll={scroll} />
          </Suspense>
        </SceneBoundary>
      )}
      {/* Light scrim keeps the colored scene behind content without darkening the page. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 38%, rgba(255, 255, 255, 0.05) 0%, rgba(248, 250, 255, 0.28) 100%)',
        }}
      />
    </div>
  );
};

export default HeroBackground;
