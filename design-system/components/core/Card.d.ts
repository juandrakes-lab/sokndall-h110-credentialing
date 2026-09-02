import * as React from "react";

/**
 * The container behind every piece of content. White with a hairline and a soft
 * 16px corner; `tone="dark"` is the forest surface used for the services row.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds a 3px lift and deeper shadow on hover. Default false. */
  interactive?: boolean;
  /** Default "card". "float" for cards overlapping imagery; "panel" for wide strips. */
  elevation?: "none" | "card" | "panel" | "float";
  /** light = white (default) · dark = forest-card surface for use on forest sections. */
  tone?: "light" | "dark";
  /** Padding override; defaults to --card-pad (28px). */
  pad?: string;
}
export declare function Card(props: CardProps): JSX.Element;
