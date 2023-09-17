/* eslint-disable react/require-default-props */
import { PropsWithChildren, useEffect, useState } from 'react';
import {
  Bookmark,
  ChevronRight,
  CornerUpLeft,
  FolderPlus,
  Home,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Debug } from '../Debug';
import { Button } from '../ui/button';
import { Folder, useMainStore } from '@/stores/bookmarks';
import { createId } from '@/lib/utils';

function CrumbItem({
  to,
  children,
}: PropsWithChildren<{
  to: string;
}>) {
  return (
    <li className="">
      <Link
        className="inline-flex items-center hover:bg-slate-100/70 text-slate-500 hover:text-slate-700 px-2 py-1 rounded-md transition-colors"
        to={to}
      >
        <span>{children}</span>
      </Link>
    </li>
  );
}

export function MainLayout({
  children,
  loading = false,
}: PropsWithChildren<{ loading?: boolean }>) {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const store = useMainStore();

  const [currentFolder, setCurrentFolder] = useState<Folder | undefined>();
  const [parentFolder, setParentFolder] = useState<Folder | undefined>();
  const [showEllipsis, setShowEllipsis] = useState(false);

  const isFolder = pathname.includes('folders');
  const parentFolderId = currentFolder?.parentFolderId;

  useEffect(() => {
    if (isFolder && id) {
      setCurrentFolder(store.getFolderById(id));
    } else {
      setCurrentFolder(undefined);
    }

    if (isFolder && parentFolderId) {
      setParentFolder(store.getFolderById(parentFolderId));
    } else {
      setParentFolder(undefined);
    }

    if (parentFolder?.parentFolderId) {
      setShowEllipsis(true);
    } else {
      setShowEllipsis(false);
    }
  }, [id, parentFolderId, isFolder, store, parentFolder]);

  function createFolder() {
    store.createFolder({
      id: createId(),
      title: 'New Folder',
      order: store.folders.length,
      parentFolderId: isFolder ? id : undefined,
      createdAt: Date.now(),
    });
  }

  return (
    <div className="">
      {loading ? (
        <div className="flex h-screen w-screen justify-center items-center animate-spin text-4xl">
          <Bookmark />
        </div>
      ) : (
        <>
          {/* <Debug data={location} /> */}
          <header className="relative flex justify-between items-center border-b">
            <ul className="text-sm flex items-center flex-grow">
              {/* <li>
                <Button
                  className="text-slate-400"
                  size="icon"
                  variant="ghost"
                  onClick={() => navigate(-1)}
                >
                  <CornerUpLeft size="18" />
                </Button>
              </li> */}
              <li className="p-1">
                <Button
                  className="text-slate-400"
                  size="icon"
                  variant="ghost"
                  onClick={() => navigate('/')}
                >
                  <Home size="18" />
                </Button>
              </li>
              {showEllipsis && (
                <li className="mx-1 text-slate-400">
                  <MoreHorizontal size="12" />
                </li>
              )}
              {parentFolder && (
                <div className="flex items-center">
                  <CrumbItem to={`/folders/${parentFolder.id}`}>
                    {parentFolder.title}
                  </CrumbItem>
                  <ChevronRight size="12" className="text-slate-400/80" />
                </div>
              )}
              {currentFolder && (
                <CrumbItem to={`/folders/${currentFolder.id}`}>
                  {currentFolder.title}
                </CrumbItem>
              )}
              <div className="flex-1 h-10 draggable-area" />
            </ul>

            <div className="p-1 flex gap-1 text-slate-400">
              <Button
                onClick={() => createFolder()}
                variant="ghost"
                size="icon"
              >
                <FolderPlus size="18" />
              </Button>
              <Button asChild variant="default" size="icon">
                <Link to="/bookmarks/create">
                  <Plus size="18" />
                </Link>
              </Button>
            </div>
          </header>
          <div className="flex-1 overflow-auto">{children}</div>
        </>
      )}
    </div>
  );
}
