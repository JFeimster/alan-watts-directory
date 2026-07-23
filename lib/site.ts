import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

export type RouteStatus = "live" | "preview" | "planned" | "hidden";

export type SiteConfig = {
  name: string;
  shortName: string;
  logoText: string;
  tagline: string;
  description: string;
  independentProject: boolean;
  officialAffiliation: boolean;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  canonicalBaseUrl: string;
  socialLinks: Array<{ label: string; href: string }>;
  newsletter: {
    status: RouteStatus;
    endpoint: string | null;
    provider: string | null;
  };
  contact: {
    email: string | null;
    formEndpoint: string | null;
  };
  copyright: string;
};

export type NavigationItem = {
  label: string;
  href: string;
  status: RouteStatus;
  description?: string;
};

export type NavigationPillar = {
  label: string;
  items: NavigationItem[];
};

export type FooterGroup = {
  label: string;
  items: NavigationItem[];
};

type RouteRecord = {
  status: RouteStatus;
  label: string;
  description?: string;
};

type RouteRegistry = {
  version: number;
  routes: Record<string, RouteRecord>;
};

const root = process.cwd();

function readYaml<T>(relativePath: string): T {
  return YAML.parse(
    fs.readFileSync(path.join(root, relativePath), "utf8"),
  ) as T;
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(
    fs.readFileSync(path.join(root, relativePath), "utf8"),
  ) as T;
}

export function getSiteConfig(): SiteConfig {
  const config = readYaml<SiteConfig>("data/site.yaml");
  const canonicalBaseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    config.canonicalBaseUrl.replace(/\/$/, "");

  return { ...config, canonicalBaseUrl };
}

export function getRouteRegistry(): RouteRegistry {
  return readJson<RouteRegistry>("data/route-registry.json");
}

export function getRouteRecord(href: string): RouteRecord {
  const registry = getRouteRegistry();
  return (
    registry.routes[href] ?? {
      status: "planned",
      label: href,
      description: "Route not yet registered.",
    }
  );
}

function mergeRouteStatus(
  item: Omit<NavigationItem, "status">,
): NavigationItem {
  const route = getRouteRecord(item.href);
  return {
    ...item,
    status: route.status,
    description: item.description ?? route.description,
  };
}

export function getNavigation(): NavigationPillar[] {
  const document = readYaml<{
    pillars: Array<{
      label: string;
      items: Array<Omit<NavigationItem, "status">>;
    }>;
  }>("data/navigation.yaml");

  return document.pillars.map((pillar) => ({
    ...pillar,
    items: pillar.items
      .map(mergeRouteStatus)
      .filter((item) => item.status !== "hidden"),
  }));
}

export function getFooterNavigation(): FooterGroup[] {
  const document = readYaml<{
    groups: Array<{
      label: string;
      items: Array<Omit<NavigationItem, "status">>;
    }>;
  }>("data/footer.yaml");

  return document.groups.map((group) => ({
    ...group,
    items: group.items
      .map(mergeRouteStatus)
      .filter((item) => item.status !== "hidden"),
  }));
}

export function absoluteUrl(href: string): string {
  const site = getSiteConfig();
  return new URL(href, `${site.canonicalBaseUrl}/`).toString();
}
