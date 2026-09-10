import Cta from "./primitives/Cta";

/**
 * 3.5 DualCTA — primary + lower-hierarchy secondary. On informational pages
 * the primary is the free template download, never /pricing (CATALOGO §3.5).
 * Image policy: prohibida.
 */
export default function DualCTA({ primary, secondary, note }) {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-4">
        {primary && (
          <Cta href={primary.href} tone="primary">
            {primary.label}
          </Cta>
        )}
        {secondary && (
          <Cta href={secondary.href} tone="secondary">
            {secondary.label}
          </Cta>
        )}
      </div>
      {note && <p className="t-small u-muted">{note}</p>}
    </div>
  );
}
