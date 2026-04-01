"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "@/lib/gsap";
import GlowButton from "@/components/layout/GlowButton";

export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  links: { live?: string; repo?: string };
};

export default function ProjectCard({
  project,
  isActive,
  onToggle,
}: {
  project: Project;
  isActive: boolean;
  onToggle: (id: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const tilt = useMemo(() => ({ rx: 0, ry: 0 }), []);

  useEffect(() => {
    const card = cardRef.current;
    const panel = panelRef.current;
    if (!card || !panel) return;

    panel.style.height = isActive ? `${panel.scrollHeight}px` : "0px";
    panel.style.opacity = isActive ? "1" : "0";
    panel.style.pointerEvents = isActive ? "auto" : "none";
  }, [isActive]);

  useEffect(() => {
    const card = cardRef.current;
    const panel = panelRef.current;
    if (!card || !panel) return;

    const handleMove = (ev: PointerEvent) => {
      if (ev.pointerType === "touch") return;

      const rect = card.getBoundingClientRect();
      const px = (ev.clientX - rect.left) / rect.width; // 0..1
      const py = (ev.clientY - rect.top) / rect.height; // 0..1

      const ry = (px - 0.5) * 16;
      const rx = (0.5 - py) * 12;
      tilt.rx = rx;
      tilt.ry = ry;

      gsap.to(card, {
        duration: 0.18,
        ease: "power2.out",
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 900,
      });
    };

    const handleLeave = () => {
      gsap.to(card, {
        duration: 0.35,
        ease: "power3.out",
        rotateX: 0,
        rotateY: 0,
      });
    };

    const handleClick = () => onToggle(project.id);

    card.addEventListener("pointermove", handleMove, { passive: true });
    card.addEventListener("pointerleave", handleLeave);
    card.addEventListener("click", handleClick);

    return () => {
      card.removeEventListener("pointermove", handleMove);
      card.removeEventListener("pointerleave", handleLeave);
      card.removeEventListener("click", handleClick);
    };
  }, [onToggle, project.id, tilt]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    gsap.to(panel, {
      height: isActive ? panel.scrollHeight : 0,
      opacity: isActive ? 1 : 0,
      duration: 0.5,
      ease: "power3.inOut",
      onStart: () => {
        if (isActive) {
          panel.style.pointerEvents = "auto";
          panel.style.overflow = "visible";
        } else {
          panel.style.overflow = "hidden";
        }
      },
      onComplete: () => {
        if (!isActive) {
          panel.style.pointerEvents = "none";
          panel.style.overflow = "hidden";
        } else {
          panel.style.overflow = "visible";
        }
      },
    });
  }, [isActive]);

  return (
    <div
      ref={cardRef}
      data-project-card
      className={[
        "group relative cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl",
        "transition-shadow duration-300 hover:border-white/20",
        isActive ? "shadow-[0_0_40px_rgba(74,231,255,.12)]" : "",
      ].join(" ")}
      style={{ transformStyle: "preserve-3d" }}
      role="button"
      aria-expanded={isActive}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onToggle(project.id);
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs tracking-[0.26em] text-muted">PROJECT</div>
          <div className="mt-2 text-xl font-semibold text-white/95">
            {project.title}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {project.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/80 backdrop-blur-xl"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl sm:block">
          <div className="text-xs text-muted">Click to expand</div>
          <div className="mt-2 h-1.5 w-16 rounded-full bg-gradient-to-r from-neonA via-neonB to-neonC opacity-70" />
        </div>
      </div>

      <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div
        ref={panelRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/15 p-4 backdrop-blur-xl">
            <div className="text-xs tracking-[0.26em] text-muted">HIGHLIGHTS</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
              <li>Neon glass UI with responsive motion.</li>
              <li>GSAP-driven transitions and staggered reveals.</li>
              <li>Production-minded performance and SEO.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/15 p-4 backdrop-blur-xl">
            <div className="text-xs tracking-[0.26em] text-muted">LINKS</div>
            <div className="mt-3 flex flex-col gap-2">
              {project.links.live ? (
                <GlowButton
                  href={project.links.live}
                  className="w-full"
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo
                </GlowButton>
              ) : null}

              {project.links.repo ? (
                <GlowButton
                  href={project.links.repo}
                  className="w-full"
                  target="_blank"
                  rel="noreferrer"
                >
                  Source Code
                </GlowButton>
              ) : null}

              {!project.links.live && !project.links.repo ? (
                <div className="text-xs text-muted">
                  Links will be available after deployment.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted">
          Tip: click another card to switch focus.
        </div>
      </div>
    </div>
  );
}

