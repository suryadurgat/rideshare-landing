import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-[transform,background-color,color,box-shadow,border-color] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-fg shadow-[0_1px_0_rgba(255,255,255,0.18)_inset] hover:bg-primary-hover",
        solid:
          "bg-paper text-ink hover:bg-cream",
        ghost:
          "bg-ink/25 text-on-dark ring-1 ring-on-dark/35 backdrop-blur-sm hover:bg-ink/40",
        outline:
          "bg-transparent text-ink ring-1 ring-ink/12 hover:bg-paper-2",
        dark: "bg-ink text-on-dark hover:bg-navy",
        footer:
          "bg-paper text-ink hover:bg-cream",
      },
      size: {
        md: "h-11 rounded-pill px-5 text-sm",
        lg: "h-12 rounded-pill px-6 text-[0.95rem]",
        xl: "h-13 rounded-pill px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export { buttonVariants };
