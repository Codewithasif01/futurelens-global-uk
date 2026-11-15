import { Link } from "@tanstack/react-router";
import { useSite } from "@/hooks/use-site";

export function LensMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="16" r="6" className="fill-edition" />
    </svg>
  );
}

export function Logo({ size = "lg" }: { size?: "lg" | "sm" }) {
  const site = useSite();
  return (
    <Link to="/" className="inline-flex items-center gap-2 text-ink" aria-label={`${site.name} home`}>
      <LensMark className={size === "lg" ? "h-7 w-7" : "h-5 w-5"} />
      <span className={`font-display font-semibold tracking-tight ${size === "lg" ? "text-3xl md:text-4xl" : "text-xl"}`}>
        FutureLens
      </span>
      {site.logoTag && (
        <span className="ml-0.5 rounded-sm bg-edition px-1.5 py-0.5 font-mono text-[0.65rem] font-bold tracking-widest text-edition-foreground">
          {site.logoTag}
        </span>
      )}
    </Link>
  );
}
