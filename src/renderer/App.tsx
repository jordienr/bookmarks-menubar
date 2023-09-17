import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { CreateBookmark } from '@/pages/bookmarks/create';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { About } from '@/pages/About';
import { Toaster } from 'sonner';
import { Start } from '@/pages/Start';
import { Settings } from '../pages/Settings';
import { useEffect } from 'react';
import { isURL } from '@/lib/utils';
import { EditBookmark } from '@/pages/bookmarks/edit';
import 'tailwindcss/tailwind.css';
import { EditFolder } from '@/pages/folders/edit';
import { ViewFolder } from '@/pages/folders/view';
import { DeleteFolder } from '@/pages/folders/delete';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useMainStore } from '@/stores/bookmarks';

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const store = useMainStore();

  function onDragEnd(e: DragEndEvent) {
    console.log(e.active.data);
    const isFolder = e.active.data.current?.type === 'folder';
    const isBookmark = e.active.data.current?.type === 'bookmark';
    if (isBookmark) {
      console.log('bookmark');
      const bookmarkId = e.active.id;
      const folderId = e.over?.id;

      if (!bookmarkId || !folderId) {
        console.log('no bookmark or folder id');
        return;
      }

      const bookmark = store.bookmarks.find((b) => b.id === bookmarkId);

      if (!bookmark) {
        console.log('no bookmark found');
        return;
      }

      store.updateBookmark({
        ...bookmark,
        folderId,
      });

      return;
    }
    if (isFolder) {
      console.log('folder');
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <DndContext onDragEnd={(e) => onDragEnd(e)}>
        <Toaster />
        <Router>
          <Routes>
            <Route index element={<Start />} />
            <Route path="bookmarks" element={<Start />}>
              <Route path=":id/edit" element={<EditBookmark />} />
            </Route>
            <Route path="folders/:id" element={<ViewFolder />} />
            <Route path="folders/:id/edit" element={<EditFolder />} />
            <Route path="folders/:id/delete" element={<DeleteFolder />} />
            <Route path="settings" element={<Settings />} />
            <Route path="about" element={<About />} />
          </Routes>
        </Router>
      </DndContext>
    </QueryClientProvider>
  );
}
