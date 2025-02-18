import { Button } from '@rr7-supabase-starter/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rr7-supabase-starter/ui/dialog';

export const areYouSure = () => {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your
          account and all your data.
        </DialogDescription>
        <DialogFooter>
          <Button variant='destructive'>Delete account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
