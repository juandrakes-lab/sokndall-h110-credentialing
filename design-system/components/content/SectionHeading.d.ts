import * as React from "react";

/**
 * The heading block that opens a section: a Pill eyebrow, a single-colour display
 * headline, and an optional supporting sentence.
 */
export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Eyebrow label text. Omit to drop the Pill. */
  eyebrow?: string;
  /** Emoji or icon node for the eyebrow Pill. */
  eyebrowIcon?: React.ReactNode;
  title: string;
  description?: string;
  /** "h2" (default) or "display" for the hero. */
  size?: "h2" | "display";
  align?: "left" | "center";
  /** light (default) · dark for forest sections. */
  tone?: "light" | "dark";
}
export declare function SectionHeading(props: SectionHeadingProps): JSX.Element;
