import { BookmarkItem } from '@/components/BookmarkItem';
import { Debug } from '@/components/Debug';
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
    <div>
      <input
        className="text-xl px-3 py-2"
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

      {bookmarks.map((bookmark) => (
        <div>
          <BookmarkItem bookmark={bookmark} />
        </div>
      ))}
    </div>
  );
}
