'use client';

import { motion, HTMLMotionProps } from 'framer-motion';

type MotionDivProps = HTMLMotionProps<'div'>;

export const FadeIn = ({ children, className, delay = 0, duration = 0.5, ...props }: MotionDivProps & { delay?: number, duration?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration, delay, ease: "easeOut" }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const SlideInLeft = ({ children, className, delay = 0, ...props }: MotionDivProps & { delay?: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
);

export const SlideInRight = ({ children, className, delay = 0, ...props }: MotionDivProps & { delay?: number }) => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
);

export const StaggerContainer = ({ children, className, delay = 0, staggerChildren = 0.1, ...props }: MotionDivProps & { delay?: number, staggerChildren?: number }) => (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerChildren,
            delayChildren: delay,
          }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
);

export const StaggerItem = ({ children, className, ...props }: MotionDivProps) => (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
);

export const ScaleOnHover = ({ children, className, ...props }: MotionDivProps) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
);

export const TextReveal = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
    return (
        <span className={className}>
            {text.split(" ").map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: delay + (i * 0.1), ease: "easeOut" }}
                    className="inline-block mr-[0.25em]"
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
}
