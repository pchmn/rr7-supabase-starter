import { Button } from '@rr7-supabase-starter/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rr7-supabase-starter/ui/dialog';
import { useTranslation } from 'react-i18next';

export interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  onOpenChange: (open: boolean) => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  loading,
  onOpenChange,
  destructive,
}: ConfirmModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closable={!loading}
        onInteractOutside={(e) => {
          if (loading) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (loading) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{title || t('confirmModal.title')}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {description || t('confirmModal.description')}
        </DialogDescription>
        <DialogFooter>
          <Button variant='outline' onClick={onCancel} disabled={loading}>
            {cancelLabel || t('confirmModal.cancelLabel')}
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel || t('confirmModal.confirmLabel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
