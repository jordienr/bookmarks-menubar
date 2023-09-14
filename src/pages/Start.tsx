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

  return (
    <div className="text-sm">
      <div className="flex justify-between items-center border-b">
        <h1 className="draggable-area flex-grow px-3 py-1">Bookmarks</h1>
        <div className="pr-3 py-1">
          <Button variant="ghost" size="icon">
            <Link to="/bookmarks/create">
              <Plus size="20" />
            </Link>
          </Button>
        </div>
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
              <span className="text-xs tracking-tighter font-mono text-gray-400">
                {bookmark.url}
              </span>
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
