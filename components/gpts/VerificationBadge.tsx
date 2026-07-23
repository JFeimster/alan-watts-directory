import styles from "./gpts.module.css";

export function VerificationBadge({
  status,
}: {
  status: string;
}) {
  const normalized = status || "unreviewed";

  return (
    <span className={styles.verificationBadge} data-status={normalized}>
      {normalized.replaceAll("-", " ")}
    </span>
  );
}
