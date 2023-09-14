import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Bookmark = {
  id: string;
  title: string;
  url: string;
  folderId?: string;
  order: number;
};

type Folder = {
  id: string;
  title: string;
  parentFolderId?: string;
  order: number;
};

interface MainStore {
  bookmarks: Bookmark[];
  folders: Folder[];
  createFolder: (f: Folder) => void;
  getFolderById: (id: string) => Folder | undefined;
  updateFolder: (f: Folder) => void;
  removeFolder: (f: Folder) => void;
  pastedURL?: string;
  getOrphanBookmarks: () => Bookmark[];
  getBookmarksByFolderId: (folderId: string) => Bookmark[];
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
      getOrphanBookmarks: () => {
        return get().bookmarks.filter((b) => !b.folderId);
      },
      getBookmarksByFolderId: (folderId) => {
        return get().bookmarks.filter((b) => b.folderId === folderId);
      },
      createFolder: (f) => {
        set((state) => ({
          folders: [...state.folders, f],
        }));
      },
      getFolderById: (id) => {
        return get().folders.find((f) => f.id === id);
      },
      updateFolder: (f) => {
        set((state) => ({
          folders: state.folders.map((folder) => {
            if (folder.id === f.id) {
              return f;
            }
            return folder;
          }),
        }));
      },
      removeFolder: (f) => {
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== f.id),
        }));
      },
    }),
    {
      name: 'main-storage',
    }
  )
);
