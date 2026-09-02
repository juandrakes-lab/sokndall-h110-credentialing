import * as React from "react";

/**
 * Circular icon holder used at the top of a ServiceCard and in the NavBar phone
 * affordance. White disc, forest line icon, by default.
 */
export interface IconCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lucide icon name, or a node. */
  icon: string | React.ReactNode;
  /** white (default) · sage · gold · forest. */
  tone?: "white" | "sage" | "gold" | "forest";
  /** Diameter in px. Default 56. */
  size?: number;
}
export declare function IconCircle(props: IconCircleProps): JSX.Element;
