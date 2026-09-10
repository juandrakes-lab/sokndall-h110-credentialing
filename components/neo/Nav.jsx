import Link from "next/link";
import { NAV_LINKS, TRIAL_HREF } from "@/components/neo/neoData";
import { Wordmark, IconArrowUpRight } from "@/components/neo/icons";

export function Brand() {
  return (
    <Link href="/" className="sk-nav__brand">
      <Wordmark className="sk-nav__mark" />
      sokndall
    </Link>
  );
}

export function NavLinks({ current }) {
  return (
    <>
      <nav className="sk-nav__links" aria-label="Main">
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} aria-current={current === l.href ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
      </nav>
      <Link href={TRIAL_HREF} className="sk-nav__cta">
        Start free trial
        <IconArrowUpRight className="sk-arr-ico" />
      </Link>
    </>
  );
}

/** The link row as a scrollable strip, for viewports too narrow to hold it in
 *  the nav bar. Without it those routes are unreachable until the footer. */
export function NavMobile({ current }) {
  return (
    <nav className="sk-navm" aria-label="Sections">
      {NAV_LINKS.map((l) => (
        <Link key={l.href} href={l.href} aria-current={current === l.href ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

/** The bar itself. `variant="dark"` is the one that rides on the ink hero
 *  band and expects a `.sk-wrap` around it; the default light bar carries its
 *  own measure. */
export function NavBar({ current, variant = "light" }) {
  return (
    <header className={`sk-nav sk-nav--${variant}`}>
      <Brand />
      <NavLinks current={current} />
    </header>
  );
}

export default function Nav({ current }) {
  return (
    <>
      <NavBar current={current} />
      <NavMobile current={current} />
    </>
  );
}
