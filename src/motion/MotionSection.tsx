import type { HTMLAttributes, ReactNode } from 'react';
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from 'framer-motion';
import { fadeUp, staggerContainer } from './variants';

type MotionSectionProps = Omit<HTMLMotionProps<'section'>, 'children'> & {
  children?: ReactNode;
  delay?: number;
  stagger?: boolean;
  variants?: typeof fadeUp;
  amount?: number | 'some' | 'all';
  as?: 'section' | 'footer' | 'div';
};

/**
 * Scroll-triggered section wrapper.
 * Respects prefers-reduced-motion.
 */
export function MotionSection({
  children,
  delay = 0,
  stagger = false,
  variants = fadeUp,
  amount = 0.18,
  className,
  as = 'section',
  ...rest
}: MotionSectionProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    if (as === 'footer') {
      return (
        <footer className={className} {...(rest as HTMLAttributes<HTMLElement>)}>
          {children}
        </footer>
      );
    }
    if (as === 'div') {
      return (
        <div className={className} {...(rest as HTMLAttributes<HTMLDivElement>)}>
          {children}
        </div>
      );
    }
    return (
      <section className={className} {...(rest as HTMLAttributes<HTMLElement>)}>
        {children}
      </section>
    );
  }

  const shared = {
    className,
    initial: 'hidden' as const,
    whileInView: 'visible' as const,
    viewport: { once: true as const, amount, margin: '0px 0px -40px 0px' },
    variants: stagger ? staggerContainer : variants,
    transition: { delay },
  };

  if (as === 'footer') {
    return (
      <motion.footer {...shared} {...(rest as HTMLMotionProps<'footer'>)}>
        {children}
      </motion.footer>
    );
  }
  if (as === 'div') {
    return (
      <motion.div {...shared} {...(rest as HTMLMotionProps<'div'>)}>
        {children}
      </motion.div>
    );
  }
  return (
    <motion.section {...shared} {...(rest as HTMLMotionProps<'section'>)}>
      {children}
    </motion.section>
  );
}

type MotionDivProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children?: ReactNode;
  stagger?: boolean;
  amount?: number | 'some' | 'all';
};

export function MotionDiv({
  children,
  stagger = false,
  amount = 0.2,
  className,
  ...rest
}: MotionDivProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} {...(rest as HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: '0px 0px -30px 0px' }}
      variants={stagger ? staggerContainer : fadeUp}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type MotionItemProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children?: ReactNode;
};

/** Child item that participates in a stagger parent */
export function MotionItem({ children, className, ...rest }: MotionItemProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} {...(rest as HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div className={className} variants={fadeUp} {...rest}>
      {children}
    </motion.div>
  );
}
