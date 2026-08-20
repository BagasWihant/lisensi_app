'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addEnvironment(licenseId: number, formData: FormData) {
  const key = formData.get('key') as string;
  const value = formData.get('value') as string;

  if (!key || !value) {
    return;
  }

  const rows = await db.execute('SELECT environments FROM licenses WHERE id = ?', [licenseId]) as Record<string, unknown>[];
  const license = rows?.[0];

  if (!license) return;

  let environments: Record<string, string> = {};
  if (license.environments) {
    try {
      environments = typeof license.environments === 'string' ? JSON.parse(license.environments) : license.environments;
    } catch (e) {
      console.error(e);
    }
  }

  environments[key] = value;

  await db.execute(
    'UPDATE licenses SET environments = ? WHERE id = ?',
    [JSON.stringify(environments), licenseId]
  );
  
  revalidatePath(`/admin/dashboard/${licenseId}`);
}

export async function removeEnvironment(licenseId: number, keyToRemove: string) {
  const rows = await db.execute('SELECT environments FROM licenses WHERE id = ?', [licenseId]) as Record<string, unknown>[];
  const license = rows?.[0];

  if (!license) return;

  let environments: Record<string, string> = {};
  if (license.environments) {
    try {
      environments = typeof license.environments === 'string' ? JSON.parse(license.environments) : license.environments;
    } catch (e) {
      console.error(e);
    }
  }

  delete environments[keyToRemove];

  await db.execute(
    'UPDATE licenses SET environments = ? WHERE id = ?',
    [JSON.stringify(environments), licenseId]
  );
  
  revalidatePath(`/admin/dashboard/${licenseId}`);
}
