import { Link } from "@tanstack/react-router";
import { Menu, Search } from "lucide-react";
import { useState } from "react";
import type { NavItem } from "@/lib/content-types";
import { Logo } from "./Logo";
import { EditionSwitch } from "./EditionSwitch";
import { useSite } from "@/hooks/use-site";

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  return (
    <a href={item.href} onClick={onClick} className="whitespace-nowrap py-3 text-sm font-medium tracking-wide text-ink hover:text-edition-ink">
      {item.label}
    </a>
  );
}

export function SiteHeader({ nav }: { nav: NavItem[] }) {
  const site = useSite();
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-background">
      <div className="edition-bar h-1" />
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-2">
          <EditionSwitch />
          <p className="meta hidden sm:block">{site.tagline}</p>
        </div>
        <div className="flex items-center justify-between py-5">
          <button
            type="button"
            className="p-2 md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1 md:flex-none">
            <div className="flex justify-center md:justify-start"><Logo /></div>
          </div>
          <Link to="/search" search={{ q: "" }} aria-label="Search" className="p-2 text-ink hover:text-edition-ink">
            <Search className="h-5 w-5" />
          </Link>
        </div>
        <nav aria-label="Sections" className="rule-top hidden border-b border-ink md:block">
          <ul className="flex gap-7 overflow-x-auto">
            {nav.map((item) => <li key={item.href}><NavLink item={item} /></li>)}
          </ul>
        </nav>
        {open && (
          <nav aria-label="Sections" className="rule-top border-b border-ink md:hidden">
            <ul className="flex flex-col">
              {nav.map((item) => <li key={item.href}><NavLink item={item} onClick={() => setOpen(false)} /></li>)}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
