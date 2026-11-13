import type { Variants, Transition } from 'framer-motion';

/** Shared easing curves — cinematic, natural, premium */
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  soft: [0.25, 0.1, 0.25, 1] as const,
  expo: [0.16, 1, 0.3, 1] as const,
};

export const duration = {
  fast: 0.35,
  base: 0.55,
  slow: 0.85,
  cinematic: 1.2,
};

export const defaultTransition: Transition = {
  duration: duration.base,
  ease: ease.out,
};

/** Fade + gentle rise — primary scroll reveal */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: ease.out },
  },
};

/** Softer fade for secondary elements */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.base, ease: ease.soft },
  },
};

/** Clip-style reveal from bottom (editorial feel) */
export const clipReveal: Variants = {
  hidden: { opacity: 0, y: 40, clipPath: 'inset(12% 0 0 0)' },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0% 0 0 0)',
    transition: { duration: duration.cinematic, ease: ease.expo },
  },
};

/** Image scale + fade (hero / gallery) */
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.1, ease: ease.expo },
  },
};

/** Stagger container */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
};

/** Individual text line / word reveal */
export const textLine: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: ease.out },
  },
};

/** Card entrance */
export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: ease.out },
  },
};

/** Scale in for buttons / CTAs */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: ease.out },
  },
};

/** Header entrance */
export const headerEnter: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: ease.out },
  },
};

/** Mobile menu panel */
export const mobileMenu: Variants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.35, ease: ease.inOut },
  },
  open: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.45, ease: ease.out },
  },
};

/** Floating WhatsApp */
export const floatingBtn: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: 1.1, duration: 0.55, ease: ease.out },
  },
};

/** Product gallery main image */
export const galleryImage: Variants = {
  enter: { opacity: 0, scale: 1.04 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: ease.out },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.35, ease: ease.inOut },
  },
};
