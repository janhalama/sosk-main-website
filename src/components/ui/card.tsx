// Card primitives for consistent surface presentation: Card, CardHeader, CardTitle,
// CardDescription, CardContent, CardFooter. Matches theme tokens and spacing rules.

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Container for content blocks with border, radius, and subtle shadow.
 */
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function Card({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("bg-bg border border-border rounded-lg shadow-sm", className)}
        {...props}
      />
    );
  }
);

/**
 * Header area for titles and actions within a Card.
 */
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardHeader({ className, ...props }, ref) {
  return <div ref={ref} className={cn("p-4 md:p-6", className)} {...props} />;
});

/**
 * Title text for Card headers.
 */
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(function CardTitle({ className, ...props }, ref) {
  return (
    <h3
      ref={ref}
      className={cn("text-xl font-semibold leading-tight tracking-tight", className)}
      {...props}
    />
  );
});

/**
 * Optional description text under the Card title.
 */
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return (
    <p ref={ref} className={cn("text-sm text-muted", className)} {...props} />
  );
});

/**
 * Main content area of the Card.
 */
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardContent({ className, ...props }, ref) {
  return <div ref={ref} className={cn("p-4 md:p-6 pt-0", className)} {...props} />;
});

/**
 * Footer area for actions or metadata within the Card.
 */
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardFooter({ className, ...props }, ref) {
  return (
    <div ref={ref} className={cn("p-4 md:p-6 pt-0", className)} {...props} />
  );
});


