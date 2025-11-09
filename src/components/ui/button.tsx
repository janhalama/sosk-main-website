// Button component with shadcn-style variants (primary, secondary, ghost).
// Uses Radix Slot for `asChild` composition and Tailwind tokens mapped from our theme.

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-700",
        secondary:
          "bg-surface-alt text-foreground border border-border hover:bg-surface active:bg-surface",
        ghost:
          "bg-transparent text-foreground hover:bg-surface active:bg-surface",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-11 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * Renders a styled button. Supports `variant` (primary, secondary, ghost) and
 * `size` (sm, md, lg). Set `asChild` to render the button styles on a child element.
 */
export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}


