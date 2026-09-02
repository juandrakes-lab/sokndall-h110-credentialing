import * as React from "react";

/**
 * The site header: wordmark, centred nav links, and a "Speak With An Expert" phone
 * block on the right. Transparent over the hero, solid white once scrolled.
 */
export interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
  items?: string[];
  active?: string;
  onSelect?: (item: string) => void;
  phone?: string;
  phoneLabel?: string;
  /** Default true. Set false past ~20px of scroll. */
  transparent?: boolean;
}
export declare function NavBar(props: NavBarProps): JSX.Element;
