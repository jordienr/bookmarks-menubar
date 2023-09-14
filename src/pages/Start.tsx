import { Debug } from '@/components/Debug';
import { Button } from '@/components/ui/button';
import { getFaviconURL, isURL } from '@/lib/utils';
import { useMainStore } from '@/stores/bookmarks';
import { MoreVertical, Pencil, Plus, Thermometer, Trash } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings } from './Settings';

export function Start() {
  const store = useMainStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(window);
    window.electron.ipcRenderer.on('paste', (e: unknown) => {
      console.log(e);
      if (typeof e !== 'string') return;
      if (isURL(e)) {
        store.setPastedURL(e);
        navigate('/bookmarks/create');
      }
    });
  }, [navigate, store]);

  function handleDelete(bookmark: any) {
    store.removeBookmark(bookmark);
  }

  return (
    <div className="text-sm">
      <div className="flex px-3 py-1 justify-between items-center border-b">
        <h1 className="draggable-area">Bookmarks</h1>
        <Button variant="ghost" size="icon">
          <Link to="/bookmarks/create">
            <Plus size="20" />
          </Link>
        </Button>
      </div>
      <div className="mt-3 flex flex-col gap-1">
        {/* <Debug data={store.bookmarks} /> */}
        {store.bookmarks.map((bookmark) => (
          <Link
            target="_blank"
            to={bookmark.url}
            key={bookmark.id}
            className="flex py-1 hover:bg-slate-50 px-3"
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
              <span className="text-sm text-gray-400">{bookmark.url}</span>
            </div>
            <div className="ml-auto flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-slate-400"
                  >
                    <MoreVertical size="18" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-2">
                  <DropdownMenuItem>
                    <Link to={`/bookmarks/${bookmark.id}`}>Edit</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(bookmark)}>
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}