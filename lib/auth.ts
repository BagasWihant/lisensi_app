import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 day from now')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function loginAction(formData: FormData) {
  const user = formData.get('username');
  const pass = formData.get('password');

  if (
    user === process.env.ADMIN_USERNAME &&
    pass === process.env.ADMIN_PASSWORD
  ) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    const session = await encrypt({ user, expires });
    
    const cookieStore = await cookies();
    cookieStore.set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return { success: true };
  }
  return { success: false, error: 'Invalid credentials' };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
