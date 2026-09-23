import Link from "next/link";
import { NAV_LINKS } from "@/components/neo/neoData";
import Logo from "@/components/brand/Logo";
import NavAccess from "@/components/neo/NavAccess";

export function Brand() {
  return (
    <Link href="/" className="sk-nav__brand">
      <Logo className="sk-nav__logo" />
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
      <NavAccess />
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
