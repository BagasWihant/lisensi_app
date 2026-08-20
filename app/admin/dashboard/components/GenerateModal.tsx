'use client';

import { useState } from 'react';
import { addLicense } from '../actions';

export default function GenerateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    await addLicense(formData);
    setIsPending(false);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary text-white rounded-pill py-[11px] px-[22px] text-[17px] hover:scale-[0.98] active:scale-[0.95] transition-transform"
      >
        Generate License
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-canvas border border-hairline rounded-lg p-8 w-full max-w-sm shadow-2xl transform scale-100 transition-transform">
            <h2 className="text-[28px] font-semibold tracking-tight text-ink mb-4">
              New License
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                name="name"
                type="text"
                placeholder="License holder name"
                required
                className="bg-canvas-parchment border border-divider-soft rounded-sm px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-primary-focus transition-all"
                autoFocus
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="bg-surface-pearl text-ink-muted-80 rounded-md py-2 px-4 text-[14px] font-medium border border-divider-soft hover:opacity-80 transition-opacity"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary text-white rounded-pill py-[9px] px-[18px] text-[14px] font-normal hover:scale-[0.98] active:scale-[0.95] transition-transform flex justify-center disabled:opacity-50"
                >
                  {isPending ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
