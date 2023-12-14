import { Button } from '@/components/ui/button';
import { createId, isURL } from '@/lib/utils';
import { useMainStore } from '@/stores/bookmarks';
import { FolderPlus, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FolderItem } from '@/components/FolderItem';
import { BookmarkItem } from '@/components/BookmarkItem';
import { useDraggable } from '@dnd-kit/core';
import { MainLayout } from '@/components/layout/MainLayout';

export function Start() {
  const store = useMainStore();

  return (
    <MainLayout>
      <div className="mt-3 flex flex-col">
        {/* <Debug data={store.bookmarks} /> */}
        {store.getOrphanFolders().map((folder) => (
          <FolderItem key={`folder${folder.id}`} folder={folder} />
        ))}
        <hr className="my-2" />
        {store.getOrphanBookmarks().map((bookmark) => (
          <BookmarkItem key={`bookmark${bookmark.id}`} bookmark={bookmark} />
        ))}

        <Outlet />
        {/* <pre className="border-t bg-black text-white whitespace-pre-wrap">
          {pathname}
        </pre> */}
      </div>
    </MainLayout>
  );
}
