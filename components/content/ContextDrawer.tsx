"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type ContextDrawerData = {
  title: string;
  source: string;
  sourceHref?: string | null;
  verificationStatus: string;
  relatedTopic: string;
  surroundingContext: string;
  whyItMatters: string;
  relatedContent: Array<{ label: string; href: string }>;
  citation: string;
  reportHref: string;
};

type ContextDrawerProps = {
  context: ContextDrawerData;
};

export function ContextDrawer({ context }: ContextDrawerProps) {
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState("COPY CITATION");
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function closeDrawer() {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  async function copyCitation() {
    try {
      await navigator.clipboard.writeText(context.citation);
      setCopyState("CITATION COPIED");
    } catch {
      setCopyState("COPY FAILED");
    }
  }

  return (
    <>
      <button ref={triggerRef} className="open-context" type="button" onClick={() => setOpen(true)}>
        OPEN CONTEXT
        <span aria-hidden="true">↗</span>
      </button>

      {open ? (
        <div className="context-layer">
          <button
            className="context-backdrop"
            type="button"
            aria-label="Close context"
            onClick={closeDrawer}
          />
          <aside
            className="context-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="context-drawer-title"
          >
            <div className="context-drawer__header">
              <div>
                <span className="system-label">SOURCE + INTERPRETATION LAYER</span>
                <h2 id="context-drawer-title">{context.title}</h2>
              </div>
              <button
                className="icon-button"
                ref={closeRef}
                type="button"
                onClick={closeDrawer}
              >
                CLOSE
              </button>
            </div>

            <dl className="context-drawer__facts">
              <div>
                <dt>SOURCE</dt>
                <dd>
                  {context.sourceHref ? (
                    <a href={context.sourceHref} target="_blank" rel="noreferrer">
                      {context.source} ↗
                    </a>
                  ) : (
                    context.source
                  )}
                </dd>
              </div>
              <div>
                <dt>VERIFICATION STATUS</dt>
                <dd>{context.verificationStatus}</dd>
              </div>
              <div>
                <dt>RELATED TOPIC</dt>
                <dd>{context.relatedTopic}</dd>
              </div>
            </dl>

            <section className="context-drawer__section">
              <h3>SURROUNDING CONTEXT</h3>
              <p>{context.surroundingContext}</p>
            </section>
            <section className="context-drawer__section">
              <h3>WHY IT MATTERS</h3>
              <p>{context.whyItMatters}</p>
            </section>
            <section className="context-drawer__section">
              <h3>RELATED CONTENT</h3>
              <ul>
                {context.relatedContent.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label} →</Link>
                  </li>
                ))}
              </ul>
            </section>

            <div className="context-drawer__actions">
              <button type="button" onClick={copyCitation}>{copyState}</button>
              <Link href={context.reportHref}>REPORT ISSUE</Link>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
