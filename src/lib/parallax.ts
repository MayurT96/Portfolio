import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ParallaxOptions {
  speed?: number; // multiplier (0.5 = half scroll speed)
  blur?: boolean; // enable blur effect on scroll
  scale?: boolean; // enable scale effect
  yOffset?: number; // starting Y offset
}

/**
 * Create a parallax layer effect that moves based on scroll
 * Element must have data-parallax attribute
 */
export function createParallaxLayer(
  element: HTMLElement,
  options: ParallaxOptions = {}
) {
  const {
    speed = 0.5,
    blur = false,
    scale = false,
    yOffset = 0,
  } = options;

  const trigger = ScrollTrigger.create({
    trigger: element,
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
      const distance = self.getVelocity() * 0.05;
      const y = self.progress * (100 * speed) + yOffset;

      const animProps: Record<string, number | string | boolean> = {
        y,
        overwrite: false,
      };

      if (blur) {
        // Blur decreases as user scrolls to element (progress 0->1)
        const blurAmount = Math.max(0, (1 - self.progress) * 12);
        animProps.filter = `blur(${blurAmount}px)`;
      }

      if (scale) {
        // Scale increases as user scrolls to element
        const scaleAmount = 0.85 + self.progress * 0.15;
        animProps.scale = scaleAmount;
      }

      gsap.set(element, animProps as any);
    },
  });

  return trigger;
}

/**
 * Create multiple parallax layers with varying speeds
 * Auto-creates springs effect
 */
export function createParallaxLayers(
  elements: HTMLElement[],
  baseSpeed: number = 0.3,
  blur: boolean = true
) {
  return elements.map((el, i) => {
    const speed = baseSpeed + (i * 0.1); // Each layer slightly faster
    return createParallaxLayer(el, { speed, blur });
  });
}

/**
 * Animate element blur on scroll approach
 * blur-to-clear effect when element comes into view
 */
export function createBlurReveal(element: HTMLElement, maxBlur: number = 10) {
  gsap.set(element, { filter: `blur(${maxBlur}px)`, opacity: 0.7 });

  const trigger = ScrollTrigger.create({
    trigger: element,
    start: "top 90%",
    end: "top 40%",
    onUpdate: (self) => {
      const progress = self.progress; // 0 = just entered, 1 = fully visible
      const blurAmount = Math.max(0, (1 - progress) * maxBlur);
      const opacity = 0.7 + progress * 0.3;

      gsap.set(element, {
        filter: `blur(${blurAmount}px)`,
        opacity,
      });
    },
  });

  return trigger;
}

/**
 * Add subtle zoom effect to sections as you scroll past
 */
export function createScrollZoom(element: HTMLElement) {
  const trigger = ScrollTrigger.create({
    trigger: element,
    start: "top center",
    end: "bottom center",
    onUpdate: (self) => {
      const progress = self.progress; // 0 at top, 1 at bottom
      const scale = 0.98 + progress * 0.04; // subtle 0.98 -> 1.02 scale
      gsap.set(element, { scale, overwrite: false } as any);
    },
  });

  return trigger;
}
