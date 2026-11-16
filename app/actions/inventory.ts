'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. Ambil Semua Data Inventory
export async function getInventory() {
  try {
    const data = await prisma.barang.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error get inventory:', error);
    return { success: false, error: 'Gagal memuat inventori' };
  }
}

// 2. Tambah Barang Baru (Otomatis Catat Mutasi Masuk Awal)
export async function addBarang(data: {
  nama: string;
  idBarang: string;
  kategori: string;
  lokasi: string;
  jumlahAwal: number;
  satuan: string;
}) {
  try {
    const existing = await prisma.barang.findUnique({ where: { idBarang: data.idBarang } });
    if (existing) {
      return { success: false, error: 'ID Barang sudah terdaftar!' };
    }

    let user = await prisma.user.findFirst();

    const barang = await prisma.barang.create({
      data: {
        nama: data.nama,
        idBarang: data.idBarang,
        kategori: data.kategori,
        lokasi: data.lokasi,
        jumlahAwal: data.jumlahAwal,
        jumlahAkhir: data.jumlahAwal,
        satuan: data.satuan.toUpperCase(),
      },
    });

    if (user) {
      await prisma.mutasi.create({
        data: {
          barangId: barang.id,
          userId: user.id,
          tipe: 'MASUK',
          jumlah: data.jumlahAwal,
          tanggal: new Date().toLocaleDateString('id-ID'),
          keterangan: 'Stok Awal / Input Barang Baru',
        },
      });
    }

    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error add barang:', error);
    return { success: false, error: 'Gagal menambahkan barang!' };
  }
}

// 3. Restock Barang (+ Stok) -> Tipe MASUK
export async function restockBarang(data: { id: string; jumlahTambah: number; tanggal: string; userId?: string }) {
  try {
    const barang = await prisma.barang.findUnique({ where: { id: data.id } });
    if (!barang) return { success: false, error: 'Barang tidak ditemukan' };

    let user = await prisma.user.findFirst();
    const activeUserId = data.userId || user?.id;
    if (!activeUserId) return { success: false, error: 'User tidak ditemukan!' };

    const newAkhir = barang.jumlahAkhir + Number(data.jumlahTambah);

    await prisma.$transaction([
      prisma.barang.update({
        where: { id: data.id },
        data: { jumlahAkhir: newAkhir },
      }),
      prisma.mutasi.create({
        data: {
          barangId: barang.id,
          userId: activeUserId,
          tipe: 'MASUK',
          jumlah: Number(data.jumlahTambah),
          tanggal: data.tanggal,
          keterangan: 'Restock / Penambahan Stok',
        },
      }),
    ]);

    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error restock:', error);
    return { success: false, error: 'Gagal merestock barang!' };
  }
}

// 4. Pakai Barang Habis Pakai / Spare Part -> Tipe KELUAR
export async function recordUsage(data: {
  id: string;
  jumlahPakai: number;
  tanggal: string;
  keterangan?: string;
  userId?: string;
}) {
  try {
    const barang = await prisma.barang.findUnique({ where: { id: data.id } });
    if (!barang) return { success: false, error: 'Barang tidak ditemukan' };
    if (barang.jumlahAkhir < data.jumlahPakai) return { success: false, error: 'Stok tidak cukup!' };

    let user = await prisma.user.findFirst();
    const activeUserId = data.userId || user?.id;
    if (!activeUserId) return { success: false, error: 'User tidak terdaftar!' };

    const newAkhir = barang.jumlahAkhir - Number(data.jumlahPakai);

    await prisma.$transaction([
      prisma.barang.update({
        where: { id: data.id },
        data: { jumlahAkhir: newAkhir },
      }),
      prisma.mutasi.create({
        data: {
          barangId: barang.id,
          userId: activeUserId,
          tipe: 'KELUAR',
          jumlah: Number(data.jumlahPakai),
          tanggal: data.tanggal,
          keterangan: data.keterangan || 'Barang dipakai / diambil',
        },
      }),
    ]);

    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error record usage:', error);
    return { success: false, error: 'Gagal mencatat penggunaan!' };
  }
}

// 5. Pinjam Alat Kerja -> Tipe KELUAR
export async function pinjamAlat(data: {
  id: string;
  jumlah: number;
  tanggal: string;
  keterangan: string;
  userId?: string;
}) {
  try {
    const barang = await prisma.barang.findUnique({ where: { id: data.id } });
    if (!barang) return { success: false, error: 'Alat tidak ditemukan' };
    if (barang.jumlahAkhir < data.jumlah) return { success: false, error: 'Stok alat tidak mencukupi untuk dipinjam!' };

    let user = await prisma.user.findFirst();
    const activeUserId = data.userId || user?.id;
    if (!activeUserId) return { success: false, error: 'User tidak terdaftar!' };

    const newAkhir = barang.jumlahAkhir - Number(data.jumlah);

    await prisma.$transaction([
      prisma.barang.update({
        where: { id: data.id },
        data: { jumlahAkhir: newAkhir },
      }),
      prisma.mutasi.create({
        data: {
          barangId: barang.id,
          userId: activeUserId,
          tipe: 'KELUAR',
          jumlah: Number(data.jumlah),
          tanggal: data.tanggal,
          keterangan: `PINJAM: ${data.keterangan}`,
        },
      }),
    ]);

    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error pinjam alat:', error);
    return { success: false, error: 'Gagal mencatat peminjaman alat!' };
  }
}

// 6. Kembalikan Alat Kerja -> Tipe MASUK
export async function kembalikanAlat(data: {
  id: string;
  jumlah: number;
  tanggal: string;
  keterangan: string;
  userId?: string;
}) {
  try {
    const barang = await prisma.barang.findUnique({ where: { id: data.id } });
    if (!barang) return { success: false, error: 'Alat tidak ditemukan' };

    let user = await prisma.user.findFirst();
    const activeUserId = data.userId || user?.id;
    if (!activeUserId) return { success: false, error: 'User tidak terdaftar!' };

    const newAkhir = barang.jumlahAkhir + Number(data.jumlah);

    await prisma.$transaction([
      prisma.barang.update({
        where: { id: data.id },
        data: { jumlahAkhir: newAkhir },
      }),
      prisma.mutasi.create({
        data: {
          barangId: barang.id,
          userId: activeUserId,
          tipe: 'MASUK',
          jumlah: Number(data.jumlah),
          tanggal: data.tanggal,
          keterangan: `KEMBALI: ${data.keterangan}`,
        },
      }),
    ]);

    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error kembalikan alat:', error);
    return { success: false, error: 'Gagal mencatat pengembalian alat!' };
  }
}

// 7. Hapus Barang (Aman dari Foreign Key Constraint Mutasi)
export async function deleteBarang(id: string) {
  try {
    // Hapus relasi mutasinya dulu biar database nggak ngamuk
    await prisma.mutasi.deleteMany({ where: { barangId: id } });
    await prisma.barang.delete({ where: { id } });

    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error delete barang:', error);
    return { success: false, error: 'Gagal menghapus barang!' };
  }
}

// 8. Ambil Laporan Mutasi (Untuk Halaman Laporan & Export PDF)
export async function getLaporanMutasi() {
  try {
    const data = await prisma.mutasi.findMany({
      include: {
        barang: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error get laporan mutasi:', error);
    return { success: false, error: 'Gagal memuat laporan mutasi' };
  }
}

// 9. Statistik Dashboard Utama
export async function getDashboardStats() {
  try {
    const allItems = await prisma.barang.findMany();
    const userCount = await prisma.user.count();

    let categories = { ak: 0, hp: 0, sp: 0 };
    let criticalCount = 0;

    allItems.forEach((item) => {
      if (item.kategori === 'Alat Kerja') categories.ak += 1;
      if (item.kategori === 'Barang Habis Pakai') categories.hp += 1;
      if (item.kategori === 'Spare Part / Suku Cadang') categories.sp += 1;
      if (item.jumlahAkhir <= 3) criticalCount += 1;
    });

    return {
      success: true,
      stats: {
        totalItems: allItems.length,
        userCount,
        categories,
        criticalCount,
      },
    };
  } catch (error) {
    console.error('Error dashboard stats:', error);
    return { success: false, error: 'Gagal mengambil statistik' };
  }
}