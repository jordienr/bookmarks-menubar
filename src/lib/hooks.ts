import { useMainStore } from '@/stores/bookmarks';
import { useParams } from 'react-router-dom';

export function useCurrentFolder() {
  const store = useMainStore();
  const { id } = useParams();

  if (!id) {
    return null;
  }

  const folder = store.getFolderById(id);

  return folder;
}

export function useCurrentFolderItems() {
  const folder = useCurrentFolder();
  const store = useMainStore();

  if (!folder) {
    return [];
  }

  const items = store.getBookmarksByFolderId(folder.id);

  return items;
}
