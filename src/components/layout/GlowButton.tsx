import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PropsWithChildren,
  useEffect,
  useRef,
} from "react";
import { gsap } from "@/lib/gsap";

type Base = PropsWithChildren<{
  className?: string;
}>;

type GlowAnchorProps = Base & {
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type GlowButtonProps = Base & {
  href?: never;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type GlowButtonUnion = GlowAnchorProps | GlowButtonProps;

function isAnchor(props: GlowButtonUnion): props is GlowAnchorProps {
  return typeof (props as GlowAnchorProps).href === "string";
}

function GlowButtonInner(props: GlowButtonUnion) {
  const baseClassName =
    "group glow-hover-flicker relative inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold tracking-wide text-white/90 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.014] hover:border-white/20 hover:bg-white/8 hover:shadow-[0_0_24px_rgba(74,231,255,.25)]";

  if (isAnchor(props)) {
    const { href, children, className: extra, ...rest } = props;
    return (
      <a
        href={href}
        className={`${baseClassName} ${extra ?? ""} overflow-hidden`}
        {...rest}
      >
        <span className="relative z-10">{children}</span>
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_20%_0%,rgba(74,231,255,.35),transparent_40%),radial-gradient(400px_circle_at_80%_10%,rgba(180,108,255,.28),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="pointer-events-none absolute -inset-1 rounded-full bg-[linear-gradient(90deg,rgba(74,231,255,.8),rgba(180,108,255,.8))] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-20" />
      </a>
    );
  }

  const { children, className: extra, ...rest } = props;
  return (
    <button
      className={`${baseClassName} ${extra ?? ""} overflow-hidden`}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_20%_0%,rgba(74,231,255,.35),transparent_40%),radial-gradient(400px_circle_at_80%_10%,rgba(180,108,255,.28),transparent_45%)] opacity-0 transition-opacity duration-300 hover:opacity-100" />
      <span className="pointer-events-none absolute -inset-1 rounded-full bg-[linear-gradient(90deg,rgba(74,231,255,.8),rgba(180,108,255,.8))] opacity-0 blur-md transition-opacity duration-300 hover:opacity-20" />
    </button>
  );
}

export default function GlowButton(props: GlowButtonUnion) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (ev: Event) => {
      const mouseEv = ev as MouseEvent;
      const rect = el.getBoundingClientRect();
      const x = mouseEv.clientX - rect.left - rect.width / 2;
      const y = mouseEv.clientY - rect.top - rect.height / 2;

      // Magnetic pull effect - slight offset toward cursor
      const distance = Math.sqrt(x * x + y * y);
      if (distance < 150) {
        const pull = (1 - distance / 150) * 4;
        gsap.to(el, {
          x: x * (pull / 100),
          y: y * (pull / 100),
          duration: 0.4,
          ease: "power2.out",
          overwrite: false,
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        overwrite: false,
      });
    };

    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (isAnchor(props)) {
    const { href, children, className: extra, ...rest } = props;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        {...rest}
      >
        <GlowButtonInner {...props} />
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      {...props}
    >
      <GlowButtonInner {...props} />
    </button>
  );
}

