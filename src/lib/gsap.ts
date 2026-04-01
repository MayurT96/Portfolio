import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

let registered = false;

export function ensureGsap() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  registered = true;
}

export { gsap, ScrollTrigger, ScrollToPlugin };

