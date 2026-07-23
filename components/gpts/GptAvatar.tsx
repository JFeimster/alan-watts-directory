import Image from "next/image";
import styles from "./gpts.module.css";

function initials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return words.map((word) => word.charAt(0).toUpperCase()).join("") || "AW";
}

export function GptAvatar({
  name,
  imagePath,
  size = "large",
}: {
  name: string;
  imagePath?: string | null;
  size?: "small" | "large";
}) {
  if (imagePath) {
    return (
      <Image
        className={styles.avatar}
        data-size={size}
        src={imagePath}
        alt=""
        width={size === "large" ? 160 : 56}
        height={size === "large" ? 160 : 56}
        unoptimized
      />
    );
  }

  return (
    <span
      className={styles.avatarFallback}
      data-size={size}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
