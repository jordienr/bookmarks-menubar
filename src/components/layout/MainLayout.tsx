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
import { createId, isURL } from '@/lib/utils';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { CreateBookmarkDialog } from '../dialogs/CreateBookmarkDialog';

function CrumbItem({
  to,
  children,
}: PropsWithChildren<{
  to: string;
}>) {
  return (
    <li className="py-1">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="py-1 px-2 h-auto text-slate-500 text-sm font-normal"
      >
        <Link className="inline-flex items-center" to={to}>
          <span>{children}</span>
        </Link>
      </Button>
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

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<Folder | undefined>();
  const [parentFolder, setParentFolder] = useState<Folder | undefined>();
  const [showEllipsis, setShowEllipsis] = useState(false);

  const isFolder = pathname.includes('folders');
  const parentFolderId = currentFolder?.parentFolderId;

  useEffect(() => {
    window.addEventListener('paste', (e) => {
      const text = e.clipboardData?.getData('text/plain');

      if (!text) return;

      if (isURL(text)) {
        setShowCreateDialog(true);
        store.setPastedURL(text);
      } else {
        console.log('not a url');
      }
    });

    return () => {
      window.removeEventListener('paste', () => {});
    };
  }, [navigate, store, id]);

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
    });
  }

  const crumbInitial = { opacity: 0, x: -6 };
  const crumbAnimate = { opacity: 1, x: 0 };
  const crumbExit = { opacity: 0, x: -6 };
  const crumbTransition = { duration: 0.1 };

  const crumbMotionProps = {
    initial: crumbInitial,
    animate: crumbAnimate,
    exit: crumbExit,
    transition: crumbTransition,
  };

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
            <LayoutGroup>
              <ul className="text-sm flex items-center flex-grow">
                <li className="pl-1 py-1">
                  <Button
                    className="text-slate-400"
                    size="icon"
                    variant="ghost"
                    onClick={() => navigate('/')}
                  >
                    <Home size="18" />
                  </Button>
                </li>
                <AnimatePresence mode="wait">
                  {showEllipsis && (
                    <motion.li
                      layout
                      {...crumbMotionProps}
                      className="mx-1 text-slate-400"
                    >
                      <MoreHorizontal size="12" />
                    </motion.li>
                  )}

                  {parentFolder && (
                    <motion.div
                      layout
                      {...crumbMotionProps}
                      className="flex items-center"
                    >
                      <CrumbItem to={`/folders/${parentFolder.id}`}>
                        {parentFolder.title}
                      </CrumbItem>
                      <ChevronRight size="12" className="text-slate-400/80" />
                    </motion.div>
                  )}

                  {currentFolder && (
                    <motion.div
                      layout
                      {...crumbMotionProps}
                      className="flex items-center"
                    >
                      <CrumbItem to={`/folders/${currentFolder.id}`}>
                        {currentFolder.title}
                      </CrumbItem>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex-1 h-10 draggable-area" />
              </ul>
            </LayoutGroup>

            <div className="p-1 flex gap-1 text-slate-400">
              <Button
                onClick={() => createFolder()}
                variant="ghost"
                size="icon"
              >
                <FolderPlus size="18" />
              </Button>
              <CreateBookmarkDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
              >
                <Button variant="default" size="icon">
                  <Plus size="18" />
                </Button>
              </CreateBookmarkDialog>
            </div>
          </header>
          <div className="flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.1 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
