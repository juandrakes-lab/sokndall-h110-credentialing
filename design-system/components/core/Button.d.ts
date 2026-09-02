import * as React from "react";

/**
 * The system's action control: near-square 6px corners, semibold label, no
 * uppercase. Every CTA in the reference carries a trailing ↗ in an inset square —
 * set `arrow` to reproduce it.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = forest fill (default) · gold = amber fill, the one high-emphasis action · outline = hairline on transparent · ghost = text only · onDark = white fill for use on forest sections. */
  variant?: "primary" | "gold" | "outline" | "ghost" | "onDark";
  /** Default "md". */
  size?: "sm" | "md" | "lg";
  /** Render the trailing ↗ chip. Default false. */
  arrow?: boolean;
  /** Node before the label — a 16px line icon. */
  iconLeft?: React.ReactNode;
  /** Node after the label, before the arrow chip. */
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  /** Render as another element, e.g. "a". Default "button". */
  as?: "button" | "a";
}
export declare function Button(props: ButtonProps): JSX.Element;
