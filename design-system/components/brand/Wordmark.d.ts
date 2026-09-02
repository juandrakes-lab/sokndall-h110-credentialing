import * as React from "react";

/**
 * The Sokndall name set as a wordmark. Use anywhere a logo would go — this system
 * ships no logo file. Always uppercase; never letterspace it further or pair it
 * with a drawn mark.
 */
export interface WordmarkProps extends React.HTMLAttributes<HTMLElement> {
  /** Rendered font-size in px. Default 22. */
  size?: number;
  /** Explicit CSS color; overrides `tone`. */
  color?: string;
  /** ink = near-black (default) · inverse = white (dark footers) · accent = forest green. */
  tone?: "ink" | "inverse" | "accent";
  /** Element to render. Default "span". */
  as?: "span" | "a" | "div";
}
export declare function Wordmark(props: WordmarkProps): JSX.Element;
