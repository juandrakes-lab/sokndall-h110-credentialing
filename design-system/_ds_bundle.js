/* @ds-bundle: Sokndall Design System — browser build for specimen cards and UI kits.
   Mirrors the ESM sources under components/. Attaches to window.SokndallDS.
   Requires React + ReactDOM UMD to be loaded first. No JSX (plain createElement). */
(function () {
  var React = window.React;
  if (!React) { console.error("_ds_bundle.js: React must load first"); return; }
  var h = React.createElement;
  var useState = React.useState;
  var NS = (window.SokndallDS = window.SokndallDS || {});

  /* ---------------- brand/Wordmark ---------------- */
  function Wordmark(p) {
    p = p || {};
    var tone = p.tone || "ink";
    var color = p.color || (tone === "inverse" ? "var(--white)" : tone === "accent" ? "var(--forest-600)" : "var(--ink-900)");
    return h(p.as || "span", {
      className: p.className,
      style: Object.assign({
        display: "inline-block", fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)",
        fontSize: p.size || 22, lineHeight: 1, letterSpacing: "0.06em", textTransform: "uppercase", color: color,
      }, p.style),
    }, "Sokndall");
  }

  /* ---------------- core/Button ---------------- */
  var BTN_SIZES = {
    sm: { height: 38, padding: "0 18px", fontSize: "var(--fs-caption)" },
    md: { height: 46, padding: "0 24px", fontSize: "var(--fs-small)" },
    lg: { height: 54, padding: "0 30px", fontSize: "var(--fs-body)" },
  };
  function btnFills(v) {
    if (v === "gold") return { bg: "var(--action-gold)", hover: "var(--action-gold-hover)", press: "var(--action-gold-press)", fg: "var(--text-on-gold)", border: "transparent", chip: "rgba(20,40,29,.12)" };
    if (v === "outline") return { bg: "transparent", hover: "var(--paper-warm)", press: "var(--ink-050)", fg: "var(--action-outline-text)", border: "var(--action-outline-border)", chip: "var(--ink-100)" };
    if (v === "ghost") return { bg: "transparent", hover: "var(--sage-100)", press: "var(--sage-200)", fg: "var(--forest-700)", border: "transparent", chip: "var(--sage-100)" };
    if (v === "onDark") return { bg: "var(--action-on-dark-bg)", hover: "var(--paper)", press: "var(--ink-100)", fg: "var(--action-on-dark-text)", border: "transparent", chip: "rgba(20,40,29,.10)" };
    return { bg: "var(--action-primary)", hover: "var(--action-primary-hover)", press: "var(--action-primary-press)", fg: "var(--white)", border: "transparent", chip: "rgba(255,255,255,.14)" };
  }
  function ArrowChip(bg) {
    return h("span", {
      "aria-hidden": "true",
      style: {
        display: "grid", placeItems: "center", width: "1.55em", height: "1.55em",
        marginRight: "-0.35em", marginLeft: "0.15em", borderRadius: "var(--radius-xs)",
        background: bg, fontSize: "0.85em", lineHeight: 1,
      },
    }, "↗");
  }
  function Button(p) {
    p = p || {};
    var v = p.variant || "primary";
    var size = BTN_SIZES[p.size || "md"];
    var c = btnFills(v);
    var hv = useState(false), hover = hv[0], setHover = hv[1];
    var pr = useState(false), press = pr[0], setPress = pr[1];
    var disabled = !!p.disabled;
    var bg = disabled ? "var(--action-disabled-bg)" : press ? c.press : hover ? c.hover : c.bg;
    var Tag = p.as || "button";
    return h(Tag, {
      disabled: Tag === "button" ? disabled : undefined,
      href: p.href,
      onMouseEnter: function () { setHover(true); },
      onMouseLeave: function () { setHover(false); setPress(false); },
      onMouseDown: function () { setPress(true); },
      onMouseUp: function () { setPress(false); },
      style: Object.assign({
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)",
        height: size.height, padding: size.padding, width: p.fullWidth ? "100%" : "auto",
        font: "var(--type-button)", fontSize: size.fontSize,
        color: disabled ? "var(--action-disabled-text)" : c.fg, background: bg,
        border: "1px solid " + (disabled ? "transparent" : c.border),
        borderRadius: "var(--radius-button)",
        boxShadow: v === "primary" || v === "gold" ? "var(--shadow-button)" : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transform: press && !disabled ? "scale(var(--press-scale))" : "none",
        transition: "var(--transition-hover), transform var(--dur-fast) var(--ease-standard)",
        textDecoration: "none", whiteSpace: "nowrap",
      }, p.style),
    }, p.iconLeft, p.children, p.iconRight, p.arrow ? ArrowChip(c.chip) : null);
  }

  /* ---------------- core/ArrowLink ---------------- */
  function ArrowLink(p) {
    p = p || {};
    var hv = useState(false), hover = hv[0], setHover = hv[1];
    var onDark = p.tone === "onDark";
    var color = onDark ? "var(--white)" : hover ? "var(--text-link-hover)" : "var(--text-link)";
    return h("a", {
      href: p.href || "#",
      onMouseEnter: function () { setHover(true); },
      onMouseLeave: function () { setHover(false); },
      style: Object.assign({
        display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
        font: "var(--type-small)", fontSize: p.size || "var(--fs-small)",
        fontWeight: (p.weight || "semibold") === "semibold" ? "var(--fw-semibold)" : "var(--fw-medium)",
        color: color, textDecoration: "underline", textUnderlineOffset: "3px",
        textDecorationColor: onDark ? "rgba(255,255,255,.5)" : "currentColor",
        transition: "var(--transition-hover)",
      }, p.style),
    }, p.children, h("span", {
      "aria-hidden": "true",
      style: { display: "inline-block", transform: hover ? "translateX(3px)" : "none", transition: "transform var(--dur-base) var(--ease-out)", lineHeight: 1 },
    }, "↗"));
  }

  /* ---------------- core/Pill ---------------- */
  function Pill(p) {
    p = p || {};
    var dark = p.tone === "dark";
    return h("span", {
      style: Object.assign({
        display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
        padding: "6px 14px 6px 12px", borderRadius: "var(--radius-pill)",
        font: "var(--type-eyebrow)", letterSpacing: "var(--ls-eyebrow)",
        background: dark ? "rgba(255,255,255,.10)" : "var(--sage-100)",
        color: dark ? "var(--white)" : "var(--sage-ink)",
        border: dark ? "1px solid var(--border-on-dark)" : "1px solid transparent",
      }, p.style),
    }, p.icon ? h("span", { "aria-hidden": "true", style: { fontSize: "1.05em", lineHeight: 1 } }, p.icon) : null, p.children);
  }

  /* ---------------- core/Badge ---------------- */
  var BADGE_TONES = {
    sage: { bg: "var(--sage-100)", fg: "var(--sage-ink)" },
    gold: { bg: "var(--gold-500)", fg: "var(--ink-900)" },
    forest: { bg: "var(--forest-800)", fg: "var(--white)" },
    neutral: { bg: "var(--ink-050)", fg: "var(--ink-700)" },
    onDark: { bg: "var(--forest-card)", fg: "var(--paper)" },
  };
  function Badge(p) {
    p = p || {};
    var c = BADGE_TONES[p.tone || "sage"] || BADGE_TONES.sage;
    return h("span", {
      style: Object.assign({
        display: "inline-flex", alignItems: "center", padding: "3px 10px",
        borderRadius: "var(--radius-pill)", font: "var(--type-eyebrow)", fontWeight: "var(--fw-semibold)",
        background: c.bg, color: c.fg,
      }, p.style),
    }, p.children);
  }

  /* ---------------- core/Card ---------------- */
  function Card(p) {
    p = p || {};
    var hv = useState(false), hover = hv[0], setHover = hv[1];
    var dark = p.tone === "dark";
    var el = p.elevation || "card";
    var shadow = el === "none" ? "none" : el === "float" ? "var(--shadow-float)" : el === "panel" ? "var(--shadow-panel)" : "var(--shadow-card)";
    return h("div", {
      onMouseEnter: function () { setHover(true); },
      onMouseLeave: function () { setHover(false); },
      style: Object.assign({
        background: dark ? "var(--surface-dark-card)" : "var(--surface-card)",
        border: "1px solid " + (dark ? "var(--border-on-dark)" : "var(--border-card)"),
        borderRadius: "var(--radius-card)", padding: p.pad || "var(--card-pad)",
        color: dark ? "var(--text-body-on-dark)" : "var(--text-body)",
        boxShadow: dark ? "none" : (p.interactive && hover ? "var(--shadow-card-hover)" : shadow),
        transform: p.interactive && hover ? "var(--lift-hover)" : "none",
        transition: "var(--transition-card)",
      }, p.style),
    }, p.children);
  }

  /* ---------------- core/IconCircle ---------------- */
  var TILE_TONES = {
    white: { bg: "var(--white)", fg: "var(--forest-800)" },
    sage: { bg: "var(--tint-sage)", fg: "var(--tint-sage-ink)" },
    gold: { bg: "var(--tint-gold)", fg: "var(--tint-gold-ink)" },
    forest: { bg: "var(--forest-700)", fg: "var(--white)" },
  };
  function IconCircle(p) {
    p = p || {};
    var c = TILE_TONES[p.tone || "white"] || TILE_TONES.white;
    var size = p.size || 56;
    var icon = typeof p.icon === "string"
      ? h("i", { "data-lucide": p.icon, style: { width: Math.round(size * 0.4), height: Math.round(size * 0.4) } })
      : p.icon;
    return h("div", {
      style: Object.assign({
        width: size, height: size, flex: "0 0 auto", display: "grid", placeItems: "center",
        background: c.bg, color: c.fg, borderRadius: "var(--radius-tile)",
      }, p.style),
    }, icon);
  }

  /* ---------------- content/SectionHeading ---------------- */
  function SectionHeading(p) {
    p = p || {};
    var dark = p.tone === "dark";
    var align = p.align || "left";
    var font = p.size === "display" ? "var(--type-display)" : "var(--type-h2)";
    var ls = p.size === "display" ? "var(--ls-display)" : "var(--ls-heading)";
    return h("div", {
      style: Object.assign({
        display: "flex", flexDirection: "column", gap: "var(--space-4)", textAlign: align,
        alignItems: align === "center" ? "center" : "flex-start", maxWidth: 640,
      }, p.style),
    },
      p.eyebrow ? h(Pill, { icon: p.eyebrowIcon, tone: dark ? "dark" : "sage" }, p.eyebrow) : null,
      h("h2", { style: { font: font, letterSpacing: ls, color: dark ? "var(--white)" : "var(--text-heading)", margin: 0, textWrap: "balance" } }, p.title),
      p.description ? h("p", { style: { font: "var(--type-body)", color: dark ? "var(--text-body-on-dark)" : "var(--text-body)", margin: 0, maxWidth: 460, textWrap: "pretty" } }, p.description) : null
    );
  }

  /* ---------------- content/ServiceCard ---------------- */
  function ServiceCard(p) {
    p = p || {};
    var dark = (p.tone || "dark") === "dark";
    return h(Card, {
      tone: p.tone || "dark", interactive: true, pad: "var(--space-8)",
      style: Object.assign({ display: "flex", flexDirection: "column", gap: "var(--space-5)" }, p.style),
    },
      h("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-4)" } },
        h(IconCircle, { icon: p.icon, tone: "white" }),
        h("h4", { style: { font: "var(--type-h4)", color: dark ? "var(--white)" : "var(--text-heading)", margin: 0 } }, p.title)
      ),
      h("p", { style: { font: "var(--type-small)", color: dark ? "var(--text-body-on-dark)" : "var(--text-body)", margin: 0, flex: 1, textWrap: "pretty" } }, p.body),
      p.linkLabel !== "" ? h(ArrowLink, { href: p.href || "#", tone: dark ? "onDark" : "default" }, p.linkLabel || "Learn More") : null
    );
  }

  /* ---------------- content/FeatureItem ---------------- */
  function FeatureItem(p) {
    p = p || {};
    var dark = p.tone === "dark";
    return h("li", {
      style: Object.assign({
        display: "flex", alignItems: "center", gap: "var(--space-3)",
        font: "var(--type-body)", fontSize: "var(--fs-small)",
        color: dark ? "var(--text-body-on-dark)" : "var(--text-body)", listStyle: "none",
      }, p.style),
    },
      h("span", {
        "aria-hidden": "true",
        style: {
          display: "grid", placeItems: "center", flex: "0 0 auto", width: 22, height: 22,
          borderRadius: "var(--radius-tile)",
          background: dark ? "rgba(255,255,255,.12)" : "var(--sage-100)",
          color: dark ? "var(--white)" : "var(--forest-600)",
        },
      }, h("i", { "data-lucide": "check", style: { width: 13, height: 13 } })),
      p.children
    );
  }

  /* ---------------- content/LogoWall ---------------- */
  function LogoWall(p) {
    p = p || {};
    var dark = p.tone === "dark";
    var names = p.names || [];
    return h("div", { style: p.style },
      p.caption !== "" ? h("div", { style: { font: "var(--type-small)", fontWeight: "var(--fw-medium)", color: dark ? "var(--text-body-on-dark)" : "var(--text-muted)" } }, p.caption || "Trusted by 500+ businesses across the USA") : null,
      h("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-9)", marginTop: "var(--space-5)", flexWrap: "wrap" } },
        names.map(function (n) {
          return h("span", { key: n, style: { font: "var(--font-display)", fontSize: "var(--fs-h5)", fontWeight: "var(--fw-semibold)", color: dark ? "rgba(255,255,255,.6)" : "var(--ink-300)", letterSpacing: "var(--ls-heading)" } }, n);
        })
      )
    );
  }

  /* ---------------- content/StatStrip ---------------- */
  function StatStrip(p) {
    p = p || {};
    var dark = p.tone === "dark";
    var stats = p.stats || [];
    return h("div", {
      style: Object.assign({ display: "grid", gridTemplateColumns: "repeat(" + Math.max(stats.length, 1) + ",1fr)" }, p.style),
    }, stats.map(function (s, i) {
      return h("div", {
        key: s.label,
        style: { padding: "0 var(--space-7)", borderLeft: i ? "1px solid " + (dark ? "var(--border-on-dark)" : "var(--border-hairline)") : "none" },
      },
        h("div", { style: { font: "var(--font-display)", fontSize: "var(--fs-stat)", fontWeight: "var(--fw-semibold)", color: dark ? "var(--white)" : "var(--text-heading)", lineHeight: 1.1, letterSpacing: "var(--ls-heading)" } }, s.value),
        h("div", { style: { font: "var(--type-small)", color: dark ? "var(--text-body-on-dark)" : "var(--text-body)", marginTop: 4 } }, s.label)
      );
    }));
  }

  /* ---------------- navigation/NavBar ---------------- */
  function NavBar(p) {
    p = p || {};
    var items = p.items || [];
    var transparent = p.transparent !== false;
    return h("header", {
      style: Object.assign({
        height: "var(--nav-h)", display: "flex", alignItems: "center", gap: "var(--space-9)",
        padding: "0 var(--page-x)", minWidth: 1120,
        background: transparent ? "transparent" : "var(--white)",
        borderBottom: "1px solid " + (transparent ? "transparent" : "var(--border-hairline)"),
        transition: "var(--transition-hover)",
      }, p.style),
    },
      h(Wordmark, { size: 20 }),
      h("nav", { style: { display: "flex", alignItems: "center", gap: "var(--space-7)", margin: "0 auto" } },
        items.map(function (it) {
          var on = it === p.active;
          return h("a", {
            key: it, href: "#",
            onClick: function (e) { e.preventDefault(); p.onSelect && p.onSelect(it); },
            style: { font: "var(--type-nav)", letterSpacing: "var(--ls-nav)", color: on ? "var(--forest-600)" : "var(--ink-800)", fontWeight: on ? "var(--fw-semibold)" : "var(--fw-medium)", whiteSpace: "nowrap" },
          }, it);
        })
      ),
      h("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-3)" } },
        h(IconCircle, { icon: "phone", tone: "sage", size: 40 }),
        h("div", { style: { display: "flex", flexDirection: "column", lineHeight: 1.25 } },
          h("span", { style: { font: "var(--type-small)", fontSize: "var(--fs-caption)", color: "var(--text-muted)" } }, p.phoneLabel || "Speak With An Expert"),
          h("span", { style: { font: "var(--type-small)", fontWeight: "var(--fw-semibold)", color: "var(--ink-900)" } }, p.phone || "+1 646 555 0198")
        )
      )
    );
  }

  /* ---------------- navigation/ScrollCue ---------------- */
  function ScrollCue(p) {
    p = p || {};
    return h("button", {
      type: "button", "aria-label": "Scroll to content", onClick: p.onClick,
      style: Object.assign({
        width: 48, height: 48, display: "grid", placeItems: "center",
        background: "var(--white)", color: "var(--forest-800)",
        border: "1px solid var(--border-card)", borderRadius: "var(--radius-tile)",
        boxShadow: "var(--shadow-card)", cursor: "pointer",
        transition: "var(--transition-hover), transform var(--dur-fast) var(--ease-standard)",
      }, p.style),
    }, h("i", { "data-lucide": "arrow-down", style: { width: 18, height: 18 } }));
  }

  Object.assign(NS, {
    Wordmark: Wordmark, Button: Button, ArrowLink: ArrowLink, Pill: Pill, Badge: Badge,
    Card: Card, IconCircle: IconCircle, SectionHeading: SectionHeading, ServiceCard: ServiceCard,
    FeatureItem: FeatureItem, LogoWall: LogoWall, StatStrip: StatStrip, NavBar: NavBar, ScrollCue: ScrollCue,
  });
})();
