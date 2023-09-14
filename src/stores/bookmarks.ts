import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Bookmark = {
  id: string;
  title: string;
  url: string;
  folderId?: string;
};

type Folder = {
  id: string;
  title: string;
  parentFolderId?: string;
};

interface MainStore {
  bookmarks: Bookmark[];
  folders: Folder[];
  createFolder: (f: Folder) => void;
  pastedURL?: string;
  setPastedURL: (url: string) => void;
  addBookmark: (b: Bookmark) => void;
  removeBookmark: (b: Bookmark) => void;
}

export const useMainStore = create<MainStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      folders: [],
      pastedURL: undefined,
      setPastedURL: (url) => {
        set(() => ({
          pastedURL: url,
        }));
      },
      addBookmark: (b) => {
        set((state) => ({
          bookmarks: [...state.bookmarks, b],
        }));
      },
      removeBookmark: (b) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== b.id),
        }));
      },
      createFolder: (f) => {
        set((state) => ({
          folders: [...state.folders, f],
        }));
      },
    }),
    {
      name: 'main-storage',
    }
  )
);
