import { Button, type ButtonProps } from '@rr7-supabase-starter/ui/button';
import { useState } from 'react';
import { ConfirmModal, type ConfirmModalProps } from './ConfirmModal';

interface ConfirmButtonProps extends ButtonProps {
  onConfirm: (() => Promise<void>) | (() => void);
  onCancel?: () => void;
  modalProps?: Omit<
    ConfirmModalProps,
    'open' | 'onOpenChange' | 'loading' | 'onConfirm' | 'onCancel'
  >;
}

export function ConfirmButton({
  disabled,
  children,
  onConfirm,
  onCancel,
  modalProps,
  ...props
}: ConfirmButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={loading || disabled}
        {...props}
      >
        {children}
      </Button>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title={modalProps?.title}
        description={modalProps?.description}
        confirmLabel={modalProps?.confirmLabel}
        cancelLabel={modalProps?.cancelLabel}
        destructive={modalProps?.destructive}
        loading={loading}
        onConfirm={async () => {
          setLoading(true);
          await onConfirm();
          setLoading(false);
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
          onCancel?.();
        }}
      />
    </>
  );
}
