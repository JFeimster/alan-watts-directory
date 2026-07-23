"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { NavigationPillar, SiteConfig } from "@/lib/site";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileNavigation } from "@/components/layout/MobileNavigation";

type SiteHeaderProps = {
  site: Pick<SiteConfig, "name" | "logoText" | "tagline">;
  navigation: NavigationPillar[];
};

export function SiteHeader({ site, navigation }: SiteHeaderProps) {
  const pathname = usePathname();
  const [openPillar, setOpenPillar] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpenPillar(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPillar(null);
        setMobileOpen(false);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (
        openPillar &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpenPillar(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openPillar]);

  const activePillar = navigation.find((pillar) => pillar.label === openPillar);

  function closeMobileNavigation() {
    setMobileOpen(false);
    window.requestAnimationFrame(() => mobileTriggerRef.current?.focus());
  }

  return (
    <>
      <header className="site-header" ref={headerRef}>
        <div className="site-header__identity">
          <Link className="site-wordmark" href="/" aria-label={`${site.name} home`}>
            {site.logoText}
          </Link>
          <div className="site-header__project-label">
            <span className="status-light" aria-hidden="true" />
            INDEPENDENT PROJECT
          </div>
        </div>

        <nav className="desktop-navigation" aria-label="Primary navigation">
          {navigation.map((pillar) => {
            const active = pillar.items.some(
              (item) =>
                item.status !== "planned" &&
                (pathname === item.href || pathname.startsWith(`${item.href}/`)),
            );
            const open = openPillar === pillar.label;
            return (
              <button
                className="desktop-navigation__trigger"
                data-active={active || undefined}
                data-open={open || undefined}
                type="button"
                aria-expanded={open}
                aria-controls={`menu-${pillar.label.toLowerCase()}`}
                onClick={() => setOpenPillar(open ? null : pillar.label)}
                key={pillar.label}
              >
                {pillar.label}
                <span aria-hidden="true">{open ? "−" : "+"}</span>
              </button>
            );
          })}
        </nav>

        <div className="site-header__actions">
          <Link className="header-search" href="/search">
            SEARCH
          </Link>
          <button
            ref={mobileTriggerRef}
            className="header-menu"
            type="button"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            MENU
          </button>
        </div>

        {activePillar ? (
          <div
            className="site-header__mega"
            id={`menu-${activePillar.label.toLowerCase()}`}
          >
            <MegaMenu
              pillar={activePillar}
              pathname={pathname}
              onNavigate={() => setOpenPillar(null)}
            />
          </div>
        ) : null}
      </header>

      <MobileNavigation
        open={mobileOpen}
        site={site}
        navigation={navigation}
        pathname={pathname}
        onClose={closeMobileNavigation}
      />
    </>
  );
}
