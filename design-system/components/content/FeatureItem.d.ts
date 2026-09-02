import * as React from "react";

/**
 * A single checked proof line, used in a short vertical list beside a heading.
 * Render inside a <ul> with `padding:0`.
 */
export interface FeatureItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** light (default) · dark for forest sections. */
  tone?: "light" | "dark";
}
export declare function FeatureItem(props: FeatureItemProps): JSX.Element;
