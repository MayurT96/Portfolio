import { PropsWithChildren } from "react";

export default function SectionHeading({
  eyebrow,
  title,
  children,
}: PropsWithChildren<{
  eyebrow?: string;
  title: string;
}>) {
  return (
    <div className="mb-8 flex flex-col gap-3">
      {eyebrow ? (
        <div className="text-xs tracking-[0.28em] text-muted">{eyebrow}</div>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl">
        <span className="bg-[linear-gradient(90deg,rgba(74,231,255,.95),rgba(180,108,255,.95))] bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      {children ? <div className="mt-2 text-muted">{children}</div> : null}
    </div>
  );
}

