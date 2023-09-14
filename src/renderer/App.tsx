import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
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

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router>
        <Routes>
          <Route index element={<Start />} />
          <Route path="bookmarks" element={<Start />}>
            <Route path=":id/edit" element={<EditBookmark />} />
          </Route>
          <Route path="bookmarks/create" element={<CreateBookmark />} />
          <Route path="folders/:id" element={<ViewFolder />} />
          <Route path="folders/:id/edit" element={<EditFolder />} />
          <Route path="folders/:id/delete" element={<DeleteFolder />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
