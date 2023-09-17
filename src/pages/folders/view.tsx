import { BookmarkItem } from '@/components/BookmarkItem';
import { Debug } from '@/components/Debug';
import { FolderItem } from '@/components/FolderItem';
import { MainLayout } from '@/components/layout/MainLayout';
import { useMainStore } from '@/stores/bookmarks';
import { useLocation, useParams } from 'react-router-dom';

export function ViewFolder() {
  const location = useLocation();
  const { id } = useParams();
  const store = useMainStore();

  if (!id) return null;

  const folder = store.getFolderById(id);
  const bookmarks = store.getBookmarksByFolderId(id);

  if (!folder) return null;

  return (
    <MainLayout>
      <input
        className="text-lg px-3 py-2 w-full font-medium"
        type="text"
        name="title"
        id="title"
        value={folder?.title}
        onChange={(e) =>
          store.updateFolder({
            ...folder,
            title: e.target.value,
          })
        }
      />

      {store.getFoldersByFolderId(id).map((f) => (
        <div>
          <FolderItem folder={f} />
        </div>
      ))}

      {bookmarks.map((bookmark) => (
        <div>
          <BookmarkItem bookmark={bookmark} />
        </div>
      ))}
    </MainLayout>
  );
}
