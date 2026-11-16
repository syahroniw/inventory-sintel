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
// Ambil semua data karyawan untuk halaman Manajemen Akun
export async function getSemuaKaryawan() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, nama: true, nipp: true, createdAt: true } // Jangan tarik passwordnya wkwk
    });
    return { success: true, data: users };
  } catch (error) {
    console.error('Error fetch users:', error);
    return { success: false, error: 'Gagal menarik data karyawan!' };
  }
}

// Tambah karyawan / admin baru
export async function tambahKaryawan(data: { nama: string; nipp: string; password: string }) {
  try {
    const existing = await prisma.user.findUnique({ where: { nipp: data.nipp } });
    if (existing) return { success: false, error: 'NIPP sudah terdaftar di sistem!' };

    await prisma.user.create({
      data: {
        nama: data.nama,
        nipp: data.nipp,
        password: data.password, // Catatan: Di dunia nyata ini wajib di-bcrypt (hash) ya Ron!
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Error tambah user:', error);
    return { success: false, error: 'Gagal menambahkan karyawan baru!' };
  }
}

// Hapus akun karyawan / admin
export async function hapusKaryawan(id: string) {
  try {
    await prisma.user.delete({
      where: { id: id }
    });
    return { success: true };
  } catch (error) {
    console.error('Error delete user:', error);
    return { success: false, error: 'Gagal menghapus akun karyawan!' };
  }
}