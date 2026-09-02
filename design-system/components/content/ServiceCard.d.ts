import * as React from "react";

/**
 * The service tile from the "Comprehensive Accounting Solutions" grid: a circular
 * icon beside the title, one sentence of copy, and a Learn More link.
 */
export interface ServiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lucide icon name or node. */
  icon: string | React.ReactNode;
  title: string;
  body: string;
  /** Pass "" to drop the link. Default "Learn More". */
  linkLabel?: string;
  href?: string;
  /** dark = forest surface (default, as in the comp) · light = white card. */
  tone?: "dark" | "light";
}
export declare function ServiceCard(props: ServiceCardProps): JSX.Element;
