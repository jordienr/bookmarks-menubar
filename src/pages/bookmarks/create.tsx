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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = (
      e.currentTarget.elements.namedItem('title') as HTMLInputElement
    ).value;
    const url = (e.currentTarget.elements.namedItem('url') as HTMLInputElement)
      .value;

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
          <Input autoFocus id="title" placeholder="Name" />
        </div>
        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            value={store.pastedURL || ''}
            id="url"
            placeholder="https://example.com"
          />
        </div>
        <div className="actions">
          <Button type="submit">Add bookmark</Button>
        </div>
      </form>
    </div>
  );
}
