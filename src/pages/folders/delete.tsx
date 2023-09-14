import { Debug } from '@/components/Debug';
import { Button } from '@/components/ui/button';
import { useCurrentFolder, useCurrentFolderItems } from '@/lib/hooks';
import { useMainStore } from '@/stores/bookmarks';
import { useNavigate } from 'react-router-dom';

export function DeleteFolder() {
  const currentFolder = useCurrentFolder();
  const currentFolderItems = useCurrentFolderItems();
  const store = useMainStore();
  const navigate = useNavigate();

  if (!currentFolder) {
    navigate('/');
    return null;
  }

  if (currentFolderItems.length === 0) {
    store.removeFolder(currentFolder);
    navigate('/');
  }

  return (
    <div className="py-32 text-center flex flex-col">
      <h1 className="text-lg font-medium">
        The folder {currentFolder?.title} has {currentFolderItems.length} items
      </h1>
      <p>Are you sure you want to delete it?</p>
      <div className="px-8 flex flex-col gap-1 mt-8">
        <Button variant="ghost">No, cancel</Button>
        <Button variant="destructive">Yes, delete</Button>
      </div>
    </div>
  );
}
