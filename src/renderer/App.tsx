import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { CreateBookmark } from '@/pages/bookmarks/create';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { About } from '@/pages/About';
import { Toaster } from 'sonner';
import { Start } from '@/pages/Start';
import { useEffect } from 'react';
import { isURL } from '@/lib/utils';
import { Settings } from '../pages/Settings';
import 'tailwindcss/tailwind.css';

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
          <Route path="/" element={<Start />} />
          <Route path="/bookmarks/create" element={<CreateBookmark />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
