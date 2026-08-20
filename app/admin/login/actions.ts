'use server';

import { redirect } from 'next/navigation';
import { loginAction } from '@/lib/auth';

export async function login(prevState: any, formData: FormData) {
  const res = await loginAction(formData);
  if (res?.success) {
    redirect('/admin/dashboard');
  } else {
    return { error: res.error };
  }
}
