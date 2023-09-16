import { Folder } from '@/stores/bookmarks';
import { Folder as FolderIcon, GripVertical, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { useDraggable, useDroppable } from '@dnd-kit/core';

export function FolderItem({ folder }: { folder: Folder }) {
  const { transform, setNodeRef, attributes, listeners, isDragging } =
    useDraggable({
      id: folder.id,
      data: {
        type: 'folder',
      },
    });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: folder.id,
  });

  const isOverStyle = isOver
    ? { backgroundColor: '#f3f3f3', outline: '1px solid #f3f3f3' }
    : undefined;

  const transformStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const isDraggingStyle = isDragging
    ? {
        opacity: 0.9,
        boxShadow: '0 4px 12px -2px #0000001a',
        outline: '1px solid #38bdf8',
      }
    : undefined;

  const style = {
    ...isOverStyle,
    ...transformStyle,
    ...isDraggingStyle,
  };

  return (
    <span ref={setDroppableRef} onDrop={(e) => console.log(e)}>
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
        <Button size="icon" variant="ghost">
          <GripVertical size="18" />
        </Button>
      </Link>
    </span>
  );
}
