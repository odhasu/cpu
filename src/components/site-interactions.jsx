'use client';

import { useEffect } from 'react';
import { mountChrome } from '../chrome.js';
import { siteContext } from '../site.js';

const screens = {
  home: () => import('../screens/home.js'),
  models: () => import('../screens/models.js'),
  pricing: () => import('../screens/pricing.js'),
  gpu: () => import('../screens/gpu.js'),
  docs: () => import('../screens/docs.js'),
};

function watchReveals(root, signal) {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver((entries) => {
    for (const { isIntersecting, target } of entries) {
      if (!isIntersecting) continue;
      target.classList.remove('awaiting-reveal');
      observer.unobserve(target);
    }
  }, { rootMargin: '0px 0px -40px 0px' });

  const items = root.querySelectorAll('[data-reveal]');
  for (const item of items) {
    if (item.getBoundingClientRect().top < window.innerHeight) continue;
    item.classList.add('awaiting-reveal');
    observer.observe(item);
  }
  signal.addEventListener('abort', () => {
    observer.disconnect();
    for (const item of items) item.classList.remove('awaiting-reveal');
  }, { once: true });
}

export default function SiteInteractions({ page }) {
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const listen = (target, type, handler, options) => {
      target.addEventListener(type, handler, { ...options, signal });
    };
    const context = { ...siteContext, signal, listen };
    const main = document.getElementById('main-content');

    mountChrome(document, context);
    screens[page]().then(({ mount }) => {
      if (signal.aborted) return;
      mount(main, context);
      watchReveals(main, signal);
    }).catch((error) => {
      if (!signal.aborted) console.error('Could not initialize Blinkrouter interactions.', error);
    });

    return () => controller.abort();
  }, [page]);

  return null;
}
