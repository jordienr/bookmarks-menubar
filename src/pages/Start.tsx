import { Debug } from '@/components/Debug';
import { Button } from '@/components/ui/button';
import { createId, getFaviconURL, isURL } from '@/lib/utils';
import { useMainStore } from '@/stores/bookmarks';
import {
  Folder,
  FolderPlus,
  MoreVertical,
  Pencil,
  Plus,
  Thermometer,
  Trash,
} from 'lucide-react';
import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  function handleDelete(bookmark: any) {
    store.removeBookmark(bookmark);
  }

  function createFolder() {
    store.createFolder({
      id: createId(),
      title: 'New Folder',
      order: store.folders.length,
    });
  }

  return (
    <div className="text-sm">
      <div className="flex justify-between items-center border-b">
        <h1 className="draggable-area flex-grow px-3 py-1">Bookmarks</h1>
        <div className="pr-3 py-1 flex gap-1">
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
          <Link
            to={`/folders/${folder.id}`}
            key={folder.id}
            className="group flex py-1 gap-2 hover:bg-slate-50 px-3 items-center"
          >
            <div className="px-1">
              <Folder size="18" />
            </div>
            <div>
              <span>{folder.title}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="ml-auto opacity-0 group-hover:opacity-100 transition-all"
              >
                <Button size="icon" variant="ghost" className="text-slate-400">
                  <MoreVertical size="18" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-2">
                <DropdownMenuItem asChild>
                  <Link to={`/folders/${folder.id}/edit`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/folders/${folder.id}/delete`}>Delete</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Link>
        ))}
        {store.getOrphanBookmarks().map((bookmark) => (
          <Link
            target="_blank"
            to={bookmark.url}
            key={bookmark.id}
            className="group flex py-1 hover:bg-slate-50 px-3"
          >
            <div className="pt-0.5">
              <img
                width="24"
                height="24"
                alt=""
                className="inline-block mr-2 rounded-full"
                src={getFaviconURL(bookmark.url)}
              />
            </div>
            <div className="flex flex-col">
              <span>{bookmark.title}</span>
              <span className="text-xs tracking-tighter font-mono text-gray-400">
                {bookmark.url}
              </span>
            </div>
            <div className="ml-auto flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="opacity-0 group-hover:opacity-100 focus-within:opacity-100"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-slate-400"
                  >
                    <MoreVertical size="18" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-2">
                  <DropdownMenuItem asChild>
                    <Link to={`/bookmarks/${bookmark.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(bookmark)}>
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Link>
        ))}

        <Outlet />
        <pre className="border-t bg-black text-white whitespace-pre-wrap">
          {pathname}
        </pre>
      </div>
    </div>
  );
}
