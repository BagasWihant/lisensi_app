'use client';

import { useTransition, useRef } from 'react';
import { addEnvironment } from '../actions';

export default function AddEnvForm({ licenseId }: { licenseId: number }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addEnvironment(licenseId, formData);
      formRef.current?.reset();
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex gap-4 items-end">
      <div className="flex-1">
        <label htmlFor="key" className="block text-[12px] font-medium text-ink-muted-48 mb-1">Key</label>
        <input 
          type="text" 
          id="key" 
          name="key" 
          required
          placeholder="e.g. production_url"
          className="w-full px-3 py-2 bg-canvas border border-hairline rounded-sm text-[14px] text-ink outline-none focus:border-primary transition-colors"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="value" className="block text-[12px] font-medium text-ink-muted-48 mb-1">Value</label>
        <input 
          type="text" 
          id="value" 
          name="value" 
          required
          placeholder="e.g. https://api.prod.example.com"
          className="w-full px-3 py-2 bg-canvas border border-hairline rounded-sm text-[14px] text-ink outline-none focus:border-primary transition-colors"
        />
      </div>
      <button 
        type="submit" 
        disabled={isPending}
        className="px-4 py-2 bg-ink text-white text-[14px] font-medium rounded-sm hover:bg-ink-muted-80 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Adding...' : 'Add Environment'}
      </button>
    </form>
  );
}
