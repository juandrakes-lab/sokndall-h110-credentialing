/**
 * Heading — the heading level is a prop, never hardcoded (CATALOGO §2.2,
 * on-page-seo.md §4). Every catalog component that renders a heading takes
 * `as` and forwards it here. One <h1> per page lives in Hero / PageHeader;
 * everything else defaults to h2 and is demoted with `as` where nested.
 *
 * `styleClass` is the visual size (t-h1 / t-h2 / t-h3) and is chosen
 * independently of the semantic level, so a section can read as an h3 but
 * still look like an h2 when the document structure needs it.
 */
export default function Heading({
  as: As = "h2",
  styleClass = "t-h2",
  className = "",
  id,
  children,
}) {
  return (
    <As id={id} className={`${styleClass} u-ink ${className}`.trim()}>
      {children}
    </As>
  );
}
