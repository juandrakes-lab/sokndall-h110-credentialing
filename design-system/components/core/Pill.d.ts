import * as React from "react";

/**
 * Eyebrow chip: a fully-rounded sage capsule with a single leading emoji or icon,
 * used above headings. Title or sentence case — never uppercase.
 */
export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** A single emoji string or a small icon node, shown before the label. */
  icon?: React.ReactNode;
  /** sage = on light surfaces (default) · dark = translucent white, for forest sections. */
  tone?: "sage" | "dark";
}
export declare function Pill(props: PillProps): JSX.Element;
