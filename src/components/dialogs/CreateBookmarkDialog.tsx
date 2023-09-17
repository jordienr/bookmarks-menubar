import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateBookmark } from '@/pages/bookmarks/create';
import { PropsWithChildren } from 'react';

export function CreateBookmarkDialog({
  children,
  open,
  onOpenChange,
}: PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xs rounded-lg">
        <DialogHeader>
          <DialogTitle>Add a bookmark</DialogTitle>
        </DialogHeader>
        <CreateBookmark
          onCreate={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
