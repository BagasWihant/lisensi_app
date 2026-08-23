'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { logoutAction } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function addLicense(formData: FormData) {
  const name = formData.get('name') as string;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';
  for (let i = 0; i < 15; i++) {
    randomId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  await db.execute(
    'INSERT INTO licenses (name, license_id, status) VALUES (?, ?, ?)',
    [name || 'Unknown', randomId, 'on']
  );
  revalidatePath('/admin/dashboard');
}

export async function toggleStatus(id: number, currentStatus: string) {
  const newStatus = currentStatus === 'on' ? 'off' : 'on';
  await db.execute(
    'UPDATE licenses SET status = ? WHERE id = ?',
    [newStatus, id]
  );
  revalidatePath('/admin/dashboard');
}

export async function deleteLicense(id: number) {
  await db.execute('DELETE FROM licenses WHERE id = ?', [id]);
  revalidatePath('/admin/dashboard');
}

export async function unbindDevice(id: number) {
  await db.execute('UPDATE licenses SET machine_id = NULL WHERE id = ?', [id]);
  revalidatePath('/admin/dashboard');
}

export async function logout() {
  await logoutAction();
  redirect('/admin/login');
}
