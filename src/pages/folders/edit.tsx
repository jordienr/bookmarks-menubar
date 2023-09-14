import { useMainStore } from '@/stores/bookmarks';
import { useLocation, useParams } from 'react-router-dom';

export function EditFolder() {
  const location = useLocation();
  const { id } = useParams();
  const store = useMainStore();

  if (!id) return null;

  const folder = store.getFolderById(id);

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

      {store.getBookmarksByFolderId(id).map((bookmark) => (
        <div>{bookmark.title}</div>
      ))}
    </div>
  );
}
