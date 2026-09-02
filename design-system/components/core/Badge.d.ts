import * as React from "react";

/**
 * Compact inline label for status or category. Smaller and plainer than <Pill>,
 * with no icon.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** sage (default) · gold · forest · neutral · onDark. */
  tone?: "sage" | "gold" | "forest" | "neutral" | "onDark";
}
export declare function Badge(props: BadgeProps): JSX.Element;
