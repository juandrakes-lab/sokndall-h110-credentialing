import * as React from "react";

/**
 * Client-proof row: a caption line over a set of partner names in muted type.
 * Names render as text — no logo image files ship with this system.
 */
export interface LogoWallProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Caption above the row. */
  caption?: string;
  /** Partner names. */
  names?: string[];
  /** light (default) · dark for forest sections. */
  tone?: "light" | "dark";
}
export declare function LogoWall(props: LogoWallProps): JSX.Element;
