/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

const baseClasses =
  "inline-flex items-center justify-center rounded-[10px] px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green disabled:opacity-50";

const Button = forwardRef(function Button({ asChild = false, className = "", ...props }, ref) {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={`${baseClasses} ${className}`} {...props} />;
});

export default Button;
