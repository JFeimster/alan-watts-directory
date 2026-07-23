"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { NavigationPillar, SiteConfig } from "@/lib/site";

type MobileNavigationProps = {
  open: boolean;
  site: Pick<SiteConfig, "logoText" | "tagline">;
  navigation: NavigationPillar[];
  pathname: string;
  onClose: () => void;
};

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNavigation({
  open,
  site,
  navigation,
  pathname,
  onClose,
}: MobileNavigationProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="mobile-nav-layer">
      <button
        className="mobile-nav-backdrop"
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
      />
      <aside
        className="mobile-nav"
        aria-label="Mobile navigation"
        aria-modal="false"
        role="dialog"
      >
        <div className="mobile-nav__top">
          <div>
            <strong className="mobile-nav__mark">{site.logoText}</strong>
            <span>{site.tagline}</span>
          </div>
          <button ref={closeButtonRef} className="icon-button" type="button" onClick={onClose}>
            CLOSE
          </button>
        </div>

        <nav>
          {navigation.map((pillar, pillarIndex) => (
            <details className="mobile-nav__group" key={pillar.label} open={pillarIndex === 0}>
              <summary>
                <span>{String(pillarIndex + 1).padStart(2, "0")}</span>
                {pillar.label}
              </summary>
              <ul>
                {pillar.items.map((item) => (
                  <li key={item.href}>
                    {item.status === "planned" ? (
                      <span className="mobile-nav__item" aria-disabled="true">
                        <span>{item.label}</span>
                        <span className="route-status" data-status={item.status}>{item.status}</span>
                      </span>
                    ) : (
                      <Link
                        className="mobile-nav__item"
                        data-active={isActive(pathname, item.href) || undefined}
                        href={item.href}
                        onClick={onClose}
                      >
                        <span>{item.label}</span>
                        <span className="route-status" data-status={item.status}>{item.status}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </nav>
      </aside>
    </div>
  );
}
