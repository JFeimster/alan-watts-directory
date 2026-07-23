"use client";

import Link from "next/link";
import type { NavigationPillar } from "@/lib/site";

type MegaMenuProps = {
  pillar: NavigationPillar;
  pathname: string;
  onNavigate: () => void;
};

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function MegaMenu({ pillar, pathname, onNavigate }: MegaMenuProps) {
  return (
    <div className="mega-menu" aria-label={`${pillar.label} navigation`}>
      <div className="mega-menu__heading">
        <span className="system-label">INDEX PILLAR</span>
        <strong>{pillar.label}</strong>
      </div>
      <ul className="mega-menu__list">
        {pillar.items.map((item, index) => {
          const active = isActive(pathname, item.href);
          const content = (
            <>
              <span className="mega-menu__number">{String(index + 1).padStart(2, "0")}</span>
              <span className="mega-menu__label">{item.label}</span>
              <span className="route-status" data-status={item.status}>
                {item.status}
              </span>
            </>
          );

          return (
            <li key={item.href}>
              {item.status === "planned" ? (
                <span className="mega-menu__item" aria-disabled="true">
                  {content}
                </span>
              ) : (
                <Link
                  className="mega-menu__item"
                  data-active={active || undefined}
                  href={item.href}
                  onClick={onNavigate}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
