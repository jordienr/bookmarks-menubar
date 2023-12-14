/* eslint-disable react/require-default-props */
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import {
  Bookmark,
  ChevronRight,
  CornerUpLeft,
  FolderPlus,
  Home,
  Menu,
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
import { toast } from 'sonner';

function CrumbItem({
  to,
  children,
  active,
}: PropsWithChildren<{
  to: string;
  active: boolean;
}>) {
  return (
    <li className="py-1">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className={`py-1 px-2 h-auto text-sm font-normal ${
          active ? 'text-slate-600' : 'text-slate-500/80'
        }`}
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
  const { id: currentFolderId } = useParams();
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
    window.addEventListener('focus', (e) => {
      // check if clipboard has url
      // if so, show dialog

      window.navigator?.clipboard?.readText().then((text) => {
        if (!text) return;
        if (isURL(text)) {
          toast('URL detected in clipboard', {
            action: {
              label: 'Add bookmark',
              onClick: () => {
                store.setPastedURL(text);
                setShowCreateDialog(true);
              },
            },
          });
        }
        return false;
      });
    });

    window.addEventListener('blur', (e) => {
      // remove focus event listener when focus is lost
      toast.dismiss();
      window.removeEventListener('focus', () => {});
    });

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
      window.removeEventListener('focus', () => {});
      window.removeEventListener('blur', () => {});
    };
  }, [navigate, store, currentFolderId]);

  useEffect(() => {
    if (isFolder && currentFolderId) {
      setCurrentFolder(store.getFolderById(currentFolderId));
    } else {
      setCurrentFolder(undefined);
    }

    if (parentFolderId && isFolder) {
      setParentFolder(store.getFolderById(parentFolderId));
    } else {
      setParentFolder(undefined);
    }

    if (parentFolder?.parentFolderId) {
      setShowEllipsis(true);
    } else {
      setShowEllipsis(false);
    }
  }, [currentFolderId, parentFolderId, isFolder, store, parentFolder]);

  function createFolder() {
    store.createFolder({
      id: createId(),
      title: 'New Folder',
      order: store.folders.length,
      parentFolderId: isFolder ? currentFolderId : undefined,
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
    <div className="text-sm">
      {loading ? (
        <div className="flex h-screen w-screen justify-center items-center animate-spin text-4xl">
          <Bookmark />
        </div>
      ) : (
        <>
          {/* <Debug data={location} /> */}
          <header className="flex justify-between items-center border-b sticky top-0 left-0 right-0 bg-white/80 backdrop-blur-sm">
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
              <LayoutGroup id="crumbs">
                <AnimatePresence mode="wait">
                  {showEllipsis && (
                    <motion.li
                      key={`ellipsis${parentFolder?.id}`}
                      layout
                      {...crumbMotionProps}
                      className="mx-1 text-slate-400"
                    >
                      <MoreHorizontal size="12" />
                    </motion.li>
                  )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  {parentFolder && (
                    <motion.div
                      key={`parent${parentFolder?.id}`}
                      layout
                      {...crumbMotionProps}
                      className="flex items-center"
                    >
                      <CrumbItem
                        active={false}
                        to={`/folders/${parentFolder.id}`}
                      >
                        {parentFolder.title}
                      </CrumbItem>
                      <ChevronRight size="12" className="text-slate-400/80" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {currentFolder && (
                    <motion.div
                      key={`current${currentFolder?.id}`}
                      layout
                      {...crumbMotionProps}
                      className="flex items-center"
                    >
                      <CrumbItem active to={`/folders/${currentFolder.id}`}>
                        {currentFolder.title}
                      </CrumbItem>
                    </motion.div>
                  )}
                </AnimatePresence>
              </LayoutGroup>
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
                key={`layout${pathname}`}
                className="min-h-screen"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.1 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="absolute bottom-4 right-4">
            <button
              type="button"
              className="border p-1.5 rounded-full text-slate-500 shadow-sm bg-gradient-to-b from-white/80 to-white/90 hover:from-white/90 hover:to-white/100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50"
            >
              <Menu size="18" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
