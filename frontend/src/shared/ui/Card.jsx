import { forwardRef } from "react";

/**
 * @typedef {import('react').HTMLAttributes<HTMLDivElement> & {
 *   hoverable?: boolean;
 * }} CardProps
 */

/** @type {import('react').ForwardRefExoticComponent<CardProps & import('react').RefAttributes<HTMLDivElement>>} */
const Card = forwardRef(function Card(
  { hoverable = false, className = "", children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={[
        "rounded-md border border-hairline bg-surface-1 p-4 shadow-e1",
        hoverable &&
          "transition-[box-shadow,transform] duration-150 hover:shadow-e2 hover:-translate-y-[2px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
});

export default Card;
