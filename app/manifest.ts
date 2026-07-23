import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alan Watts Wisdom",
    short_name: "Watts Wisdom",
    description: "A source-grounded library of Alan Watts lectures, books, quotations and ideas.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2eddf",
    theme_color: "#24372f",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

