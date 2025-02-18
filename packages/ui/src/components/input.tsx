import type { PropsWithRef } from '@/lib/props';
import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import { Label } from './label';

const inputVariants = cva(
  'border-input placeholder:text-muted-foreground focus-visible:border-ring/75 focus-visible:bg-accent/45 hover:bg-accent/45 flex h-9 w-full rounded-md border bg-accent/20 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-9 px-3 py-1',
        sm: 'h-7 rounded-md px-2 text-xs',
        lg: 'h-10 rounded-md px-4',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string | React.ReactNode;
  error?: string;
  rightSection?: React.ReactNode;
  leftSection?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = ({
  ref,
  className,
  type,
  label,
  id,
  error,
  leftSection,
  rightSection,
  size,
  clearable,
  onClear,
  readOnly,
  ...props
}: PropsWithRef<InputProps, HTMLInputElement>) => {
  return (
    <div className={cn('grid', label ? className : undefined)}>
      {label && (
        <Label htmlFor={id} className='mb-2'>
          {label}
        </Label>
      )}
      <div className='relative'>
        {leftSection && (
          <div className='text-muted-foreground absolute inset-y-0 left-0 flex items-center justify-center pl-3'>
            {leftSection}
          </div>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({ size, className: label ? undefined : className }),
            error
              ? 'border-destructive hover:border-destructive bg-destructive/10 hover:bg-destructive/10 focus-visible:bg-destructive/10 focus-visible:!border-destructive'
              : undefined,
            leftSection ? 'pl-10' : undefined,
            readOnly
              ? 'opacity-50 focus-visible:border-input focus-visible:bg-accent/20'
              : undefined,
          )}
          ref={ref}
          id={id}
          readOnly={readOnly}
          {...props}
        />
        {rightSection && (
          <div className='absolute inset-y-0 right-0 flex items-center justify-center pr-3'>
            {rightSection}
          </div>
        )}
        {clearable && (
          <div className='absolute inset-y-0 right-0 flex items-center justify-center pr-3'>
            <ClearIcon onClick={onClear} />
          </div>
        )}
      </div>

      {error && (
        <span className='animate-in slide-in-from-top text-destructive mt-1 text-[0.8rem] font-medium'>
          {error}
        </span>
      )}
    </div>
  );
};
Input.displayName = 'Input';

const ClearIcon = ({
  className,
  ...props
}: React.HTMLAttributes<SVGElement>) => {
  return (
    <svg
      role='graphics-symbol'
      viewBox='0 0 16 16'
      className={cn(
        'h-4 w-4 cursor-pointer fill-black/40 dark:fill-white/40',
        className,
      )}
      {...props}
    >
      <path d='M7.993 15.528a7.273 7.273 0 01-2.923-.593A7.633 7.633 0 012.653 13.3a7.797 7.797 0 01-1.633-2.417 7.273 7.273 0 01-.593-2.922c0-1.035.198-2.01.593-2.922A7.758 7.758 0 015.063.99 7.273 7.273 0 017.985.395a7.29 7.29 0 012.93.593 7.733 7.733 0 012.417 1.64 7.647 7.647 0 011.64 2.41c.396.914.594 1.888.594 2.923 0 1.035-.198 2.01-.593 2.922a7.735 7.735 0 01-4.058 4.05 7.272 7.272 0 01-2.922.594zM5.59 11.06c.2 0 .371-.066.513-.198L8 8.951l1.904 1.911a.675.675 0 00.498.198.667.667 0 00.491-.198.67.67 0 00.205-.49.64.64 0 00-.205-.491L8.981 7.969l1.92-1.911a.686.686 0 00.204-.491.646.646 0 00-.205-.484.646.646 0 00-.483-.205.67.67 0 00-.49.205L8 6.995 6.081 5.083a.696.696 0 00-.49-.19.682.682 0 00-.491.198.651.651 0 00-.198.49c0 .181.068.342.205.484l1.912 1.904-1.912 1.92a.646.646 0 00-.205.483c0 .19.066.354.198.49.136.132.3.198.49.198z' />
    </svg>
  );
};

export { Input };
