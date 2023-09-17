import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createId, getFaviconURL, getTitleFromURL, isURL } from '@/lib/utils';
import { Folder, useMainStore } from '@/stores/bookmarks';
import { FolderIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export function CreateBookmark({
  onCreate,
  onCancel,
}: {
  onCreate: () => void;
  onCancel: () => void;
}) {
  const store = useMainStore();
  const navigate = useNavigate();
  const { id: folderId } = useParams();

  const [title, setTitle] = React.useState('');
  const [url, setURL] = React.useState('');
  const [faviconURL, setFaviconURL] = React.useState('');
  const [selectedFolder, setSelectedFolder] = React.useState<
    Folder | undefined
  >(store.getFolderById(folderId || ''));

  const alreadyExists = store.bookmarks.find((b) => b.url === url);

  const folderOfAlreadyExistingBookmark = store.bookmarks.find(
    (b) => b.url === url
  )?.folderId;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log({ title, url });

    store.addBookmark({
      id: createId(),
      title,
      url,
      order: store.bookmarks.length,
      folderId: folderId || undefined,
    });

    store.setPastedURL('');

    onCreate();
  }

  useEffect(() => {
    // if (store.pastedURL?.url) {
    //   setURL(store.pastedURL.url);
    //   setTitle(getTitleFromURL(store.pastedURL.url) || '');
    //   setSelectedFolder(store.getFolderById(store.pastedURL.folderId || ''));
    //   toast.success('Bookmark pasted successfully!');
    //   // store.setPastedURL({ url: '' });
    // }
  }, [store.pastedURL, store]);

  useEffect(() => {
    if (isURL(url)) {
      setFaviconURL(getFaviconURL(url));
    }
  }, [url]);

  return (
    <div className="">
      {alreadyExists && (
        <div className="mt-2 text-sm text-red-500">
          A bookmark with this URL already exists <br />
          {folderOfAlreadyExistingBookmark && (
            <span>
              {' '}
              in the{' '}
              <Link
                to={`/folders/${folderOfAlreadyExistingBookmark}`}
                className="font-medium underline"
              >
                {store.getFolderById(folderOfAlreadyExistingBookmark)?.title}
              </Link>{' '}
              folder
            </span>
          )}
        </div>
      )}

      <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <Label>Favicon</Label>
          {faviconURL ? (
            <img
              src={faviconURL}
              alt=""
              className="w-8 h-8 inline-block mr-2 rounded-lg"
            />
          ) : (
            <div className="h-8 w-8 bg-slate-300 rounded-lg mr-2" />
          )}
        </div>
        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            value={url}
            id="url"
            onChange={(e) => setURL(e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="title"
            placeholder="Name"
          />
        </div>
        {selectedFolder && (
          <div className="">
            <Label>Folder</Label>
            <div className="flex gap-1 items-center mt-1">
              <div className="mr-2 h-7 w-7 rounded-full text-yellow-500 bg-yellow-100 flex items-center justify-center">
                <FolderIcon size="18" />
              </div>
              <div>
                <span>{selectedFolder.title}</span>
              </div>
            </div>
          </div>
        )}
        <div className="actions">
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={() => {
              setTitle('');
              setURL('');
              setFaviconURL('');
              navigate('/');
              store.setPastedURL('');
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Add bookmark</Button>
        </div>
      </form>
    </div>
  );
}
