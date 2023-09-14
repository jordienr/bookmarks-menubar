import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createId } from '@/lib/utils';
import { useMainStore } from '@/stores/bookmarks';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function CreateBookmark() {
  const store = useMainStore();
  const navigate = useNavigate();

  const [title, setTitle] = React.useState('');
  const [url, setURL] = React.useState(store.pastedURL || '');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log({ title, url });

    store.addBookmark({
      id: createId(),
      title,
      url,
    });

    store.setPastedURL('');

    navigate('/');
  }

  return (
    <div className="p-4">
      <h1 className="">Add a bookmark</h1>
      <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            id="title"
            placeholder="Name"
          />
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
        <div className="actions">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button type="submit">Add bookmark</Button>
        </div>
      </form>
    </div>
  );
}
