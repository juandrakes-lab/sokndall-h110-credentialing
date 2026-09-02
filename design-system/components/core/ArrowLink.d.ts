import * as React from "react";

/**
 * "Learn More ↗" onward link — underlined label with a ↗ that slides 3px right on
 * hover. The arrow is the Unicode glyph, not an icon.
 */
export interface ArrowLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Default "semibold". */
  weight?: "semibold" | "medium";
  /** onDark = white text for use on forest sections. Default "default". */
  tone?: "default" | "onDark";
  /** Font-size override. */
  size?: string;
}
export declare function ArrowLink(props: ArrowLinkProps): JSX.Element;
