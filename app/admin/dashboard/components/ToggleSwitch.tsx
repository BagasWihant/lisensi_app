'use client';

import { useTransition } from 'react';
import { toggleStatus } from '../actions';

interface ToggleSwitchProps {
  id: number;
  initialStatus: 'on' | 'off';
}

export default function ToggleSwitch({ id, initialStatus }: ToggleSwitchProps) {
  const [isPending, startTransition] = useTransition();

  // Optimistic UI update could be added here using useOptimistic,
  // but for simplicity, we just rely on standard transition for the actual state.
  // The switch visually toggles immediately for native feel if we had local state,
  // but with useTransition, it waits. Let's add local optimistic state.
  
  const isOn = initialStatus === 'on';

  const handleToggle = () => {
    startTransition(() => {
      toggleStatus(id, initialStatus);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`relative inline-flex h-[31px] w-[51px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus focus-visible:ring-opacity-75 ${
        isOn ? 'bg-[#34C759]' : 'bg-[#E9E9EB]'
      } ${isPending ? 'opacity-70' : ''}`}
    >
      <span className="sr-only">Toggle status</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-[27px] w-[27px] transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          isOn ? 'translate-x-[20px]' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
