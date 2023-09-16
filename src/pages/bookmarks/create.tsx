import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createId, getFaviconURL, getTitleFromURL, isURL } from '@/lib/utils';
import { useMainStore } from '@/stores/bookmarks';
import { Loader } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function CreateBookmark() {
  const store = useMainStore();
  const navigate = useNavigate();

  const [title, setTitle] = React.useState('');
  const [url, setURL] = React.useState('');
  const [faviconURL, setFaviconURL] = React.useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log({ title, url });

    store.addBookmark({
      id: createId(),
      title,
      url,
      order: store.bookmarks.length,
    });

    store.setPastedURL('');

    navigate('/');
  }

  useEffect(() => {
    if (store.pastedURL) {
      setURL(store.pastedURL);
      setTitle(getTitleFromURL(store.pastedURL) || '');
      toast.success('Bookmark pasted successfully!');
    }
  }, [store.pastedURL]);

  useEffect(() => {
    if (isURL(url)) {
      setFaviconURL(getFaviconURL(url));
    }
  }, [url]);

  return (
    <div className="p-4">
      <h1 className="">Add a bookmark</h1>
      <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          {faviconURL ? (
            <img
              src={faviconURL}
              alt=""
              className="w-8 h-8 inline-block mr-2"
            />
          ) : (
            <Loader className="w-12 h-12 animate-spin rounded-full inline-block mr-2" />
          )}
        </div>
        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            value={store.pastedURL || ''}
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
        <div className="actions">
          <Button size="sm" variant="ghost" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button type="submit">Add bookmark</Button>
        </div>
      </form>
    </div>
  );
}
