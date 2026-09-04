import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

/**
 * @typedef {import('react').ButtonHTMLAttributes<HTMLButtonElement> & {
 *   variant?: "primary" | "ghost";
 *   asChild?: boolean;
 * }} ButtonProps
 */

/** @type {import('react').ForwardRefExoticComponent<ButtonProps & import('react').RefAttributes<HTMLButtonElement>>} */
const Button = forwardRef(function Button(
  { variant = "primary", asChild = false, className = "", children, disabled, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : "button";

  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-sans font-bold uppercase tracking-wide transition-[background-color,transform,box-shadow] duration-150 focus-visible:outline-none focus-visible:shadow-focus";

  /** @type {Record<string, string>} */
  const variants = {
    primary: [
      "bg-accent-500 text-text-on-accent",
      "hover:bg-accent-600 hover:-translate-y-[2px]",
      "active:translate-y-0",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
    ].join(" "),
    ghost: [
      "bg-transparent text-text-2 border border-hairline",
      "hover:bg-surface-3 hover:text-text-1",
      "disabled:opacity-50 disabled:cursor-not-allowed",
    ].join(" "),
  };

  return (
    <Comp
      ref={ref}
      className={[base, variants[variant], className].filter(Boolean).join(" ")}
      disabled={disabled}
      {...rest}
    >
      {children}
    </Comp>
  );
});

export default Button;
