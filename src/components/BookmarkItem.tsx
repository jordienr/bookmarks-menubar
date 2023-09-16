import { getFaviconURL, prettyURL } from '@/lib/utils';
import { Bookmark, useMainStore } from '@/stores/bookmarks';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { GripVertical, MoreVertical } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';

export function BookmarkItem({ bookmark }: { bookmark: Bookmark }) {
  const store = useMainStore();

  const { transform, setNodeRef, attributes, listeners, isDragging } =
    useDraggable({
      id: bookmark.id,
      data: {
        type: 'bookmark',
      },
    });

  const transformStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const isDraggingStyle = isDragging
    ? {
        opacity: 1,
        background: 'white',
        outline: '1px solid #f3f3f3',
        borderRadius: '0.5rem',
      }
    : undefined;

  const style = {
    ...transformStyle,
    ...isDraggingStyle,
  };

  function handleDelete() {
    store.removeBookmark(bookmark);
  }

  return (
    <div
      style={style}
      ref={setNodeRef}
      className="group flex py-1 hover:bg-slate-50 px-3 text-left"
    >
      <button type="button" className="flex text-left flex-grow">
        <div className="pt-0.5 min-w-fit">
          <img
            width="24"
            height="24"
            alt=""
            className="inline-block mr-2 rounded-full"
            src={getFaviconURL(bookmark.url)}
          />
        </div>
        <div className="flex flex-col flex-grow">
          <span>{bookmark.title}</span>
          <span className="text-xs tracking-tighter text-ellipsis truncate max-w-[320px] font-mono text-gray-400">
            {prettyURL(bookmark.url)}
          </span>
        </div>
      </button>
      <div className="ml-auto flex items-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="opacity-0 group-hover:opacity-100 focus-within:opacity-100"
          >
            <Button size="icon" variant="ghost">
              <MoreVertical size="18" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2">
            <DropdownMenuItem asChild>
              <Link to={`/bookmarks/${bookmark.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete()}>
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="icon" variant="ghost" {...listeners} {...attributes}>
          <GripVertical size="18" />
        </Button>
      </div>
    </div>
  );
}