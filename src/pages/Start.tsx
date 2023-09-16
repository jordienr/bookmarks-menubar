import { Button } from '@/components/ui/button';
import { createId, isURL } from '@/lib/utils';
import { useMainStore } from '@/stores/bookmarks';
import { FolderPlus, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FolderItem } from '@/components/FolderItem';
import { BookmarkItem } from '@/components/BookmarkItem';
import { useDraggable } from '@dnd-kit/core';

export function Start() {
  const store = useMainStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    console.log(window);

    // on cmd v

    window.addEventListener('paste', (e) => {
      const text = e.clipboardData?.getData('text/plain');

      if (!text) return;

      if (isURL(text)) {
        store.setPastedURL(text);
        navigate('/bookmarks/create');
      } else {
        console.log('not a url');
      }
    });

    return window.removeEventListener('paste', () => {});
  }, [navigate, store]);

  function createFolder() {
    store.createFolder({
      id: createId(),
      title: 'New Folder',
      order: store.folders.length,
    });
  }

  return (
    <div className="text-sm overflow-x-hidden">
      <div className="flex justify-between items-center border-b">
        <h1 className="draggable-area flex-grow px-3 py-1">Bookmarks</h1>
        <div className="pr-1 py-1 flex gap-1 text-slate-400">
          <Button onClick={() => createFolder()} variant="ghost" size="icon">
            <FolderPlus size="20" />
          </Button>
          <Button variant="ghost" size="icon">
            <Link to="/bookmarks/create">
              <Plus size="20" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-3 flex flex-col">
        {/* <Debug data={store.bookmarks} /> */}
        {store.folders.map((folder) => (
          <FolderItem key={folder.id} folder={folder} />
        ))}
        {store.getOrphanBookmarks().map((bookmark) => (
          <BookmarkItem key={bookmark.id} bookmark={bookmark} />
        ))}

        <Outlet />
        {/* <pre className="border-t bg-black text-white whitespace-pre-wrap">
          {pathname}
        </pre> */}
      </div>
    </div>
  );
}
