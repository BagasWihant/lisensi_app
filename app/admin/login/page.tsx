'use client';

import { useActionState } from 'react';
import { login } from './actions';

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas-parchment p-6">
      <div className="bg-canvas border border-hairline rounded-lg p-10 max-w-sm w-full">
        <h1 className="text-[34px] font-semibold tracking-tight text-ink mb-2 text-center">
          Admin
        </h1>
        <p className="text-center text-[17px] text-ink-muted-48 mb-8 leading-snug">
          Sign in to manage licenses
        </p>

        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <input
              name="username"
              type="text"
              placeholder="Username"
              required
              className="bg-canvas-parchment border border-divider-soft rounded-sm px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-primary-focus transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="bg-canvas-parchment border border-divider-soft rounded-sm px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-primary-focus transition-all"
            />
          </div>

          {state?.error && (
            <p className="text-red-500 text-[14px] text-center mt-2">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-4 bg-primary text-white rounded-pill py-[11px] px-[22px] text-[17px] font-normal hover:scale-[0.98] active:scale-[0.95] transition-transform flex justify-center disabled:opacity-50"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
