import { Folder } from '@/stores/bookmarks';
import { Folder as FolderIcon, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { useDraggable } from '@dnd-kit/core';

export function FolderItem({ folder }: { folder: Folder }) {
  const { transform, setNodeRef, attributes, listeners, isDragging } =
    useDraggable({
      id: folder.id,
    });
  const transformStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const isDraggingStyle = isDragging
    ? {
        opacity: 0.9,
        boxShadow: '0 4px 12px -2px #0000001a',
        maxWidth: 'calc(100% - 4rem)',
        outline: '1px solid #38bdf8',
      }
    : undefined;

  const style = {
    ...transformStyle,
    ...isDraggingStyle,
  };

  return (
    <Link
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      to={`/folders/${folder.id}`}
      style={style}
      key={folder.id}
      className="group flex py-1 gap-2 hover:bg-slate-50 px-3 items-center"
    >
      <div className="px-1">
        <FolderIcon size="18" />
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
  );
}
