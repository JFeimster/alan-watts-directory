type SectionHeaderProps = {
  number: string;
  eyebrow: string;
  title: string;
  copy?: string;
  inverted?: boolean;
};

export function SectionHeader({
  number,
  eyebrow,
  title,
  copy,
  inverted = false,
}: SectionHeaderProps) {
  return (
    <header className="section-header" data-inverted={inverted || undefined}>
      <div className="section-header__index">{number}</div>
      <div>
        <p className="system-label">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {copy ? <p className="section-header__copy">{copy}</p> : null}
    </header>
  );
}
