'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function loginUser(nipp: string, pass: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { nipp },
    });

    if (!user || user.password !== pass) {
      return { success: false, error: 'NIPP atau password salah!' };
    }

    // Simpan session cookie (1 hari)
    const cookieStore = await cookies();
    cookieStore.set('user_session', JSON.stringify({
      id: user.id,
      nipp: user.nipp,
      nama: user.nama,
      role: user.role,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return { success: true, user: { nama: user.nama, role: user.role } };
  } catch (error) {
    console.error('Error login:', error);
    return { success: false, error: 'Terjadi kesalahan pada server!' };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('user_session');
  return { success: true };
}