import type { PropsWithRef } from '@/lib/props';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-accent/20 hover:bg-accent/45 shadow-sm',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        tertiary:
          'bg-tertiary text-tertiary-foreground shadow-sm hover:bg-tertiary/80',
        ghost: 'hover:bg-accent',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        xs: 'h-7 rounded-sm px-2 text-xs',
        sm: 'h-8 rounded-sm px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = ({
  ref,
  className,
  variant,
  size,
  asChild = false,
  children,
  disabled,
  loading,
  ...props
}: PropsWithRef<ButtonProps, HTMLButtonElement>) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <svg
          viewBox='0 0 28 28'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='h-4 w-4 animate-spin'
        >
          <path
            d='M23.748 7C25.1654 8.97024 26.0001 11.3876 26.0001 14C26.0001 16.3053 25.3501 18.4587 24.2233 20.2871'
            stroke='currentColor'
            strokeWidth='3'
            strokeLinecap='round'
          />
          <path
            d='M18.8034 3C17.3326 2.35683 15.708 2 14 2C7.37258 2 2 7.37258 2 14C2 20.6274 7.37258 26 14 26C16.1094 26 18.0916 25.4557 19.814 24.5'
            stroke='currentColor'
            strokeOpacity='0.4'
            strokeWidth='3'
            strokeLinecap='round'
          />
        </svg>
      )}
      {children}
    </Comp>
  );
};
Button.displayName = 'Button';

export { Button, buttonVariants };
