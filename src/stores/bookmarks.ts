import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UniqueId = string | number;

export type Bookmark = {
  id: UniqueId;
  title: string;
  url: string;
  folderId?: UniqueId;
  order: number;
  createdAt?: number;
};

export type Folder = {
  id: UniqueId;
  title: string;
  parentFolderId?: UniqueId;
  order: number;
  createdAt?: number;
};

interface MainStore {
  bookmarks: Bookmark[];
  folders: Folder[];
  createFolder: (f: Folder) => void;
  getFolderById: (id: UniqueId) => Folder | undefined;
  updateFolder: (f: Folder) => void;
  removeFolder: (f: Folder) => void;
  pastedURL?: string;
  getOrphanBookmarks: () => Bookmark[];
  getOrphanFolders: () => Folder[];
  getBookmarksByFolderId: (folderId: UniqueId) => Bookmark[];
  getFoldersByFolderId: (folderId: UniqueId) => Folder[];
  setPastedURL: (url: string) => void;
  addBookmark: (b: Bookmark) => void;
  removeBookmark: (b: Bookmark) => void;
  updateBookmark: (b: Bookmark) => void;
}

export const useMainStore = create<MainStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      folders: [],
      pastedURL: undefined,
      setPastedURL: (url) => {
        set((state) => ({
          pastedURL: url,
        }));
      },
      updateBookmark: (b) => {
        set((state) => ({
          bookmarks: state.bookmarks.map((bookmark) => {
            if (bookmark.id === b.id) {
              return b;
            }
            return bookmark;
          }),
        }));
      },
      addBookmark: (b) => {
        set((state) => ({
          bookmarks: [...state.bookmarks, { ...b, createdAt: Date.now() }],
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
      getOrphanFolders: () => {
        return get().folders.filter((f) => !f.parentFolderId);
      },
      getBookmarksByFolderId: (folderId) => {
        return get().bookmarks.filter((b) => b.folderId === folderId);
      },
      getFoldersByFolderId: (folderId) => {
        return get().folders.filter((f) => f.parentFolderId === folderId);
      },
      createFolder: (f) => {
        set((state) => ({
          folders: [...state.folders, { ...f, createdAt: Date.now() }],
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
