import * as React from "react";

export interface Stat {
  value: string;
  label: string;
}

/**
 * A horizontal set of proof figures separated by hairline rules.
 */
export interface StatStripProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: Stat[];
  /** light (default) · dark for forest sections. */
  tone?: "light" | "dark";
}
export declare function StatStrip(props: StatStripProps): JSX.Element;
